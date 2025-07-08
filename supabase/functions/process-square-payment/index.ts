
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { verifyJWT } from "https://deno.land/x/supabase_deno_jwt@v0.1.4/mod.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BillingInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}


const logStep = (step: string, details?: any) => {
  let detailsStr = '';
  if (details) {
    // Use a replacer function to convert BigInts to strings for serialization
    detailsStr = ` - ${JSON.stringify(details, (_, value) => typeof value === 'bigint' ? value.toString() : value)}`;
  }

  console.log(`[SQUARE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment processing started");

    const squareAccessToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const squareEnvironment = "sandbox"; // Change to "production" for live payments

    if (!squareAccessToken) {
      throw new Error("Square access token not configured");
    }

    logStep(`Square credentials verified for environment: ${squareEnvironment}`);
    
    const { 
      amount, 
      currency, 
      packageId, 
      packageName, 
      customerName, 
      customerEmail, 
      customerPhone, 
 email, // Read email from request body if guest
 billingInfo, // Read billing info from request body
      notes 
    } = await req.json();

    logStep("Request data received", { amount, packageId, packageName, customerEmail, customerName });

    // Get authenticated user's email
    const authHeader = req.headers.get('Authorization');
    let userEmail: string | undefined;
    if (authHeader) {
      const jwt = authHeader.split(' ')[1];
      try {
        // You'll need to replace 'YOUR_SUPABASE_JWT_SECRET' with your actual JWT secret
        // or fetch it securely. Hardcoding secrets is not recommended for production.
        const payload = await verifyJWT(jwt, Deno.env.get("SUPABASE_JWT_SECRET") || "YOUR_SUPABASE_JWT_SECRET");
        userEmail = (payload.payload as any).email;
        logStep("Authenticated user email obtained", { userEmail });
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError);
        // Continue without authenticated user email if JWT is invalid
      }
    }

    // Determine recipient email: authenticated user's email if available, otherwise use email from body
    const recipientEmail = userEmail || email;

    // Determine customer name: use billing name if available, otherwise use customerName from body
    const finalCustomerName = billingInfo?.name || customerName || recipientEmail;


    const checkoutRequest = {
      idempotency_key: crypto.randomUUID(), // Ensure idempotency
      // ... existing checkoutRequest properties
        redirect_url: `${req.headers.get("origin")}/payment-success`,
        ask_for_shipping_address: false,
        merchant_support_email: "miles@3rdstreetmusic.com",
        enable_coupon: false,
        enable_loyalty: false
      },
      order: {
 location_id: "C1DTABC9HCV46", // You'll need to get your actual location ID
        line_items: [
          {
            name: packageName,
            quantity: "1",
            base_price_money: {
              amount: amount,
              currency: currency
            },
            note: notes || ""
          }
        ],
        // Include billing address if provided
 billing_address: billingInfo ? {
 address_line_1: billingInfo.address,
 locality: billingInfo.city,
 administrative_district_level_1: billingInfo.state,
 postal_code: billingInfo.zip,
 name: billingInfo.name // Use billing name
 } : undefined,
      },
      payment_note: `Payment for ${packageName} - Customer: ${finalCustomerName}`,
    };

    logStep("Checkout request prepared", { checkoutRequest });

    const squareResponse = await fetch(`https://connect.squareup.com/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Square-Version': '2023-10-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutRequest)
    });

    const squareData = await squareResponse.json();
    logStep("Square API response received", { status: squareResponse.status, data: squareData });

    if (!squareResponse.ok) {
      throw new Error(`Square API error: ${JSON.stringify(squareData)}`);
    } else {
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
        customer_name: finalCustomerName, // Store the name used in Square
        customer_email: recipientEmail, // Store the email used for confirmation
        customer_phone: customerPhone,
        notes: notes,
        status: 'pending',
        payment_url: squareData.payment_link?.url
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway, don't fail the payment
    }

    // Send confirmation email
    if (recipientEmail) {
      logStep("Invoking email confirmation function");
      const emailResponse = await supabaseClient.functions.invoke('send-confirmation-email', {
        body: {
          email: recipientEmail,
          name: finalCustomerName, // Use the final customer name
          packageName: packageName,
          amount: amount,
          paymentId: squareData.payment_link?.id
        },
      });

      if (emailResponse.error) {
        console.error('Error invoking email function:', emailResponse.error);
        // Log the email error but don't fail the payment process
      }
      logStep("Email confirmation function invoked", { emailResponse });
    }

    logStep("Payment link created successfully", { url: squareData.payment_link?.url });

    return new Response(JSON.stringify({ 
 paymentUrl: squareData.payment_link?.url,
 paymentId: squareData.payment_link?.id
 }, (_, value) => typeof value === 'bigint' ? value.toString() : value), { // Add BigInt replacer here
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in payment processing", { message: errorMessage });

    return new Response(JSON.stringify({
      error: errorMessage,
      details: "Payment processing failed. Please try again or contact support.",
      // Include error stack for debugging, converting BigInts to strings
 stack: error instanceof Error ? error.stack : undefined // error.stack should be a string
    }, (_, value) => typeof value === 'bigint' ? value.toString() : value), // Apply replacer to the main object
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
