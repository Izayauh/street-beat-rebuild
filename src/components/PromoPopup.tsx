
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
      <DialogContent className="max-w-md p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black border-purple-500/30 text-white">
        <div className="relative p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <span className="text-2xl font-bold">%</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Exclusive Offer!
            </h2>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
              20% OFF
            </div>
            <p className="text-gray-300">
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
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {loading ? 'Creating Account...' : 'Claim 20% Off Now!'}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              * Offer valid for new customers only. Terms apply.
            </p>
            <button
              onClick={handleClose}
              className="text-sm text-gray-400 hover:text-white transition-colors mt-2 underline"
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
