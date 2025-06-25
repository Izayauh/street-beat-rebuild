
import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const handleBookStudio = () => {
    if (user) {
      toast.success("Booking page coming soon! Stay tuned.");
    } else {
      navigate('/auth');
    }
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const handleLessonsClick = () => {
    navigate('/lessons');
    setIsMenuOpen(false);
  };

  const handleGalleryClick = () => {
    navigate('/gallery');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-amber-500/20 texture-grain">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with analog styling */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 analog-gradient rounded-full flex items-center justify-center warm-glow">
              <span className="text-black font-bold text-sm">3</span>
            </div>
            <span className="text-amber-100 font-bold text-xl font-display tracking-wide">3rd Street Music</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-amber-200/80 hover:text-amber-100 transition-colors font-medium">Home</a>
            <a href="#services" className="text-amber-200/80 hover:text-amber-100 transition-colors font-medium">Services</a>
            <button 
              onClick={handleLessonsClick}
              className="text-amber-200/80 hover:text-amber-100 transition-colors font-medium"
            >
              Lessons
            </button>
            <button 
              onClick={handleGalleryClick}
              className="text-amber-200/80 hover:text-amber-100 transition-colors font-medium"
            >
              Gallery
            </button>
            <a href="#contact" className="text-amber-200/80 hover:text-amber-100 transition-colors font-medium">Contact</a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-amber-200/80 text-serif">Welcome, {user.user_metadata?.full_name || user.email}</span>
                <Button
                  onClick={handleBookStudio}
                  className="btn-analog text-black px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300"
                >
                  Book Studio Time
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-amber-200/80 hover:text-amber-100 hover:bg-amber-500/10 glass-effect"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleAuthClick}
                  variant="ghost"
                  className="text-amber-200/80 hover:text-amber-100 hover:bg-amber-500/10 glass-effect"
                >
                  <User size={16} className="mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={handleBookStudio}
                  className="btn-analog text-black px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300"
                >
                  Book Studio Time
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-amber-100 glass-effect p-2 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-amber-500/20">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-amber-200/80 hover:text-amber-100 transition-colors font-medium">Home</a>
              <a href="#services" className="text-amber-200/80 hover:text-amber-100 transition-colors font-medium">Services</a>
              <button 
                onClick={handleLessonsClick}
                className="text-amber-200/80 hover:text-amber-100 transition-colors text-left font-medium"
              >
                Lessons
              </button>
              <button 
                onClick={handleGalleryClick}
                className="text-amber-200/80 hover:text-amber-100 transition-colors text-left font-medium"
              >
                Gallery
              </button>
              <a href="#contact" className="text-amber-200/80 hover:text-amber-100 transition-colors font-medium">Contact</a>
              
              {user ? (
                <>
                  <span className="text-amber-200/80 py-2 border-t border-amber-500/20 text-serif">
                    Welcome, {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button
                    onClick={handleBookStudio}
                    className="btn-analog text-black px-6 py-2 rounded-full w-fit transform hover:scale-105 transition-all duration-300"
                  >
                    Book Studio Time
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="text-amber-200/80 hover:text-amber-100 hover:bg-amber-500/10 w-fit glass-effect"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleAuthClick}
                    variant="ghost"
                    className="text-amber-200/80 hover:text-amber-100 hover:bg-amber-500/10 w-fit glass-effect"
                  >
                    <User size={16} className="mr-2" />
                    Sign In
                  </Button>
                  <Button
                    onClick={handleBookStudio}
                    className="btn-analog text-black px-6 py-2 rounded-full w-fit transform hover:scale-105 transition-all duration-300"
                  >
                    Book Studio Time
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
