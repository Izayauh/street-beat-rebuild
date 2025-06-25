
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form data:', formData);

    try {
      // Step 1: Save to database
      console.log('Step 1: Saving to database...');
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([formData]);

      if (dbError) {
        console.error('Database error:', dbError);
        toast.error(`Database error: ${dbError.message}`);
        return;
      }

      console.log('✅ Database save successful');
      toast.success('Message sent successfully! We will get back to you soon.');

      // Reset form
      setFormData({ name: '', email: '', service: '', message: '' });

    } catch (error: any) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-20 analog-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 texture-grain opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6 warm-text-glow font-display">Get In Touch</h2>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto text-serif leading-relaxed">
            Ready to bring your musical vision to life? Contact us today and let's create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="card-analog rounded-2xl p-8 warm-glow">
            <div className="mb-6">
              <h3 className="text-amber-400 text-2xl font-display warm-text-glow">Send us a message</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="bg-black/40 border-amber-500/30 text-amber-100 placeholder-amber-200/50 focus:border-amber-400 glass-effect"
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="bg-black/40 border-amber-500/30 text-amber-100 placeholder-amber-200/50 focus:border-amber-400 glass-effect"
                />
              </div>

              <div>
                <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                  <SelectTrigger className="bg-black/40 border-amber-500/30 text-amber-100 glass-effect">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-amber-500/30">
                    <SelectItem value="recording">Recording</SelectItem>
                    <SelectItem value="mixing">Mixing</SelectItem>
                    <SelectItem value="mastering">Mastering</SelectItem>
                    <SelectItem value="beat-production">Beat Production</SelectItem>
                    <SelectItem value="vocal-production">Vocal Production</SelectItem>
                    <SelectItem value="artist-development">Artist Development</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Textarea
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  required
                  rows={5}
                  className="bg-black/40 border-amber-500/30 text-amber-100 placeholder-amber-200/50 focus:border-amber-400 glass-effect"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full btn-analog text-black py-3 transform hover:scale-105 transition-all duration-300"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card-analog rounded-2xl p-8 warm-glow">
              <h3 className="text-2xl font-bold text-amber-400 mb-6 font-display warm-text-glow">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 analog-gradient rounded-lg flex items-center justify-center warm-glow">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-amber-400 font-semibold font-display">Address</p>
                    <p className="text-amber-200/80 text-serif">230 N 3rd Street<br />Hamilton, OH 45011</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 analog-gradient rounded-lg flex items-center justify-center warm-glow">
                    <Phone className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-amber-400 font-semibold font-display">Phone</p>
                    <a href="tel:5137371900" className="text-amber-200/80 hover:text-amber-100 transition-colors text-serif">
                      (513) 737-1900
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 analog-gradient rounded-lg flex items-center justify-center warm-glow">
                    <Mail className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-amber-400 font-semibold font-display">Email</p>
                    <a href="mailto:miles@3rdstreetmusic.com" className="text-amber-200/80 hover:text-amber-100 transition-colors text-serif">
                      miles@3rdstreetmusic.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 analog-gradient rounded-lg flex items-center justify-center warm-glow">
                    <Clock className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-amber-400 font-semibold font-display">Studio Hours</p>
                    <p className="text-amber-200/80 text-serif">
                      Monday - Friday: 10am - 10pm<br />
                      Saturday: 10am - 8pm<br />
                      Sunday: By appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card-analog rounded-2xl p-6 warm-glow">
              <h4 className="text-xl font-bold text-amber-400 mb-4 font-display warm-text-glow">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/3rdStreetMusic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-effect rounded-full flex items-center justify-center hover:warm-glow transition-all duration-300 transform hover:scale-110"
                >
                  <Facebook className="w-6 h-6 text-amber-400" />
                </a>
                <a 
                  href="https://www.instagram.com/3rdstreetmusic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-effect rounded-full flex items-center justify-center hover:warm-glow transition-all duration-300 transform hover:scale-110"
                >
                  <Instagram className="w-6 h-6 text-amber-400" />
                </a>
                <a 
                  href="https://3rdStreetMusic.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-effect rounded-full flex items-center justify-center hover:warm-glow transition-all duration-300 transform hover:scale-110"
                >
                  <Globe className="w-6 h-6 text-amber-400" />
                </a>
              </div>
            </div>

            {/* Additional Info */}
            <div className="card-analog rounded-2xl p-6 warm-glow">
              <h4 className="text-xl font-bold text-amber-400 mb-3 font-display warm-text-glow">Why Choose 3rd Street Music?</h4>
              <ul className="space-y-2 text-amber-200/80">
                <li className="flex items-center text-serif">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 animate-warm-pulse"></div>
                  Professional recording studio in Hamilton, OH
                </li>
                <li className="flex items-center text-serif">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 animate-warm-pulse"></div>
                  Experienced producers and engineers
                </li>
                <li className="flex items-center text-serif">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 animate-warm-pulse"></div>
                  Full-service music production
                </li>
                <li className="flex items-center text-serif">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 animate-warm-pulse"></div>
                  Instrument sales through Reverb marketplace
                </li>
                <li className="flex items-center text-serif">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 animate-warm-pulse"></div>
                  Connecting Hamilton and beyond to music
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
