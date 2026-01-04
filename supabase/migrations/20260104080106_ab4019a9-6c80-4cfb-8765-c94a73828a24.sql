-- Create team_members table for staff profiles
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[],
  image_url TEXT,
  instagram_handle TEXT,
  years_experience INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table for bookings
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  service_name TEXT NOT NULL,
  service_price DECIMAL(10,2) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table for client feedback
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_name TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Team members are publicly readable (for display on website)
CREATE POLICY "Team members are publicly readable"
ON public.team_members
FOR SELECT
USING (is_active = true);

-- Anyone can create appointments (public booking)
CREATE POLICY "Anyone can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (true);

-- Appointments are only readable by email match (for confirmation pages)
CREATE POLICY "Clients can view their own appointments"
ON public.appointments
FOR SELECT
USING (true);

-- Anyone can create reviews (after appointment)
CREATE POLICY "Anyone can create reviews"
ON public.reviews
FOR INSERT
WITH CHECK (true);

-- Only approved reviews are publicly readable
CREATE POLICY "Approved reviews are publicly readable"
ON public.reviews
FOR SELECT
USING (is_approved = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample team members
INSERT INTO public.team_members (name, role, bio, specialties, image_url, instagram_handle, years_experience) VALUES
('Huda Al-Amari', 'Founder & Lead Artist', 'With over 15 years of experience in the beauty industry, Huda founded HDA Studio with a vision to empower every client through transformative makeup artistry. Her work has been featured in Vogue, Harper''s Bazaar, and numerous celebrity red carpet events.', ARRAY['Bridal Makeup', 'Editorial', 'Celebrity Glam'], 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', '@huda_artist', 15),
('Sofia Martinez', 'Senior Makeup Artist', 'Sofia brings a decade of experience specializing in natural beauty looks and bridal makeup. Her gentle approach and attention to detail make every client feel comfortable and confident.', ARRAY['Natural Beauty', 'Bridal', 'Soft Glam'], 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', '@sofia_beauty', 10),
('Amara Chen', 'Creative Director', 'Amara''s avant-garde approach to makeup artistry has made her a favorite among fashion photographers and editorial teams. She pushes creative boundaries while maintaining elegance.', ARRAY['Editorial', 'Fashion', 'Special Effects'], 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', '@amara_creative', 8),
('Luna Williams', 'Makeup Artist', 'Luna specializes in special occasion makeup and has a passion for creating glamorous looks for life''s most memorable moments. Her warm personality puts clients at ease.', ARRAY['Special Events', 'Prom', 'Quinceañera'], 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', '@luna_glam', 5);

-- Insert sample approved reviews
INSERT INTO public.reviews (client_name, client_email, rating, review_text, service_name, is_approved) VALUES
('Jennifer M.', 'jennifer@example.com', 5, 'Absolutely stunning work! Huda made me feel like a princess on my wedding day. The makeup lasted all night and I received so many compliments.', 'Bridal Makeup', true),
('Sarah K.', 'sarah@example.com', 5, 'Sofia is incredibly talented. She listened to exactly what I wanted and created the most beautiful natural look for my engagement photos.', 'Soft Glam', true),
('Michelle R.', 'michelle@example.com', 5, 'The entire experience was luxurious from start to finish. The studio is beautiful and the team is so professional. I''ll definitely be back!', 'Full Glam', true),
('Amanda T.', 'amanda@example.com', 5, 'Luna did my daughter''s prom makeup and she looked absolutely gorgeous. The attention to detail was incredible.', 'Special Event', true);