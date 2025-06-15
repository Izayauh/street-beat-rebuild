
import { Instagram, Facebook, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <span className="text-white font-bold text-xl">3rd Street Music</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Connecting Hamilton and Beyond to music. Professional recording studio, music shop, and online marketplace for instruments and gear.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/3rdStreetMusic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/3rdstreetmusic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://3rdStreetMusic.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Globe className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Recording</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Mixing</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Mastering</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Beat Production</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Vocal Production</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Reverb Marketplace</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>(513) 737-1900</li>
              <li>miles@3rdstreetmusic.com</li>
              <li>230 N 3rd Street<br />Hamilton, OH 45011</li>
              <li className="pt-2">
                <a href="https://3rdStreetMusic.com" className="hover:text-white transition-colors">
                  3rdStreetMusic.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 3rd Street Music. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
