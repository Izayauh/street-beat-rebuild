import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the shape of the props the component will accept
interface SquarePaymentFormProps {
  amount: number; // The amount in cents (e.g., $15.00 should be 1500)
}

// --- IMPORTANT: PASTE YOUR PUBLIC SQUARE IDS HERE ---

// Find this on your Square Developer Dashboard -> Credentials page. It starts with 'sq0idp-'.
const SQUARE_APP_ID = 'sq0idp-Udsxxarqi-r8qlF6rGMy6g'; 

// Find this on your Square Developer Dashboard -> Locations page. It starts with 'L'.
const SQUARE_LOCATION_ID = 'C1DTABC9HCV46';

const SquarePaymentForm = ({ amount }: SquarePaymentFormProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [card, setCard] = useState<any>(null);

  // This useEffect hook initializes the Square Web Payments SDK
  useEffect(() => {
    const initializeCard = async () => {
      if (!(window as any).Square) {
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = () => initializeCard();
        document.head.appendChild(script);
        return;
      }

      try {
        if (SQUARE_APP_ID.includes('REPLACE') || SQUARE_LOCATION_ID.includes('REPLACE')) {
            toast.error('Square credentials are not configured in the code.');
            console.error("Developer Error: Please replace the placeholder Square credentials in SquarePaymentForm.tsx");
            return;
        }

        const payments = (window as any).Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        const cardInstance = await payments.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
      } catch (e) {
        console.error('Initializing Square card failed', e);
        toast.error('Failed to load payment form. Please refresh the page.');
      }
    };

    initializeCard();
  }, []);

  // This function handles the form submission
  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!card) {
      toast.error('Payment form is not ready yet. Please wait a moment.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Tokenize the card details to get a secure, one-time-use token
      const tokenResult = await card.tokenize();
      if (tokenResult.status !== 'OK') {
        console.error('Tokenization error:', tokenResult.errors);
        toast.error('Invalid card details. Please check your information.');
        setIsProcessing(false);
        return;
      }

      const sourceId = tokenResult.token;

      // 2. Call your Supabase function with the token and amount
      const { data, error } = await supabase.functions.invoke('process-square-payment', {
        body: {
          sourceId: sourceId,
          amount: amount,
        },
      });

      if (error) {
        console.error('Square checkout error:', error);
        toast.error('Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      // 3. Handle a successful payment
      toast.success('Payment successful! Thank you for your purchase.');
      navigate('/payment-success'); 

    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-amber-400 text-2xl font-display warm-text-glow flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Payment Details
        </h3>
        <p className="text-amber-200/70 text-sm mt-2 text-serif">
          Enter your card information below.
        </p>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        {/* This div is where the secure Square card form will be mounted */}
        <div id="card-container"></div>
        
        <div className="border-t border-amber-500/20 pt-6">
          <Button
            type="submit"
            disabled={isProcessing || !card}
            className="w-full btn-analog text-black py-3 text-lg disabled:opacity-50 transform hover:scale-105 transition-all duration-300"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ${(amount / 100).toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-amber-200/70 text-sm">
        <p className="text-serif">
          Secure payment processing powered by Square.
        </p>
      </div>
    </div>
  );
};

export default SquarePaymentForm;
