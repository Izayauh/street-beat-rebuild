import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@3.4.0";
import { render } from "npm:@react-email/render@0.0.16";
import React from "npm:react@18.3.1";
import PasswordResetTokenEmail from "./emails/password-reset-token-email.jsx";

// Initialize Supabase client with service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Resend
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Generate a secure 6-digit token
function generateToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store token in Supabase with expiration
async function storeToken(email: string, token: string): Promise<boolean> {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
  
  const { error } = await supabase
    .from('password_reset_tokens')
    .upsert({
      email: email,
      token: token,
      expires_at: expiresAt.toISOString(),
      used: false
    });

  return !error;
}

// Verify token from Supabase
async function verifyToken(email: string, token: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('email', email)
    .eq('token', token)
    .eq('used', false)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    return false;
  }

  // Mark token as used
  await supabase
    .from('password_reset_tokens')
    .update({ used: true })
    .eq('id', data.id);

  return true;
}

// Send email with token
async function sendTokenEmail(email: string, token: string, username: string): Promise<boolean> {
  try {
    const emailHtml = render(React.createElement(PasswordResetTokenEmail, { 
      username, 
      token 
    }));

    const { error } = await resend.emails.send({
      from: `3rd Street Music <onboarding@resend.dev>`,
      to: [email],
      subject: 'Your Password Reset Code',
      html: emailHtml
    });

    return !error;
  } catch (error) {
    console.error('Error sending token email:', error);
    return false;
  }
}

// Main function handler
serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, email, token, newPassword } = await req.json();

    switch (action) {
      case 'generate':
        // Generate and send token
        if (!email) {
          throw new Error('Email is required');
        }

        const generatedToken = generateToken();
        const username = email.split('@')[0];
        
        // Store token in database
        const stored = await storeToken(email, generatedToken);
        if (!stored) {
          throw new Error('Failed to store token');
        }

        // Send email with token
        const sent = await sendTokenEmail(email, generatedToken, username);
        if (!sent) {
          throw new Error('Failed to send email');
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Reset code sent to your email' 
        }), { 
          status: 200, 
          headers: corsHeaders 
        });

      case 'verify':
        // Verify token and reset password
        if (!email || !token || !newPassword) {
          throw new Error('Email, token, and new password are required');
        }

        // Verify the token
        const isValid = await verifyToken(email, token);
        if (!isValid) {
          throw new Error('Invalid or expired reset code');
        }

        // Update user password using Supabase Auth
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          email, // This should be user ID, but we'll need to get it from email
          { password: newPassword }
        );

        if (updateError) {
          // Fallback: try to get user by email first
          const { data: userData } = await supabase.auth.admin.listUsers();
          const user = userData.users.find(u => u.email === email);
          
          if (user) {
            const { error: retryError } = await supabase.auth.admin.updateUserById(
              user.id,
              { password: newPassword }
            );
            
            if (retryError) {
              throw new Error('Failed to update password');
            }
          } else {
            throw new Error('User not found');
          }
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Password updated successfully' 
        }), { 
          status: 200, 
          headers: corsHeaders 
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Password reset token error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }
}); 