
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendEmail } from "../_shared/email-utils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, fullName }: VerificationEmailRequest = await req.json();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - 3rd Street Music</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 12px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 40px 20px; text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold; font-size: 18px;">3</span>
                </div>
                <span style="color: white; font-weight: bold; font-size: 24px;">3rd Street Music</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to 3rd Street Music!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: white; margin: 0 0 16px 0; font-size: 24px;">
                Hi ${fullName || 'there'}! 👋
              </h2>
              
              <p style="color: #D1D5DB; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Thanks for joining 3rd Street Music! We're excited to help you create amazing music. To get started, please verify your email address by clicking the button below.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: transform 0.2s;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #9CA3AF; font-size: 14px; line-height: 1.5; margin: 24px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmationUrl}" style="color: #8B5CF6; word-break: break-all;">${confirmationUrl}</a>
              </p>
              
              <div style="border-top: 1px solid #374151; margin-top: 32px; padding-top: 24px;">
                <h3 style="color: white; font-size: 18px; margin: 0 0 16px 0;">What's Next?</h3>
                <ul style="color: #D1D5DB; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li>Get personalized quotes for your music projects</li>
                  <li>Access our professional recording, mixing, and mastering services</li>
                  <li>Connect with our team of experienced engineers and producers</li>
                  <li>Take your music to the next level</li>
                </ul>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #0F172A; padding: 24px 20px; text-align: center; border-top: 1px solid #374151;">
              <p style="color: #6B7280; font-size: 12px; margin: 0;">
                3rd Street Music Studio<br>
                Professional Music Production Services
              </p>
              <p style="color: #6B7280; font-size: 12px; margin: 8px 0 0 0;">
                If you didn't sign up for this account, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const success = await sendEmail({
      to: email,
      subject: "Welcome to 3rd Street Music - Verify Your Email",
      html,
      from: `3rd Street Music <${Deno.env.get('SMTP_USER')}>`
    });

    if (success) {
      return new Response(
        JSON.stringify({ message: "Verification email sent successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      throw new Error("Failed to send email");
    }
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
