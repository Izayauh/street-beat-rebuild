
import { Mic, Headphones, Volume2, Music, User, Zap } from 'lucide-react';
import React, { useState } from 'react';
import QuoteDialog from './QuoteDialog';

interface ServicesProps {
  onGetQuote: () => void;
  onScheduleConsultation: () => void;
}

const services = [
  {
    icon: Mic,
    title: "Recording",
    description: "Professional multi-track recording in our acoustically treated studio with top-tier equipment and experienced engineers.",
    features: ["Multi-track Recording", "Live Instruments", "Vocal Recording", "Overdubs & Comping"],
  },
  {
    icon: Headphones,
    title: "Mixing",
    description: "Transform your raw recordings into polished, radio-ready tracks with our expert mixing services and industry-standard processing.",
    features: ["Professional Mix", "Stem Mixing", "Recalls Available", "Mix Revisions"],
  },
  {
    icon: Volume2,
    title: "Mastering",
    description: "Final polish for your tracks with professional mastering that ensures your music sounds great on all playback systems.",
    features: ["Stereo Mastering", "Loudness Optimization", "Multi-format Delivery", "Album Sequencing"],
  },
  {
    icon: Music,
    title: "Beat Production",
    description: "Custom beats and instrumentals crafted to match your style and vision, from hip-hop to pop and everything in between.",
    features: ["Custom Beats", "Industry Trends", "Exclusive Rights", "Stems Included"],
  },
  {
    icon: User,
    title: "Vocal Production",
    description: "Specialized vocal production services including tuning, timing, and creative processing to make your vocals shine.",
    features: ["Vocal Tuning", "Comping & Editing", "Creative Processing", "Harmony Arrangement"],
  },
  {
    icon: Zap,
    title: "Artist Development",
    description: "Comprehensive support for emerging artists including song development, arrangement, and career guidance.",
    features: ["Song Development", "Arrangement", "Career Guidance", "Industry Connections"],
  },
];

const Services = ({ onGetQuote, onScheduleConsultation }: ServicesProps) => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section id="services" className="py-20 section-warm relative overflow-hidden">
      <div className="absolute inset-0 texture-grain opacity-20"></div>
      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with analog styling */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 analog-gradient bg-clip-text text-transparent warm-text-glow">
            Our Services
          </h2>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto text-serif leading-relaxed">
            From concept to completion, we provide all the services you need to bring your musical vision to life with soul and craftsmanship.
          </p>
        </div>

        {/* Services Grid with analog cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group card-analog rounded-2xl p-8 hover:warm-glow transition-all duration-500 transform hover:-translate-y-2 animate-float"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {/* Icon with warm styling */}
                <div className="w-16 h-16 analog-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 warm-glow">
                  <IconComponent className="w-8 h-8 text-black" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-amber-400 mb-4 warm-text-glow group-hover:text-amber-300 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-amber-200/70 mb-6 leading-relaxed text-serif">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-amber-300/80">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 animate-warm-pulse"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button with analog styling */}
                <button
                  className="w-full btn-analog text-black py-3 rounded-lg font-semibold transition-all duration-300"
                  onClick={() => setQuoteOpen(true)}
                  type="button"
                >
                  Get Quote
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA with warm analog styling */}
        <div className="text-center mt-16">
          <div className="card-analog rounded-2xl p-8 max-w-2xl mx-auto warm-glow">
            <h3 className="text-2xl font-bold text-amber-400 mb-4 warm-text-glow">Not sure which service you need?</h3>
            <p className="text-amber-200/80 mb-6 text-serif leading-relaxed">
              Let's discuss your project and find the perfect solution for your music. Every artist's journey is unique.
            </p>
            <button
              className="btn-analog text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={onScheduleConsultation}
              type="button"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
