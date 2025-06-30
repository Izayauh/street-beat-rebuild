
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CreditCard, User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';

interface PackageDetails {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface SquarePaymentFormProps {
  packageDetails: PackageDetails;
  userEmail: string;
  locationId: string;
}

const SquarePaymentForm = ({ packageDetails, userEmail, locationId }: SquarePaymentFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: userEmail,
    phone: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Call new Square checkout function
      const { data, error } = await supabase.functions.invoke('square-checkout', {
        body: {
          amountCents: packageDetails.price * 100, // Convert to cents
          description: `${packageDetails.name} - ${formData.name}`,
          locationId: locationId
        }
      });

      if (error) {
        console.error('Square checkout error:', error);
        toast.error('Payment processing failed. Please try again.');
        return;
      }

      if (data?.url) {
        // Redirect to Square checkout
        window.location.href = data.url;
        toast.success('Redirecting to secure payment...');
      } else {
        toast.error('Payment setup failed. Please try again.');
      }

    } catch (error) {
      console.error('Error:', error);
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
          Complete your information below to proceed with secure Square payment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-amber-300 flex items-center gap-2 font-display">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-black/40 border-amber-500/30 text-amber-100 placeholder-amber-200/50 focus:border-amber-400 glass-effect"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-amber-300 flex items-center gap-2 font-display">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-black/40 border-amber-500/30 text-amber-100 placeholder-amber-200/50 focus:border-amber-400 glass-effect"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-amber-300 flex items-center gap-2 font-display">
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="bg-black/40 border-amber-500/30 text-amber-100 placeholder-amber-200/50 focus:border-amber-400 glass-effect"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="text-amber-300 flex items-center gap-2 font-display">
            <MessageSquare className="w-4 h-4" />
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any special requests or preferences..."
            className="bg-black/40 border-amber-500/30 text-amber-100 placeholder-amber-200/50 focus:border-amber-400 glass-effect"
            rows={3}
          />
        </div>

        <div className="border-t border-amber-500/20 pt-6">
          <Button 
            type="submit" 
            disabled={isProcessing}
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
                Pay ${packageDetails.price} with Square
              </>
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-amber-200/70 text-sm">
        <p className="text-serif">
          Secure payment processing powered by Square. 
          Your payment information is encrypted and protected.
        </p>
      </div>
    </div>
  );
};

export default SquarePaymentForm;
