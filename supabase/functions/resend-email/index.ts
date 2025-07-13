// supabase/functions/resend-email/index.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";
import { render } from "npm:@react-email/render@0.0.16";
import React from "npm:react@18.3.1";
import { Html, Head, Body, Container, Text, Button, Preview, Section } from "npm:@react-email/components@0.0.22";
import PasswordResetEmail from "./emails/password-reset-email.jsx";
import WelcomeEmail from "./emails/welcome-email.jsx";

// Template Map
const EMAIL_TEMPLATES = {
  'welcome': WelcomeEmail,
  'password-reset': PasswordResetEmail,
};

// Initialize Resend
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Main Function Handler
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, template, data = {} } = await req.json();
    const EmailComponent = EMAIL_TEMPLATES[template];

    if (!EmailComponent) {
      throw new Error(`Template "${template}" not found.`);
    }

    const emailHtml = render(React.createElement(EmailComponent, data));

    const { data: resendData, error } = await resend.emails.send({
      from: `3rd Street Music <onboarding@resend.dev>`,
      to: [to],
      subject: subject,
      html: emailHtml
    });

    if (error) throw error;

    return new Response(JSON.stringify(resendData), { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});