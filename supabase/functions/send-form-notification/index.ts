import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const ALLOWED_ORIGINS = [
  "https://hdastudio.com",
  "https://www.hdastudio.com",
  "https://hda-studio.com",
  "https://www.hda-studio.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface FormNotificationRequest {
  formType: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const submission: FormNotificationRequest = await req.json();
    console.log("Processing form notification for:", submission.formType, submission.email);

    const formTypeLabel = submission.formType === 'faq' ? 'FAQ Question' : 'Contact Form';
    const submittedAt = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
                      <h2 style="color: #fafafa; font-size: 24px; font-weight: 300; margin: 0 0 10px 0; text-align: center;">
                        New ${formTypeLabel} Submission
                      </h2>
                      <p style="color: #a1a1aa; font-size: 14px; text-align: center; margin: 0 0 30px 0;">
                        Received on ${submittedAt}
                      </p>
                      
                      <!-- Submission Details -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border: 1px solid #262626;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: #71717a; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 15px 0;">
                              Contact Information
                            </p>
                            
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="color: #a1a1aa; font-size: 13px;">Name:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <span style="color: #fafafa; font-size: 14px; font-weight: 500;">${submission.name}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="color: #a1a1aa; font-size: 13px;">Email:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <a href="mailto:${submission.email}" style="color: #c9a96e; font-size: 14px; text-decoration: none;">${submission.email}</a>
                                </td>
                              </tr>
                              ${submission.phone ? `
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="color: #a1a1aa; font-size: 13px;">Phone:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <a href="tel:${submission.phone}" style="color: #c9a96e; font-size: 14px; text-decoration: none;">${submission.phone}</a>
                                </td>
                              </tr>
                              ` : ''}
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="color: #a1a1aa; font-size: 13px;">Form Type:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <span style="color: #fafafa; font-size: 14px;">${formTypeLabel}</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Message -->
                      <div style="margin-top: 20px; padding: 20px; background-color: #1a1a1a; border: 1px solid #262626;">
                        <p style="color: #71717a; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px 0;">
                          ${submission.formType === 'faq' ? 'Question' : 'Message'}
                        </p>
                        <p style="color: #fafafa; font-size: 14px; margin: 0; line-height: 1.6; white-space: pre-wrap;">
                          ${submission.message}
                        </p>
                      </div>
                      
                      <!-- Quick Reply Button -->
                      <div style="margin-top: 30px; text-align: center;">
                        <a href="mailto:${submission.email}?subject=RE: Your ${formTypeLabel} to HDA Studio" style="display: inline-block; padding: 14px 32px; background-color: #c9a96e; color: #0a0a0a; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 0;">
                          Reply to ${submission.name}
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 30px 0;">
                      <p style="color: #52525b; font-size: 11px; margin: 0;">
                        This is an automated notification from your website's contact form.
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
        to: ["hello@hdastudio.com"], // Replace with actual admin email
        subject: `New ${formTypeLabel}: ${submission.name}`,
        html: emailHtml,
        reply_to: submission.email,
      }),
    });

    const emailData = await emailResponse.json();
    console.log("Email notification sent:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-form-notification function:", errorMessage);
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
