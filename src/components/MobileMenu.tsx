
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User | null;
  onGetQuote: () => void;
  onContactOpen: () => void;
  onAuthOpen: () => void;
  onSignOut: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  onToggle, 
  user, 
  onGetQuote, 
  onContactOpen, 
  onAuthOpen, 
  onSignOut 
}: MobileMenuProps) => {
  const handleGetQuote = () => {
    onGetQuote();
    onToggle();
  };

  const handleContactOpen = () => {
    onContactOpen();
    onToggle();
  };

  const handleAuthOpen = () => {
    onAuthOpen();
    onToggle();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="md:hidden p-2 rounded-lg glass-effect border border-amber-500/40 text-amber-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 card-analog rounded-lg warm-glow">
          <div className="p-4 space-y-4">
            <Link
              to="/"
              className="block text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
              onClick={onToggle}
            >
              Home
            </Link>
            <Link
              to="/lessons"
              className="block text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
              onClick={onToggle}
            >
              Lessons
            </Link>
            <Link
              to="/payments"
              className="block text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
              onClick={onToggle}
            >
              Payments
            </Link>
            <Link
              to="/gallery"
              className="block text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
              onClick={onToggle}
            >
              Gallery
            </Link>
            <button
              onClick={handleGetQuote}
              className="block w-full text-left text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
            >
              Get Quote
            </button>
            <button
              onClick={handleContactOpen}
              className="block w-full text-left text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
            >
              Contact
            </button>
            
            <div className="pt-4 border-t border-amber-500/20">
              {user ? (
                <div className="space-y-2">
                  <span className="block text-amber-200 text-serif">Welcome, {user.email}</span>
                  <Button
                    onClick={onSignOut}
                    className="w-full glass-effect border border-amber-500/40 text-amber-100 hover:border-amber-400 hover:bg-amber-500/10"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAuthOpen}
                  className="w-full btn-analog text-black"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
