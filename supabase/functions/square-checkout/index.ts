
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  amountCents: number;
  description: string;
  locationId: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SQUARE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Square checkout started");

    const squareAccessToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
    
    if (!squareAccessToken) {
      throw new Error("Square access token not configured");
    }

    logStep("Square credentials verified");

    const { amountCents, description, locationId }: CheckoutRequest = await req.json();

    logStep("Request data received", { amountCents, description, locationId });

    // Generate idempotency key
    const idempotencyKey = crypto.randomUUID();

    // Create Square checkout request
    const checkoutRequest = {
      idempotency_key: idempotencyKey,
      order: {
        location_id: locationId,
        line_items: [
          {
            name: description,
            quantity: "1",
            base_price_money: {
              amount: amountCents,
              currency: "USD"
            }
          }
        ]
      },
      checkout_options: {
        redirect_url: `${req.headers.get("origin")}/thank-you`
      }
    };

    logStep("Checkout request prepared", { checkoutRequest });

    const squareResponse = await fetch("https://connect.squareupsandbox.com/v2/online-checkout/payment-links", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Square-Version': '2025-06-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutRequest)
    });

    const squareData = await squareResponse.json();
    logStep("Square API response", { status: squareResponse.status, data: squareData });

    if (!squareResponse.ok) {
      logStep("Square API error", squareData);
      return new Response(JSON.stringify(squareData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: squareResponse.status,
      });
    }

    logStep("Payment link created successfully", { url: squareData.payment_link?.url });

    return new Response(JSON.stringify({ 
      url: squareData.payment_link?.url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in checkout processing", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Checkout processing failed. Please try again or contact support."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
