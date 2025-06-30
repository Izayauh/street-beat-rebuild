
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, Menu, X, ChevronDown } from 'lucide-react';
import AuthForm from '@/components/AuthForm';
import Contact from '@/components/Contact';
import QuoteDialog from '@/components/QuoteDialog';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  // No props for now
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGetQuote = () => {
    setIsQuoteOpen(true);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 analog-gradient-dark border-b border-amber-500/20">
      <div className="absolute inset-0 texture-grain opacity-40"></div>
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 analog-gradient rounded-lg flex items-center justify-center warm-glow">
              <Music className="w-6 h-6 text-black" />
            </div>
            <div>
              <Link to="/" className="text-xl font-bold text-amber-400 warm-text-glow hover:text-amber-300 transition-colors">
                3rd Street Music
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif">
              Home
            </Link>
            <Link to="/lessons" className="text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif">
              Lessons
            </Link>
            <Link to="/payments" className="text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif">
              Payments
            </Link>
            <Link to="/gallery" className="text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif">
              Gallery
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
              >
                <span>More</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 card-analog rounded-lg shadow-lg warm-glow">
                  <div className="py-2">
                    <button
                      onClick={handleGetQuote}
                      className="w-full text-left px-4 py-2 text-amber-200 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-serif"
                    >
                      Get Quote
                    </button>
                    <button
                      onClick={() => setIsContactOpen(true)}
                      className="w-full text-left px-4 py-2 text-amber-200 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-serif"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-amber-200 text-serif">Welcome, {user.email}</span>
                <Button
                  onClick={handleSignOut}
                  className="glass-effect border border-amber-500/40 text-amber-100 hover:border-amber-400 hover:bg-amber-500/10 transition-all duration-300"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthOpen(true)}
                className="btn-analog text-black transform hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass-effect border border-amber-500/40 text-amber-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 card-analog rounded-lg warm-glow">
            <div className="p-4 space-y-4">
              <Link
                to="/"
                className="block text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/lessons"
                className="block text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Lessons
              </Link>
              <Link
                to="/payments"
                className="block text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Payments
              </Link>
              <Link
                to="/gallery"
                className="block text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <button
                onClick={() => {
                  handleGetQuote();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
              >
                Get Quote
              </button>
              <button
                onClick={() => {
                  setIsContactOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-amber-200 hover:text-amber-400 transition-colors font-medium text-serif"
              >
                Contact
              </button>
              
              <div className="pt-4 border-t border-amber-500/20">
                {user ? (
                  <div className="space-y-2">
                    <span className="block text-amber-200 text-serif">Welcome, {user.email}</span>
                    <Button
                      onClick={handleSignOut}
                      className="w-full glass-effect border border-amber-500/40 text-amber-100 hover:border-amber-400 hover:bg-amber-500/10"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setIsAuthOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full btn-analog text-black"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-400">Sign In</h2>
              <button
                onClick={() => setIsAuthOpen(false)}
                className="text-amber-200 hover:text-amber-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AuthForm onClose={() => setIsAuthOpen(false)} />
          </div>
        </div>
      )}

      {isContactOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-400">Contact Us</h2>
              <button
                onClick={() => setIsContactOpen(false)}
                className="text-amber-200 hover:text-amber-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <Contact onClose={() => setIsContactOpen(false)} />
          </div>
        </div>
      )}

      <QuoteDialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen} />
    </header>
  );
};

export default Header;
