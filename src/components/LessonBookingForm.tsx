
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  bio: string | null;
  specialties: string[] | null;
  image_url: string | null;
  available_days: string[] | null;
}

interface LessonBookingFormProps {
  selectedLessonType?: string;
  instructors: Instructor[];
}

const LESSON_TYPES = ['Piano', 'Vocal', 'Drums', 'Guitar', 'Music Production'];

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', 
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

const LessonBookingForm = ({ selectedLessonType = '', instructors }: LessonBookingFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    lessonType: selectedLessonType,
    instructor: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getFilteredInstructors = () => {
    if (!formData.lessonType) return instructors;
    
    return instructors.filter(instructor => 
      instructor.specialties?.some(specialty => 
        specialty.toLowerCase().includes(formData.lessonType.toLowerCase())
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.lessonType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('lesson_bookings')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          lesson_type: formData.lessonType,
          instructor: formData.instructor || null,
          preferred_date: formData.preferredDate || null,
          preferred_time: formData.preferredTime || null,
          message: formData.message || null,
          status: 'pending'
        });

      if (error) {
        console.error('Error submitting booking:', error);
        toast.error('Failed to submit booking. Please try again.');
        return;
      }

      toast.success('🎵 Booking submitted successfully! We\'ll be in touch within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        lessonType: selectedLessonType,
        instructor: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-2xl text-center flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6 text-purple-400" />
          Book Your Lesson
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Lesson Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Lesson Type *</Label>
              <Select value={formData.lessonType} onValueChange={(value) => handleInputChange('lessonType', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose an instrument" />
                </SelectTrigger>
                <SelectContent>
                  {LESSON_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Preferred Instructor</Label>
              <Select value={formData.instructor} onValueChange={(value) => handleInputChange('instructor', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Any instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No preference</SelectItem>
                  {getFilteredInstructors().map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.name}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scheduling */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Preferred Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Preferred Time
              </Label>
              <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-gray-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Additional Notes
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your musical experience, goals, or any specific requests..."
              className="bg-gray-700 border-gray-600 text-white"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Book My Lesson 🎵'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>We'll contact you within 24 hours to confirm your lesson details.</p>
          <p className="mt-2">Questions? Call us at (555) 123-MUSIC or email hello@3rdstreetmusic.com</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonBookingForm;
