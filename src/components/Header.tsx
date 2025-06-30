
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';
import { AuthForm } from './AuthForm';
import Contact from '@/components/Contact';
import QuoteDialog from '@/components/QuoteDialog';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { AuthSection } from './AuthSection';
import { Modal } from './Modal';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
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
  };

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
          <Navigation 
            onGetQuote={handleGetQuote}
            onContactOpen={() => setIsContactOpen(true)}
          />

          {/* Desktop Auth */}
          <AuthSection 
            user={user}
            onAuthOpen={() => setIsAuthOpen(true)}
            onSignOut={handleSignOut}
          />

          {/* Mobile Menu */}
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            user={user}
            onGetQuote={handleGetQuote}
            onContactOpen={() => setIsContactOpen(true)}
            onAuthOpen={() => setIsAuthOpen(true)}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Auth Modal */}
      <Modal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        title="Sign In"
      >
        <AuthForm onClose={() => setIsAuthOpen(false)} />
      </Modal>

      {/* Contact Modal */}
      <Modal 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        title="Contact Us"
      >
        <Contact onClose={() => setIsContactOpen(false)} />
      </Modal>

      <QuoteDialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen} />
    </header>
  );
};

export default Header;
