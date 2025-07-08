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

    const { email, token } = await req.json();

    const siteUrl = new URL(req.url).origin;
    const resetLink = `${siteUrl}/reset-password?token=${token}`;
    const emailHtml = render(ResetPasswordEmail({ resetLink }));

    await resend.emails.send({
      from: 'Your Verified Email <onboarding@resend.dev>', // Replace with your verified domain and name
      to: email,
      subject: 'Reset Your Password',
      html: emailHtml,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});