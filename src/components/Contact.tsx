
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
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('✅ Database save successful');

      // Step 2: Send confirmation email
      console.log('Step 2: Sending confirmation email...');
      
      const emailPayload = {
        name: formData.name,
        email: formData.email,
        service: formData.service,
        message: formData.message
      };
      
      console.log('Email payload:', emailPayload);

      const response = await fetch(
        'https://rbikuvzeyarcmznvoxns.supabase.co/functions/v1/send-confirmation-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaWt1dnpleWFyY216bnZveG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjEyNDIsImV4cCI6MjA2NTQ5NzI0Mn0.vvdVgdIbFKlp6bmINeXFvbDgkLZIA_DFBd2aIiH1Lrk`,
          },
          body: JSON.stringify(emailPayload)
        }
      );

      console.log('Email response status:', response.status);
      console.log('Email response ok:', response.ok);

      const responseData = await response.json();
      console.log('Email response data:', responseData);

      if (response.ok && responseData.success) {
        console.log('✅ Email sent successfully');
        toast.success('Message sent successfully! Check your email for confirmation.');
      } else {
        console.error('❌ Email failed:', responseData);
        toast.error('Message saved but email confirmation failed. We will still contact you!');
      }

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
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Ready to bring your musical vision to life? Contact us today and let's create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
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
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Address</p>
                    <p className="text-gray-400">230 N 3rd Street<br />Hamilton, OH 45011</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Phone</p>
                    <a href="tel:5137371900" className="text-gray-400 hover:text-white transition-colors">
                      (513) 737-1900
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <a href="mailto:miles@3rdstreetmusic.com" className="text-gray-400 hover:text-white transition-colors">
                      miles@3rdstreetmusic.com
                    </a>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Studio Hours</p>
                    <p className="text-gray-400">
                      Monday - Friday: 10am - 10pm<br />
                      Saturday: 10am - 8pm<br />
                      Sunday: By appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/3rdStreetMusic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a 
                  href="https://www.instagram.com/3rdstreetmusic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a 
                  href="https://3rdStreetMusic.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <Globe className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-3">Why Choose 3rd Street Music?</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Professional recording studio in Hamilton, OH</li>
                <li>• Experienced producers and engineers</li>
                <li>• Full-service music production</li>
                <li>• Instrument sales through Reverb marketplace</li>
                <li>• Connecting Hamilton and beyond to music</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
