-- Create clients table with full management capabilities
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  is_vip BOOLEAN DEFAULT false,
  preferred_contact_method TEXT DEFAULT 'email',
  birthday DATE,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Admins can view all clients"
  ON public.clients FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert clients"
  ON public.clients FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clients"
  ON public.clients FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clients"
  ON public.clients FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add client_id foreign key to appointments table to link appointments to clients
ALTER TABLE public.appointments 
  ADD COLUMN client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_name ON public.clients(name);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);