
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <span className="text-white font-bold text-xl">3rd Street Music</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
            <button 
              onClick={handleLessonsClick}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Lessons
            </button>
            <button 
              onClick={handleGalleryClick}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Gallery
            </button>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {user.user_metadata?.full_name || user.email}</span>
                <Button
                  onClick={handleBookStudio}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Book Studio Time
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleAuthClick}
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  <User size={16} className="mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={handleBookStudio}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Book Studio Time
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <button 
                onClick={handleLessonsClick}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Lessons
              </button>
              <button 
                onClick={handleGalleryClick}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Gallery
              </button>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              
              {user ? (
                <>
                  <span className="text-gray-300 py-2 border-t border-gray-800">
                    Welcome, {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button
                    onClick={handleBookStudio}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 w-fit"
                  >
                    Book Studio Time
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="text-gray-300 hover:text-white w-fit"
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
                    className="text-gray-300 hover:text-white w-fit"
                  >
                    <User size={16} className="mr-2" />
                    Sign In
                  </Button>
                  <Button
                    onClick={handleBookStudio}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 w-fit"
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
