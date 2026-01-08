import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-DEPOSIT-CHECKOUT] ${step}${detailsStr}`);
};

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

    const body: CheckoutRequest = await req.json();
    logStep("Request body received", { 
      priceId: body.priceId, 
      serviceName: body.serviceName,
      depositAmount: body.depositAmount 
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
    } = body;

    // Validate required fields
    if (!priceId || !serviceName || !customerEmail || !customerName) {
      throw new Error("Missing required fields: priceId, serviceName, customerEmail, customerName");
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

    // Create checkout session for 50% deposit
    logStep("Creating checkout session");
    const origin = req.headers.get("origin") || "https://hdastudio.com";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?canceled=true`,
      metadata,
      payment_intent_data: {
        metadata,
        description: `50% Deposit for ${serviceName} - Remaining $${remainingBalance.toFixed(2)} due in person`,
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
