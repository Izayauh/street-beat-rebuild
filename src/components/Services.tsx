
import { Mic, Headphones, Volume2, Music, User, Zap } from 'lucide-react';

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

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From concept to completion, we provide all the services you need to bring your musical vision to life.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white py-3 rounded-lg hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-500/50 transition-all duration-300 font-semibold">
                  Get Quote
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Not sure which service you need?</h3>
            <p className="text-gray-300 mb-6">
              Let's discuss your project and find the perfect solution for your music.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
