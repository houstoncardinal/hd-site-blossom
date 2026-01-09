import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-DEPOSIT-CHECKOUT] ${step}${detailsStr}`);
};

interface AddOnItem {
  name: string;
  price: number;
}

interface CheckoutRequest {
  priceId: string;
  serviceName: string;
  fullPrice: number;
  depositAmount: number;
  remainingBalance: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
  addOns?: AddOnItem[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: CheckoutRequest = await req.json();
    logStep("Request body received", { 
      priceId: body.priceId, 
      serviceName: body.serviceName,
      depositAmount: body.depositAmount,
      addOnsCount: body.addOns?.length || 0
    });

    const {
      priceId,
      serviceName,
      fullPrice,
      depositAmount,
      remainingBalance,
      customerEmail,
      customerName,
      customerPhone,
      appointmentDate,
      appointmentTime,
      notes,
      addOns = [],
    } = body;

    // Validate required fields
    if (!serviceName || !customerEmail || !customerName || depositAmount <= 0) {
      throw new Error("Missing required fields: serviceName, customerEmail, customerName, depositAmount");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer already exists
    logStep("Checking for existing customer", { email: customerEmail });
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      // Create new customer
      const newCustomer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        metadata: {
          source: 'hda_studio_booking',
        },
      });
      customerId = newCustomer.id;
      logStep("Created new customer", { customerId });
    }

    // Build description with add-ons
    let serviceDescription = serviceName;
    if (addOns.length > 0) {
      const addOnNames = addOns.map(a => a.name).join(', ');
      serviceDescription += ` + ${addOnNames}`;
    }

    // Build metadata for the session
    const metadata: Record<string, string> = {
      service_name: serviceName,
      full_price: String(fullPrice),
      deposit_amount: String(depositAmount),
      remaining_balance: String(remainingBalance),
      customer_name: customerName,
      customer_email: customerEmail,
    };

    if (customerPhone) metadata.customer_phone = customerPhone;
    if (appointmentDate) metadata.appointment_date = appointmentDate;
    if (appointmentTime) metadata.appointment_time = appointmentTime;
    if (notes) metadata.notes = notes;
    if (addOns.length > 0) {
      metadata.add_ons = JSON.stringify(addOns);
    }

    // Create checkout session with dynamic deposit pricing
    logStep("Creating checkout session with dynamic pricing");
    const origin = req.headers.get("origin") || "https://hdastudio.com";
    
    // Convert deposit to cents for Stripe
    const depositInCents = Math.round(depositAmount * 100);
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `50% Deposit - ${serviceDescription}`,
              description: `Remaining balance of $${remainingBalance.toFixed(2)} due in person at your appointment.`,
            },
            unit_amount: depositInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?canceled=true`,
      metadata,
      payment_intent_data: {
        metadata,
        description: `50% Deposit for ${serviceDescription} - Remaining $${remainingBalance.toFixed(2)} due in person`,
      },
      custom_text: {
        submit: {
          message: `This is a 50% deposit ($${depositAmount.toFixed(2)}). The remaining $${remainingBalance.toFixed(2)} is due in person at your appointment.`,
        },
      },
    });

    logStep("Checkout session created", { 
      sessionId: session.id, 
      url: session.url 
    });

    // Create appointment record in database (pending status)
    if (appointmentDate && appointmentTime) {
      try {
        const { error: dbError } = await supabase
          .from('appointments')
          .insert({
            client_name: customerName,
            client_email: customerEmail,
            client_phone: customerPhone || null,
            service_name: serviceDescription,
            service_price: fullPrice,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            notes: notes || null,
            status: 'pending_payment',
          });

        if (dbError) {
          logStep("Warning: Failed to create appointment record", { error: dbError.message });
        } else {
          logStep("Appointment record created with pending_payment status");
        }
      } catch (dbErr) {
        logStep("Warning: Database operation failed", { error: String(dbErr) });
      }
    }

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});