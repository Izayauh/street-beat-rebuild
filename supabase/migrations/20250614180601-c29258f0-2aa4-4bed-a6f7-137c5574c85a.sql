
-- Create a quotes table to store quote requests
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  email TEXT,
  answers JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Allow insert for authenticated users (attach user_id)
CREATE POLICY "Allow insert own quotes" ON public.quotes
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow select for owner
CREATE POLICY "Allow select own quotes" ON public.quotes
  FOR SELECT USING (user_id = auth.uid());

-- Allow anonymous users to insert (when not logged in, only email required)
CREATE POLICY "Allow anonymous insert quotes" ON public.quotes
  FOR INSERT WITH CHECK (user_id IS NULL AND email IS NOT NULL);

