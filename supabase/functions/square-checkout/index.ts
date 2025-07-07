import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { Client, Environment } from "square";
import { v4 as uuidv4 } from "uuid";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed for CORS preflight requests.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { sourceId, amount } = await req.json();

    // **HERE IS THE FIX**
    // Retrieve secrets from the Supabase environment
    const accessToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const locationId = Deno.env.get("SQUARE_LOCATION_ID");

    // Check if the secrets were loaded correctly
    if (!accessToken || !locationId) {
      throw new Error("Missing Square credentials in environment variables.");
    }

    // Initialize the Square client
    const client = new Client({
      environment: Environment.Production, // Make sure this is set to Production
      accessToken: accessToken,
    });

    // Create the payment
    const response = await client.paymentsApi.createPayment({
      sourceId: sourceId,
      idempotencyKey: uuidv4(),
      amountMoney: {
        amount: BigInt(amount), // Ensure amount is a BigInt
        currency: "USD",
      },
      locationId: locationId,
    });

    // Send the successful response back to your website
    return new Response(JSON.stringify({
      success: true,
      payment: response.result.payment,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    // Log the detailed error to the Supabase console
    console.error("Detailed Error:", error);

    // Send a generic error response back to the client
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});