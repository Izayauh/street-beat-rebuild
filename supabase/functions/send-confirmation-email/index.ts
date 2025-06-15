
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
}

const handler = async (req: Request): Promise<Response> => {
  console.log('=== EMAIL FUNCTION CALLED ===');
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

    const { name, email, service, message }: ContactEmailRequest = JSON.parse(requestBody);
    console.log('Parsed data:', { name, email, service, message });

    // Check if we have the required fields
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log('Resend API Key available:', !!apiKey);
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    console.log('Sending email to:', email);
    
    const emailResult = await resend.emails.send({
      from: "3rd Street Music <onboarding@resend.dev>", // Using resend's test domain
      to: [email],
      subject: "🎵 Thanks for contacting 3rd Street Music!",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #111111; color: white; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #8B5CF6; margin: 0 0 16px 0;">🎵 3rd Street Music</h1>
            <h2 style="margin: 0;">Thanks for reaching out, ${name}! 👋</h2>
          </div>
          
          <div style="background-color: #1F2937; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0 0 16px 0;">We received your message about <strong>${service || 'our services'}</strong> and we're excited to work with you!</p>
            <p style="margin: 0;">Our team will review your request and get back to you within 24 hours.</p>
          </div>
          
          <div style="text-align: center; background-color: #0F172A; padding: 24px; border-radius: 8px;">
            <p style="margin: 0 0 16px 0;"><strong>📍 230 N 3rd Street, Hamilton, OH 45011</strong></p>
            <p style="margin: 0 0 16px 0;"><strong>📞 (513) 737-1900</strong></p>
            <p style="margin: 0;"><strong>✉️ miles@3rdstreetmusic.com</strong></p>
          </div>
        </div>
      `,
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
    console.error("=== EMAIL ERROR ===");
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
