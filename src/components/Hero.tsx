
import { Play, ArrowRight } from 'lucide-react';

interface HeroProps {
  onBookStudioTime: () => void;
}

const Hero = ({ onBookStudioTime }: HeroProps) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with studio imagery and texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/lovable-uploads/ec3624b8-81f1-4a7b-9d55-663f9f753905.png')`
        }}
      />
      
      {/* Warm ambient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-red-900/10"></div>
      
      {/* Subtle grain texture */}
      <div className="absolute inset-0 texture-grain"></div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge with warm styling */}
          <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-3 mb-8 border border-amber-500/20">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-warm-pulse"></div>
            <span className="text-sm text-amber-100 font-medium tracking-wide">Professional Recording Studio</span>
          </div>

          {/* Main Headline with character */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Premium Music
            <span className="block analog-gradient bg-clip-text text-transparent warm-text-glow font-black"> 
              Production
            </span>
          </h1>

          {/* Subtitle with serif accent */}
          <p className="text-xl md:text-2xl text-amber-100 mb-4 font-light text-serif italic">
            Recording • Mixing • Mastering • Artist Development
          </p>

          {/* Description with warmth */}
          <p className="text-lg text-amber-200/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your musical vision into professional recordings. From intimate acoustic sessions to full-band productions, we deliver industry-standard quality with a personal touch.
          </p>

          {/* Analog-style CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="group btn-analog text-black px-8 py-4 rounded-lg font-semibold text-lg relative overflow-hidden"
              onClick={onBookStudioTime}
            >
              <span className="relative z-10">Book Studio Time</span>
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
            
            <a
              href="https://soundcloud.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 text-amber-100 border-2 border-amber-500/40 px-8 py-4 rounded-lg font-semibold text-lg hover:border-amber-400 hover:bg-amber-500/10 glass-effect transition-all duration-300"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Listen to Our Work</span>
            </a>
          </div>

          {/* Stats with warm styling */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-amber-500/20">
            <div className="text-center animate-float" style={{ animationDelay: '0s' }}>
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2 warm-text-glow">500+</div>
              <div className="text-amber-200/70 text-serif">Songs Produced</div>
            </div>
            <div className="text-center animate-float" style={{ animationDelay: '2s' }}>
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2 warm-text-glow">15+</div>
              <div className="text-amber-200/70 text-serif">Years Experience</div>
            </div>
            <div className="text-center animate-float" style={{ animationDelay: '4s' }}>
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2 warm-text-glow">100+</div>
              <div className="text-amber-200/70 text-serif">Happy Artists</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analog scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-400/40 rounded-full flex justify-center warm-glow">
          <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
