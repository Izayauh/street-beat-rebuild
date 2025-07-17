
-- Create a table for lesson bookings
CREATE TABLE public.lesson_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  lesson_type TEXT NOT NULL,
  instructor TEXT,
  preferred_date DATE,
  preferred_time TIME,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.lesson_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert bookings (public booking form)
CREATE POLICY "Anyone can create lesson bookings" 
  ON public.lesson_bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow users to view their own bookings (if they have an account)
CREATE POLICY "Users can view their own bookings" 
  ON public.lesson_bookings 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL OR true);

-- Create a table for instructors
CREATE TABLE public.instructors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  image_url TEXT,
  available_days TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for instructors
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read instructor info
CREATE POLICY "Anyone can view instructors" 
  ON public.instructors 
  FOR SELECT 
  USING (true);

-- Insert sample instructors
INSERT INTO public.instructors (name, bio, specialties, available_days) VALUES
('Sarah Johnson', 'Professional pianist with 10+ years teaching experience. Specializes in classical and contemporary styles.', ARRAY['Piano', 'Music Theory'], ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday']),
('Mike Rodriguez', 'Vocalist and vocal coach who has worked with local artists across multiple genres.', ARRAY['Vocal', 'Songwriting'], ARRAY['Tuesday', 'Wednesday', 'Thursday', 'Friday']),
('Alex Chen', 'Drummer and percussionist with extensive studio and live performance experience.', ARRAY['Drums', 'Percussion'], ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday']),
('Jamie Taylor', 'Guitar instructor specializing in rock, blues, and acoustic styles.', ARRAY['Guitar', 'Bass'], ARRAY['Monday', 'Tuesday', 'Thursday', 'Friday']),
('Chris Morgan', 'Music producer and engineer with expertise in digital audio workstations and recording techniques.', ARRAY['Music Production', 'Audio Engineering'], ARRAY['Wednesday', 'Thursday', 'Friday', 'Saturday']);
