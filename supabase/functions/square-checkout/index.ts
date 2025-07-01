// supabase/functions/create-payment/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
// These imports are now cleanly resolved by the new deno.json file
import { Client, Environment } from "square";
import { v4 as uuidv4 } from "uuid";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sourceId, amount, currency = 'USD', packageId, packageName, customerName, customerEmail } = await req.json();

    const accessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const locationId = Deno.env.get('SQUARE_LOCATION_ID');

    if (!accessToken || !locationId) {
      throw new Error("Square credentials are not configured in Supabase function secrets.");
    }

    const squareClient = new Client({
      environment: Environment.Sandbox,
      accessToken,
    });

    const { result } = await squareClient.paymentsApi.createPayment({
      sourceId: sourceId,
      locationId: locationId,
      idempotencyKey: uuidv4(),
      amountMoney: {
        amount: BigInt(amount),
        currency: currency,
      },
    });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabaseAdmin.from('payments').insert({
      square_payment_id: result.payment?.id,
      amount: amount,
      currency: currency,
      status: result.payment?.status,
      package_name: packageName,
      customer_email: customerEmail,
      customer_name: customerName,
      package_id: packageId,
    });

    if (dbError) {
      console.error("Database insert error:", dbError);
    }

    return new Response(JSON.stringify({ success: true, payment: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in create-payment function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});