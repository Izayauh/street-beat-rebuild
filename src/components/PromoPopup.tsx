
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signUp } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Show popup only for non-authenticated users after a short delay
    if (!user) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate a temporary password for the user
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      
      const { error } = await signUp(email, tempPassword);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome! 20% Off Claimed! 🎉",
          description: "Check your email for confirmation and password reset instructions.",
        });
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 card-analog border-amber-500/30 text-amber-100 warm-glow">
        <DialogTitle className="sr-only">Exclusive Offer - 20% Off</DialogTitle>
        <DialogDescription className="sr-only">Sign up today and get 20% off your first studio session</DialogDescription>
        <div className="relative p-8 texture-grain">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-amber-300/60 hover:text-amber-100 transition-colors glass-effect p-2 rounded-full"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 analog-gradient rounded-full mb-4 warm-glow">
              <span className="text-2xl font-bold text-black">%</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 font-display warm-text-glow text-amber-400">
              Exclusive Offer!
            </h2>
            <div className="text-4xl font-bold analog-gradient bg-clip-text text-transparent mb-2 warm-text-glow">
              20% OFF
            </div>
            <p className="text-amber-200/80 text-serif">
              Your first studio session when you sign up today!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-amber-500/30 text-amber-100 placeholder-amber-200/50 focus:border-amber-400 glass-effect"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-analog text-black font-medium py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Creating Account...' : 'Claim 20% Off Now!'}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-amber-200/60 text-serif">
              * Offer valid for new customers only. Terms apply.
            </p>
            <button
              onClick={handleClose}
              className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors mt-2 underline text-serif"
            >
              No thanks, maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoPopup;
