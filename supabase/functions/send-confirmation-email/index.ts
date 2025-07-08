
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { ConfirmationEmail } from "./_templates/confirmation-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  service?: string;
  message?: string;
  // Added for payment confirmations
  packageName?: string;
  amount?: number; // Amount in the smallest currency unit (e.g., cents)
}

const handler = async (req: Request): Promise<Response> => {
  console.log('=== REACT EMAIL FUNCTION CALLED ===');
  console.log('Method:', req.method);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  if (req.method === "OPTIONS") {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.log('Method not allowed:', req.method);
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    if (!requestBody) {
      throw new Error('No request body provided');
    }

    const { name, email, service, message, packageName, amount }: ContactEmailRequest = JSON.parse(requestBody);
    console.log('Parsed data:', { name, email, service, message, packageName, amount });

    let emailSubject = "🎵 Let's Make Music Together - Your Message Has Been Received!";
    let emailBodyProps: any = { name, service, message };

    if (packageName && amount !== undefined) {
      emailSubject = `🎶 Payment Confirmation for ${packageName}`;
      emailBodyProps = { name, packageName, amount };
    }

    // Check if we have the required fields
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log('Resend API Key available:', !!apiKey);
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    console.log('Rendering React Email template...');
    
    // Render the React Email template
    const emailHtml = await renderAsync(React.createElement(ConfirmationEmail, emailBodyProps));

    console.log('React Email template rendered successfully');
    console.log('Sending email to:', email);
    
    const emailResult = await resend.emails.send({
      from: "3rd Street Music <onboarding@resend.dev>", // Using resend's test domain
      to: [email],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email sent successfully",
        emailId: emailResult.data?.id
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );

  } catch (error: any) {
    console.error("=== REACT EMAIL ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
