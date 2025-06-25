
import { Instagram, Facebook, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="analog-gradient-dark border-t border-amber-500/20 py-12 texture-grain relative">
      <div className="absolute inset-0 texture-grain opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 analog-gradient rounded-full flex items-center justify-center warm-glow">
                <span className="text-black font-bold text-sm">3</span>
              </div>
              <span className="text-amber-100 font-bold text-xl font-display tracking-wide">3rd Street Music</span>
            </div>
            <p className="text-amber-200/70 mb-6 max-w-md text-serif leading-relaxed">
              Connecting Hamilton and Beyond to music. Professional recording studio, music shop, and online marketplace for instruments and gear—where creativity meets craftsmanship.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/3rdStreetMusic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:warm-glow transition-all duration-300 transform hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-amber-400" />
              </a>
              <a 
                href="https://www.instagram.com/3rdstreetmusic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:warm-glow transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-amber-400" />
              </a>
              <a 
                href="https://3rdStreetMusic.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:warm-glow transition-all duration-300 transform hover:scale-110"
              >
                <Globe className="w-5 h-5 text-amber-400" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 warm-text-glow font-display">Services</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-amber-200/70 hover:text-amber-100 transition-colors text-serif">Recording</a></li>
              <li><a href="#services" className="text-amber-200/70 hover:text-amber-100 transition-colors text-serif">Mixing</a></li>
              <li><a href="#services" className="text-amber-200/70 hover:text-amber-100 transition-colors text-serif">Mastering</a></li>
              <li><a href="#services" className="text-amber-200/70 hover:text-amber-100 transition-colors text-serif">Beat Production</a></li>
              <li><a href="#services" className="text-amber-200/70 hover:text-amber-100 transition-colors text-serif">Vocal Production</a></li>
              <li><a href="#" className="text-amber-200/70 hover:text-amber-100 transition-colors text-serif">Reverb Marketplace</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 warm-text-glow font-display">Contact</h3>
            <ul className="space-y-2 text-amber-200/70">
              <li className="text-serif">(513) 737-1900</li>
              <li className="text-serif">miles@3rdstreetmusic.com</li>
              <li className="text-serif">230 N 3rd Street<br />Hamilton, OH 45011</li>
              <li className="pt-2">
                <a href="https://3rdStreetMusic.com" className="hover:text-amber-100 transition-colors text-serif">
                  3rdStreetMusic.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-500/20 mt-8 pt-8 text-center">
          <p className="text-amber-200/60 text-serif">&copy; 2024 3rd Street Music. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
