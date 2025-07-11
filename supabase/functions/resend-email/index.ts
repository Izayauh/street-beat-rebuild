import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";
import { render } from "@react-email/render";
import React from "react";
import { WelcomeEmail } from "./_templates/welcome-email.tsx";

// Initialize Resend with your API key from Supabase secrets
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// --- Template Map ---
// This object maps a template name to the file containing its design.
// We will add more templates here as we create them.
const EMAIL_TEMPLATES = {
  'welcome': () => import('./_templates/welcome-email.tsx'),
  // 'password-reset': () => import('./_templates/password-reset-email.tsx'),
  // 'cancellation-confirmation': () => import('./_templates/cancellation-email.tsx'),
};

Deno.serve(async (req) => {
  // Standard CORS and method validation
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    // --- Parse Request Body ---
    const {
      to,          // The recipient's email address
      subject,     // The email subject line
      template,    // The name of the template to use (e.g., 'welcome')
      data = {}    // The data to pass to the template component (e.g., { name: 'John' })
    } = await req.json();

    // --- Validation ---
    if (!to || !subject || !template) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, subject, template' }), { status: 400, headers });
    }
    if (!EMAIL_TEMPLATES[template]) {
      return new Response(JSON.stringify({ error: `Template "${template}" not found.` }), { status: 404, headers });
    }

    // --- Render and Send Email ---
    console.log(`Attempting to send '${template}' email to: ${to}`);

    // Dynamically import and render the correct React component
    const templateModule = await EMAIL_TEMPLATES[template]();
    const EmailComponent = templateModule.default;
    const emailHtml = await render(React.createElement(EmailComponent, data));

    // Send the email using Resend
    const { data: resendData, error } = await resend.emails.send({
      from: '3rd Street Music <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: emailHtml
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: error }), { status: 500, headers });
    }

    console.log('Email sent successfully. ID:', resendData.id);
    return new Response(JSON.stringify({ success: true, id: resendData.id }), { status: 200, headers });

  } catch (error) {
    console.error('Function Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500, headers });
  }
});