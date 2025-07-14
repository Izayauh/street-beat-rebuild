// supabase/functions/resend-email/index.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@3.4.0";
import { render } from "npm:@react-email/render@0.0.16";
import React from "npm:react@18.3.1";
import PasswordResetEmail from "./emails/password-reset-email.tsx";
import WelcomeEmail from "./emails/welcome-email.tsx";

// --- Log Start ---
console.log("Function cold start: Initializing resend-email function.");

// Template Map
const EMAIL_TEMPLATES = {
  'welcome': WelcomeEmail,
  'password-reset': PasswordResetEmail,
};

// Initialize Resend
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
if (!RESEND_API_KEY) {
  console.error("CRITICAL: RESEND_API_KEY environment variable is not set.");
}
const resend = new Resend(RESEND_API_KEY);

// Main Function Handler
serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Received request: ${req.method} ${req.url}`);
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request.");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body...");
    const { to, subject, template, data = {} } = await req.json();
    console.log(`Request parsed: to=${to}, subject=${subject}, template=${template}`);

    if (!RESEND_API_KEY) {
      throw new Error("Server configuration error: RESEND_API_KEY is not set.");
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );


    const EmailComponent = EMAIL_TEMPLATES[template];
    if (!EmailComponent) {
      console.error(`Template not found: "${template}"`);
      throw new Error(`Template "${template}" not found.`);
    }
    console.log("Email template found.");
    
    // Prepare props for the email component
    let emailProps = data;
    if (template === 'password-reset') {
      const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: to,
        options: {
          redirectTo: data.redirectTo
        }
      });
      if(error){
        throw error
      }
      emailProps = { ...data, redirectTo: linkData.properties.action_link };
    }


    console.log("Rendering email HTML...");
    const emailHtml = render(React.createElement(EmailComponent, emailProps));
    console.log("Email HTML rendered successfully.");

    console.log("Sending email via Resend...");
    const { data: resendData, error } = await resend.emails.send({
      from: `3rd Street Music <onboarding@resend.dev>`,
      to: [to],
      subject: subject,
      html: emailHtml
    });

    if (error) {
      console.error("Resend API error:", error);
      throw error;
    }

    console.log("Email sent successfully:", resendData);
    return new Response(JSON.stringify(resendData), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error("Unhandled error in function handler:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
