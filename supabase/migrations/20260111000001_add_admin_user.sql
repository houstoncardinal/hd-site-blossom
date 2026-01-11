-- Add admin role for user 5066a2d5-25fb-4b4a-a2a9-3e873edec1ec
INSERT INTO public.user_roles (user_id, role)
VALUES ('5066a2d5-25fb-4b4a-a2a9-3e873edec1ec', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
