import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from 'npm:resend@4.0.0'; // Use the npm: specifier
import { render } from 'npm:@react-email/render@0.0.12'; // Use the npm: specifier
import ResetPasswordEmail from '../../../react-email-starter/emails/reset-password-email.tsx';
 
console.log("Password reset email function started");

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    
    let email, token;
    try {
      ({ email, token } = await req.json());
    } catch (jsonError) {
      console.error("Error parsing request body:", jsonError);
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const siteUrl = new URL(req.url).origin;
    const resetLink = `${siteUrl}/reset-password?token=${token}`;

    let emailHtml;
    try {
      emailHtml = render(ResetPasswordEmail({ resetLink }));
    } catch (renderError) {
      console.error("Error rendering email template:", renderError);
      return new Response(JSON.stringify({ error: "Failed to render email template" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    await resend.emails.send({
 from: 'Your App <no-reply@yourdomain.com>', // Replace with your verified domain and name
      to: email,
      subject: 'Reset Your Password',
      html: emailHtml,
    }).catch((sendError) => {
      console.error("Error sending email with Resend:", sendError);
      return new Response(JSON.stringify({ error: "Failed to send password reset email" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    });
  }
});;