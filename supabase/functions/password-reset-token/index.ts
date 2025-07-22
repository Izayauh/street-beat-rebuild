import { createClient } from 'jsr:@supabase/supabase-js@^2'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*' as const, // Or specify your frontend origin
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Include Authorization if you send it
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return new Response('Email is required', {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use the service_role key for privileged access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find the user by email
    const { data: user, error: userError } = await supabase
      .from('profiles') // Assuming 'profiles' table has email and id
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.error('User not found or user query error:', userError);
      return new Response('User not found', {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate a secure token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour expiry

    // Store the token
    const { error: insertError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt
      });

    if (insertError) {
      console.error('Failed to create token:', insertError);
      return new Response('Failed to create token', {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // TODO: Send the token via email to the user here
    // Integrate your email sending logic here using Resend or another service
    // You will need to fetch the email address from the user data you retrieved earlier.
    // Make sure your email sending service is configured and the API key is available.

    return new Response(JSON.stringify({ message: 'Password reset token generated' }), { // Return a message instead of the token
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Unhandled exception in edge function:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});