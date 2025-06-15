
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
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, service }: ContactEmailRequest = await req.json();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to 3rd Street Music!</title>
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
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 600;">🎵 Thanks for Reaching Out!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 16px 0 0 0; font-size: 18px;">Your musical journey starts here</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h2 style="color: white; margin: 0 0 16px 0; font-size: 24px;">Hey ${name}! 👋</h2>
                <p style="color: #D1D5DB; margin: 0; font-size: 16px; line-height: 1.6;">
                  We received your message about <strong style="color: #8B5CF6;">${service || 'our services'}</strong> and we're absolutely <em>excited</em> to work with you!
                </p>
              </div>

              <!-- CTA Section -->
              <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%); border-radius: 12px; padding: 32px 24px; text-align: center; margin-bottom: 32px; border: 1px solid #8B5CF6;">
                <h3 style="color: #8B5CF6; margin: 0 0 16px 0; font-size: 20px;">🔥 LIMITED TIME OFFER!</h3>
                <p style="color: white; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                  Get 20% OFF your first studio session!
                </p>
                <p style="color: #D1D5DB; margin: 0 0 24px 0; font-size: 14px;">
                  Book within the next 7 days and save big on professional recording, mixing, or mastering services.
                </p>
                <a href="tel:5137371900" 
                   style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 8px;">
                  📞 Call Now: (513) 737-1900
                </a>
              </div>

              <!-- What's Next -->
              <div style="background-color: #1F2937; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <h3 style="color: white; margin: 0 0 16px 0; font-size: 18px;">🎯 What Happens Next?</h3>
                <ol style="color: #D1D5DB; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Our team will review your project within 24 hours</li>
                  <li style="margin-bottom: 8px;">We'll call you to discuss your vision and requirements</li>
                  <li style="margin-bottom: 8px;">Receive a personalized quote tailored to your needs</li>
                  <li>Start creating amazing music together! 🚀</li>
                </ol>
              </div>

              <!-- Social Proof -->
              <div style="text-align: center; margin-bottom: 32px;">
                <p style="color: #8B5CF6; font-weight: 600; margin: 0 0 8px 0;">✨ Join 2,861+ Happy Musicians!</p>
                <p style="color: #9CA3AF; font-size: 14px; margin: 0;">
                  Follow us on <a href="https://www.facebook.com/3rdStreetMusic" style="color: #8B5CF6;">Facebook</a> and 
                  <a href="https://www.instagram.com/3rdstreetmusic" style="color: #8B5CF6;">Instagram</a> for daily inspiration
                </p>
              </div>

              <!-- Services Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 32px;">
                <div style="background-color: #374151; padding: 16px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🎤</div>
                  <div style="color: white; font-weight: 600; font-size: 14px;">Recording</div>
                </div>
                <div style="background-color: #374151; padding: 16px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🎛️</div>
                  <div style="color: white; font-weight: 600; font-size: 14px;">Mixing</div>
                </div>
                <div style="background-color: #374151; padding: 16px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 8px;">✨</div>
                  <div style="color: white; font-weight: 600; font-size: 14px;">Mastering</div>
                </div>
                <div style="background-color: #374151; padding: 16px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🎵</div>
                  <div style="color: white; font-weight: 600; font-size: 14px;">Production</div>
                </div>
              </div>

              <!-- Contact Info -->
              <div style="text-align: center; padding: 24px; background-color: #0F172A; border-radius: 8px;">
                <h3 style="color: white; margin: 0 0 16px 0; font-size: 18px;">🏢 Visit Our Studio</h3>
                <p style="color: #9CA3AF; margin: 0 0 16px 0;">
                  230 N 3rd Street<br>
                  Hamilton, OH 45011
                </p>
                <p style="color: #9CA3AF; margin: 0 0 16px 0;">
                  📧 <a href="mailto:miles@3rdstreetmusic.com" style="color: #8B5CF6;">miles@3rdstreetmusic.com</a><br>
                  🌐 <a href="https://3rdStreetMusic.com" style="color: #8B5CF6;">3rdStreetMusic.com</a>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #0F172A; padding: 24px 20px; text-align: center; border-top: 1px solid #374151;">
              <p style="color: #6B7280; font-size: 12px; margin: 0;">
                3rd Street Music - Connecting Hamilton and Beyond to Music<br>
                Professional Recording Studio | Music Shop | Reverb Marketplace
              </p>
              <p style="color: #6B7280; font-size: 10px; margin: 8px 0 0 0;">
                This email was sent because you contacted us through our website. If you didn't expect this email, please ignore it.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "3rd Street Music <miles@3rdstreetmusic.com>",
      to: [email],
      subject: "🎵 Welcome to 3rd Street Music - Let's Make Music Together!",
      html,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ message: "Confirmation email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
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
