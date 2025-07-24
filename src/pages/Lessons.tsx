
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LessonBookingForm from '@/components/LessonBookingForm';
import InstructorCard from '@/components/InstructorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Piano, Mic, Drum, Guitar, Headphones } from 'lucide-react';
import { getFunctions, httpsCallable } from "firebase/functions";

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

  useEffect(() => {
    fetchInstructors();
  }, []);

  const functions = getFunctions();
  const getInstructors = httpsCallable(functions, 'getInstructors');

  const fetchInstructors = async () => {
    try {
      const result = await getInstructors();
      setInstructors(result.data as Instructor[]);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const handleBookLesson = (lessonType?: string) => {
    if (lessonType) {
      setSelectedLesson(lessonType);
    }
    scrollToBooking();
  };

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLessonTypes = () => {
    const lessonTypesSection = document.getElementById('lesson-types');
    lessonTypesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section with analog warmth */}
      <section className="pt-24 pb-16 px-4 section-warm relative overflow-hidden">
        <div className="absolute inset-0 texture-grain opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <Music className="w-16 h-16 text-amber-400 animate-warm-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 analog-gradient bg-clip-text text-transparent warm-text-glow">
            Music Lessons at 3rd Street
          </h1>
          <p className="text-xl text-amber-200/80 mb-8 max-w-3xl mx-auto text-serif leading-relaxed">
            Learn from passionate local instructors who genuinely care about your musical journey. 
            Whether you're picking up your first instrument or refining your craft, we're here to help you grow with heart and soul.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToBooking}
              className="btn-analog text-black px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              Book Your Lesson Now 🎵
            </Button>
            <button
              onClick={scrollToLessonTypes}
              className="glass-effect border-2 border-amber-500/40 text-amber-100 hover:border-amber-400 hover:bg-amber-500/10 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Browse Lessons
            </button>
          </div>
        </div>
      </section>

      {/* Lesson Types Section with warm styling */}
      <section id="lesson-types" className="py-16 px-4 analog-gradient-dark relative">
        <div className="absolute inset-0 texture-grain opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-400 mb-6 warm-text-glow">Choose Your Instrument</h2>
            <p className="text-amber-200/80 text-lg max-w-2xl mx-auto text-serif leading-relaxed">
              Every lesson is tailored to your skill level and musical goals. Our instructors bring real-world experience 
              and genuine passion to every session.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {LESSON_TYPES.map((lesson, index) => {
              const IconComponent = lesson.icon;
              return (
                <Card key={lesson.name} className="card-analog hover:warm-glow transition-all duration-500 transform hover:-translate-y-2 animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 analog-gradient rounded-xl flex items-center justify-center mx-auto mb-4 warm-glow">
                      <IconComponent className="w-6 h-6 text-black" />
                    </div>
                    <CardTitle className="text-amber-400 text-xl warm-text-glow">{lesson.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-amber-200/70 mb-6 text-serif leading-relaxed">{lesson.description}</p>
                    <Button 
                      onClick={() => handleBookLesson(lesson.name)}
                      className="btn-analog text-black w-full transform hover:scale-105 transition-all duration-300"
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
      <section className="py-16 px-4 section-warm relative">
        <div className="absolute inset-0 texture-grain opacity-20"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-400 mb-6 warm-text-glow">Meet Your Instructors</h2>
            <p className="text-amber-200/80 text-lg max-w-2xl mx-auto text-serif leading-relaxed">
              Our team of dedicated musicians and educators are here to guide your musical journey with expertise and heart.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor, index) => (
              <div key={instructor.id} className="animate-float" style={{ animationDelay: `${index * 0.4}s` }}>
                <InstructorCard 
                  instructor={instructor}
                  onBookLesson={() => handleBookLesson()}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-16 px-4 analog-gradient-dark relative">
        <div className="absolute inset-0 texture-grain opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-400 mb-6 warm-text-glow">Ready to Start Your Musical Journey?</h2>
            <p className="text-amber-200/80 text-lg max-w-2xl mx-auto text-serif leading-relaxed">
              Fill out the form below and we'll get back to you within 24 hours to schedule your first lesson.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="card-analog p-8 rounded-2xl warm-glow">
              <LessonBookingForm 
                selectedLessonType={selectedLesson}
                instructors={instructors}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4 text-center section-warm relative">
        <div className="absolute inset-0 texture-grain opacity-20"></div>
        <div className="container mx-auto relative z-10">
          <h3 className="text-2xl font-bold text-amber-400 mb-6 warm-text-glow">
            Questions? Ready to get started?
          </h3>
          <Button 
            onClick={scrollToBooking}
            className="btn-analog text-black px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300"
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
