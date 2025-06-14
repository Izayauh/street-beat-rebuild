import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { sendEmail } from "../_shared/email-utils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface QuoteEmailRequest {
  quoteId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Quote email function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body:', body);
    
    const { quoteId }: QuoteEmailRequest = body;

    if (!quoteId) {
      console.error('No quoteId provided');
      throw new Error('Quote ID is required');
    }

    console.log('Fetching quote with ID:', quoteId);

    // Fetch quote data
    const { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Quote not found: ' + error.message);
    }

    if (!quote) {
      console.error('Quote not found in database');
      throw new Error('Quote not found');
    }

    console.log('Quote found:', { id: quote.id, email: quote.email });

    const answers = quote.answers as any;
    const service = answers.service || 'Music Production';
    const budget = answers.budget || 'Not specified';
    const date = answers.date || 'Flexible';
    const notes = answers.notes || 'No additional notes';

    // Generate quote estimate based on service
    const getQuoteEstimate = (service: string) => {
      const estimates: { [key: string]: { price: string; description: string } } = {
        'Recording': { 
          price: '$150-300/day', 
          description: 'Professional multi-track recording in our acoustically treated studio' 
        },
        'Mixing': { 
          price: '$200-500/song', 
          description: 'Expert mixing to transform your raw recordings into polished tracks' 
        },
        'Mastering': { 
          price: '$100-200/song', 
          description: 'Final polish and optimization for all playback systems' 
        },
        'Beat Production': { 
          price: '$250-600/beat', 
          description: 'Custom beats crafted to match your style and vision' 
        },
        'Vocal Production': { 
          price: '$150-400/song', 
          description: 'Specialized vocal tuning, comping, and creative processing' 
        },
        'Artist Development': { 
          price: '$500-1500/package', 
          description: 'Comprehensive support including song development and career guidance' 
        }
      };
      return estimates[service] || estimates['Recording'];
    };

    const estimate = getQuoteEstimate(service);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Quote from 3rd Street Music</title>
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
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Your Custom Quote</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 16px;">Thank you for choosing 3rd Street Music!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <div style="background-color: #1F2937; border-radius: 8px; padding: 24px; margin-bottom: 32px; border-left: 4px solid #8B5CF6;">
                <h2 style="color: #8B5CF6; margin: 0 0 16px 0; font-size: 20px;">Service: ${service}</h2>
                <p style="color: #D1D5DB; margin: 0 0 12px 0; font-size: 16px;">${estimate.description}</p>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #10B981; font-weight: bold; font-size: 24px;">${estimate.price}</span>
                  <span style="color: #9CA3AF; font-size: 14px;">estimated range</span>
                </div>
              </div>

              <!-- Quote Details -->
              <div style="border: 1px solid #374151; border-radius: 8px; overflow: hidden; margin-bottom: 32px;">
                <div style="background-color: #1F2937; padding: 16px; border-bottom: 1px solid #374151;">
                  <h3 style="color: white; margin: 0; font-size: 18px;">Quote Details</h3>
                </div>
                <div style="padding: 20px;">
                  <div style="margin-bottom: 16px;">
                    <span style="color: #8B5CF6; font-weight: 600; display: block; margin-bottom: 4px;">Preferred Date:</span>
                    <span style="color: #D1D5DB;">${date}</span>
                  </div>
                  <div style="margin-bottom: 16px;">
                    <span style="color: #8B5CF6; font-weight: 600; display: block; margin-bottom: 4px;">Budget Range:</span>
                    <span style="color: #D1D5DB;">${budget}</span>
                  </div>
                  ${notes !== 'No additional notes' ? `
                  <div>
                    <span style="color: #8B5CF6; font-weight: 600; display: block; margin-bottom: 4px;">Additional Notes:</span>
                    <span style="color: #D1D5DB;">${notes}</span>
                  </div>
                  ` : ''}
                </div>
              </div>

              <!-- Next Steps -->
              <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%); border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <h3 style="color: white; margin: 0 0 16px 0; font-size: 18px;">🎵 Ready to Get Started?</h3>
                <p style="color: #D1D5DB; margin: 0 0 20px 0; line-height: 1.6;">
                  Our team will review your project details and get back to you within 24 hours with a detailed proposal. Here's what happens next:
                </p>
                <ol style="color: #D1D5DB; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">We'll schedule a consultation call to discuss your vision</li>
                  <li style="margin-bottom: 8px;">Receive a detailed project timeline and final pricing</li>
                  <li style="margin-bottom: 8px;">Book your studio time and begin production</li>
                  <li>Create amazing music together!</li>
                </ol>
              </div>

              <!-- Contact Info -->
              <div style="text-align: center; padding: 24px; background-color: #0F172A; border-radius: 8px;">
                <h3 style="color: white; margin: 0 0 16px 0; font-size: 18px;">Questions? Let's Talk!</h3>
                <p style="color: #9CA3AF; margin: 0 0 16px 0;">
                  Ready to discuss your project? Reach out to us directly:
                </p>
                <a href="mailto:${Deno.env.get('SMTP_USER')}" 
                   style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin: 8px;">
                  Email Us
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #0F172A; padding: 24px 20px; text-align: center; border-top: 1px solid #374151;">
              <p style="color: #6B7280; font-size: 12px; margin: 0;">
                3rd Street Music Studio - Where Great Music Comes to Life<br>
                Professional Recording | Mixing | Mastering | Production
              </p>
              <p style="color: #6B7280; font-size: 10px; margin: 8px 0 0 0;">
                Quote ID: ${quoteId}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Attempting to send email to:', quote.email);

    const success = await sendEmail({
      to: quote.email,
      subject: `Your ${service} Quote from 3rd Street Music`,
      html,
      from: `3rd Street Music <${Deno.env.get('SMTP_USER')}>`
    });

    console.log('Email send result:', success);

    if (success) {
      console.log('Email sent successfully');
      return new Response(
        JSON.stringify({ message: "Quote email sent successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      console.error('Email sending failed');
      throw new Error("Failed to send email");
    }
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    console.error("Error stack:", error.stack);
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
