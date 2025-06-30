
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SQUARE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment processing started");

    const squareAccessToken = Deno.env.get("SQUARE_SANDBOX_ACCESS_TOKEN");
    const squareApplicationId = Deno.env.get("SQUARE_SANDBOX_APPLICATION_ID");
    const squareEnvironment = "sandbox"; // Change to "production" for live payments

    if (!squareAccessToken || !squareApplicationId) {
      throw new Error("Square credentials not configured");
    }

    logStep("Square credentials verified");

    const { 
      amount, 
      currency, 
      packageId, 
      packageName, 
      customerName, 
      customerEmail, 
      customerPhone, 
      notes 
    } = await req.json();

    logStep("Request data received", { amount, packageId, packageName, customerEmail });

    // Create Square checkout session
    const checkoutRequest = {
      checkout_options: {
        redirect_url: `${req.headers.get("origin")}/payment-success`,
        ask_for_shipping_address: false,
        merchant_support_email: "miles@3rdstreetmusic.com",
        enable_coupon: false,
        enable_loyalty: false
      },
      order: {
        location_id: "main", // You'll need to get your actual location ID
        line_items: [
          {
            name: packageName,
            quantity: "1",
            item_type: "ITEM_VARIATION",
            variation_name: packageName,
            base_price_money: {
              amount: amount,
              currency: currency
            },
            note: notes || ""
          }
        ]
      },
      payment_note: `Payment for ${packageName} - Customer: ${customerName}`,
      order_note: `Customer: ${customerName}, Email: ${customerEmail}, Phone: ${customerPhone || 'N/A'}`
    };

    logStep("Checkout request prepared", { checkoutRequest });

    const squareResponse = await fetch(`https://connect.squareupsandbox.com/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Square-Version': '2023-10-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutRequest)
    });

    const squareData = await squareResponse.json();
    logStep("Square API response", { status: squareResponse.status, data: squareData });

    if (!squareResponse.ok) {
      throw new Error(`Square API error: ${JSON.stringify(squareData)}`);
    }

    // Store payment record in Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: dbError } = await supabaseClient
      .from('payments')
      .insert({
        square_payment_id: squareData.payment_link?.id,
        amount: amount,
        currency: currency,
        package_id: packageId,
        package_name: packageName,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        notes: notes,
        status: 'pending',
        payment_url: squareData.payment_link?.url
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway, don't fail the payment
    }

    logStep("Payment link created successfully", { url: squareData.payment_link?.url });

    return new Response(JSON.stringify({ 
      paymentUrl: squareData.payment_link?.url,
      paymentId: squareData.payment_link?.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in payment processing", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Payment processing failed. Please try again or contact support."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
