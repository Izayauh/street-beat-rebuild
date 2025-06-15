
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LessonBookingForm from '@/components/LessonBookingForm';
import InstructorCard from '@/components/InstructorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Piano, Mic, Drum, Guitar, Headphones } from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  bio: string | null;
  specialties: string[] | null;
  image_url: string | null;
  available_days: string[] | null;
}

const LESSON_TYPES = [
  { name: 'Piano', icon: Piano, description: 'Classical, jazz, contemporary, and beginner-friendly lessons' },
  { name: 'Vocal', icon: Mic, description: 'Voice training, breathing techniques, and performance coaching' },
  { name: 'Drums', icon: Drum, description: 'Rock, jazz, latin rhythms, and percussion fundamentals' },
  { name: 'Guitar', icon: Guitar, description: 'Acoustic, electric, fingerpicking, and songwriting' },
  { name: 'Music Production', icon: Headphones, description: 'DAW training, mixing, mastering, and sound design' },
];

const Lessons = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching instructors:', error);
        return;
      }

      setInstructors(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBookLesson = (lessonType?: string) => {
    if (lessonType) {
      setSelectedLesson(lessonType);
    }
    setShowBookingForm(true);
  };

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Music className="w-16 h-16 text-purple-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Music Lessons at <span className="text-purple-400">3rd Street</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Learn from passionate local instructors who genuinely care about your musical journey. 
            Whether you're picking up your first instrument or refining your craft, we're here to help you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToBooking}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              Book Your Lesson Now 🎵
            </Button>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('lesson-types')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black px-8 py-3 text-lg"
              size="lg"
            >
              Browse Lessons
            </Button>
          </div>
        </div>
      </section>

      {/* Lesson Types Section */}
      <section id="lesson-types" className="py-16 px-4 bg-gray-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Instrument</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Every lesson is tailored to your skill level and musical goals. Our instructors bring real-world experience 
              and genuine passion to every session.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {LESSON_TYPES.map((lesson) => {
              const IconComponent = lesson.icon;
              return (
                <Card key={lesson.name} className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-colors">
                  <CardHeader className="text-center">
                    <IconComponent className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <CardTitle className="text-white text-xl">{lesson.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 mb-6">{lesson.description}</p>
                    <Button 
                      onClick={() => handleBookLesson(lesson.name)}
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                    >
                      Book {lesson.name} Lesson
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Your Instructors</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Our team of dedicated musicians and educators are here to guide your musical journey with expertise and heart.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <InstructorCard 
                key={instructor.id} 
                instructor={instructor}
                onBookLesson={() => handleBookLesson()}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-16 px-4 bg-gray-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Musical Journey?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you within 24 hours to schedule your first lesson.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <LessonBookingForm 
              selectedLessonType={selectedLesson}
              instructors={instructors}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4 text-center">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            Questions? Ready to get started?
          </h3>
          <Button 
            onClick={scrollToBooking}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            Book Your Lesson Now 🎵
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Lessons;
