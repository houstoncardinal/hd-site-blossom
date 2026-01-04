import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  servicePrice: number;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received booking confirmation request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingConfirmationRequest = await req.json();
    console.log("Processing booking confirmation for:", booking.clientEmail);

    // Format the date nicely
    const formattedDate = new Date(booking.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px;">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <h1 style="color: #c9a96e; font-size: 32px; font-weight: 300; letter-spacing: 4px; margin: 0;">
                        HDA <span style="font-weight: 400;">STUDIO</span>
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="background-color: #141414; border: 1px solid #262626; padding: 40px;">
                      <h2 style="color: #fafafa; font-size: 28px; font-weight: 300; margin: 0 0 10px 0; text-align: center;">
                        Booking Confirmed!
                      </h2>
                      <p style="color: #a1a1aa; font-size: 14px; text-align: center; margin: 0 0 30px 0;">
                        Thank you for choosing HDA Studio, ${booking.clientName}
                      </p>
                      
                      <!-- Appointment Details -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border: 1px solid #262626;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: #71717a; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 15px 0;">
                              Appointment Details
                            </p>
                            
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="color: #a1a1aa; font-size: 13px;">Service:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <span style="color: #fafafa; font-size: 14px; font-weight: 500;">${booking.serviceName}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="color: #a1a1aa; font-size: 13px;">Date:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <span style="color: #fafafa; font-size: 14px;">${formattedDate}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="color: #a1a1aa; font-size: 13px;">Time:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <span style="color: #fafafa; font-size: 14px;">${booking.appointmentTime}</span>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2" style="padding: 15px 0 0 0; border-top: 1px solid #262626;">
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="color: #a1a1aa; font-size: 13px;">Total:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <span style="color: #c9a96e; font-size: 18px; font-weight: 500;">$${booking.servicePrice}</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      ${booking.notes ? `
                      <div style="margin-top: 20px; padding: 15px; background-color: #1a1a1a; border: 1px solid #262626;">
                        <p style="color: #71717a; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px 0;">
                          Special Requests
                        </p>
                        <p style="color: #a1a1aa; font-size: 13px; margin: 0; line-height: 1.5;">
                          ${booking.notes}
                        </p>
                      </div>
                      ` : ''}
                      
                      <!-- Location -->
                      <div style="margin-top: 30px; text-align: center;">
                        <p style="color: #71717a; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px 0;">
                          Studio Location
                        </p>
                        <p style="color: #fafafa; font-size: 14px; margin: 0;">
                          123 Beauty Lane, Suite 100<br>
                          Los Angeles, CA 90028
                        </p>
                      </div>
                      
                      <!-- CTA -->
                      <div style="margin-top: 30px; text-align: center;">
                        <p style="color: #a1a1aa; font-size: 13px; margin: 0;">
                          Questions? Contact us at<br>
                          <a href="mailto:hello@hdastudio.com" style="color: #c9a96e; text-decoration: none;">hello@hdastudio.com</a>
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 30px 0;">
                      <p style="color: #52525b; font-size: 11px; margin: 0;">
                        © ${new Date().getFullYear()} HDA Studio. All rights reserved.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "HDA Studio <onboarding@resend.dev>",
        to: [booking.clientEmail],
        subject: `Booking Confirmed - ${booking.serviceName} on ${formattedDate}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-booking-confirmation function:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
