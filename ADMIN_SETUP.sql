-- ============================================================================
-- HDA STUDIO - ADMIN DASHBOARD SETUP
-- ============================================================================
-- Run this SQL in Supabase SQL Editor to set up admin access
-- ============================================================================

-- 1. GRANT ADMIN ROLE
-- Replace the UUID with your actual user ID from Supabase Auth
-- ============================================================================

INSERT INTO public.user_roles (user_id, role)
VALUES ('5066a2d5-25fb-4b4a-a2a9-3e873edec1ec', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify admin role was granted
SELECT
  user_id,
  role,
  created_at
FROM public.user_roles
WHERE user_id = '5066a2d5-25fb-4b4a-a2a9-3e873edec1ec';

-- ============================================================================
-- 2. VERIFY ALL TABLES EXIST
-- ============================================================================

SELECT
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'appointments',
    'reviews',
    'team_members',
    'gallery_images',
    'gallery_collections',
    'gallery_collection_images',
    'services',
    'service_packages',
    'package_services',
    'pricing_tiers',
    'add_ons',
    'pricing_rules',
    'discount_codes',
    'user_roles'
  )
ORDER BY tablename;

-- ============================================================================
-- 3. VERIFY RLS IS ENABLED ON ALL TABLES
-- ============================================================================

SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true
ORDER BY tablename;

-- ============================================================================
-- 4. TEST ADMIN ACCESS
-- ============================================================================

-- Test if has_role function works
SELECT public.has_role('5066a2d5-25fb-4b4a-a2a9-3e873edec1ec', 'admin') AS is_admin;
-- Should return: true

-- ============================================================================
-- 5. CHECK STORAGE BUCKETS
-- ============================================================================

SELECT
  name,
  public,
  created_at
FROM storage.buckets
WHERE name IN ('gallery-images', 'gallery-thumbnails')
ORDER BY name;

-- ============================================================================
-- 6. SAMPLE DATA CHECK (Optional)
-- ============================================================================

-- Count records in each table
SELECT 'appointments' as table_name, COUNT(*) as count FROM appointments
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL
SELECT 'gallery_images', COUNT(*) FROM gallery_images
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'service_packages', COUNT(*) FROM service_packages
UNION ALL
SELECT 'pricing_tiers', COUNT(*) FROM pricing_tiers
UNION ALL
SELECT 'add_ons', COUNT(*) FROM add_ons
ORDER BY table_name;

-- ============================================================================
-- 7. CREATE SAMPLE PRICING TIER (Optional)
-- ============================================================================

INSERT INTO public.pricing_tiers (name, tier_level, description, base_price, price_multiplier, features, is_active)
VALUES
  ('Bronze Basic', 'bronze', 'Essential beauty services', 90.00, 1.0, ARRAY['Basic makeup', 'Natural look', '60 min session'], true),
  ('Silver Standard', 'silver', 'Enhanced beauty with premium products', 150.00, 1.5, ARRAY['Full makeup', 'Airbrush option', 'Lashes included', '90 min session'], true),
  ('Gold Premium', 'gold', 'Complete beauty transformation', 250.00, 2.0, ARRAY['Full glam makeup', 'Hair styling', 'Premium products', 'Touch-up kit', '120 min session'], true),
  ('Platinum VIP', 'platinum', 'Ultimate luxury experience', 400.00, 2.5, ARRAY['Bridal package', 'Trial session', 'On-location service', 'Photography makeup', 'Full day availability'], true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. CREATE SAMPLE ADD-ONS (Optional)
-- ============================================================================

INSERT INTO public.add_ons (name, description, price, duration_minutes, is_active)
VALUES
  ('False Lashes', 'Premium false lash application', 25.00, 15, true),
  ('Airbrush Makeup', 'Flawless airbrush foundation', 50.00, 20, true),
  ('Hair Styling', 'Professional updo or styling', 75.00, 45, true),
  ('Touch-up Kit', 'Take-home touch-up products', 35.00, NULL, true),
  ('Makeup Lesson', '30-minute technique tutorial', 60.00, 30, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. GRANT ADDITIONAL ADMIN USERS (Add as needed)
-- ============================================================================

-- Uncomment and replace with actual user IDs to grant admin access:

-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('ANOTHER-USER-UUID-HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================================
-- 10. FINAL VERIFICATION
-- ============================================================================

-- Check everything is ready
SELECT
  'Admin Users' as check_type,
  COUNT(*) as count
FROM public.user_roles
WHERE role = 'admin'
UNION ALL
SELECT 'Tables with RLS', COUNT(*)
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true
UNION ALL
SELECT 'Storage Buckets', COUNT(*)
FROM storage.buckets
WHERE name LIKE 'gallery%'
UNION ALL
SELECT 'Pricing Tiers', COUNT(*)
FROM public.pricing_tiers
UNION ALL
SELECT 'Add-Ons', COUNT(*)
FROM public.add_ons;

-- ============================================================================
-- SETUP COMPLETE! ✅
-- ============================================================================
--
-- Next Steps:
-- 1. Go to http://localhost:5173/admin
-- 2. Start managing your business!
--
-- Need help? Check:
-- - ADMIN_QUICK_START.md
-- - ADMIN_FEATURES.md
-- ============================================================================
