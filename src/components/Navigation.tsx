
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface NavigationProps {
  onGetQuote: () => void;
  onContactOpen: () => void;
}

export const Navigation = ({ onGetQuote, onContactOpen }: NavigationProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleGetQuote = () => {
    onGetQuote();
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
                onClick={() => onContactOpen()}
                className="w-full text-left px-4 py-2 text-amber-200 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-serif"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
