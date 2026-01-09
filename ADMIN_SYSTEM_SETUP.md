# Enterprise Admin System Setup Guide

## Overview

This guide will help you set up the world-class enterprise admin system for HDA Studio. This system includes:

✅ **Gallery Manager** - AI auto-tagging, drag & drop, bulk operations, image editing
✅ **Service Packages/Bundles** - Create bundled services at special pricing
✅ **Enhanced Services Manager** - Database-driven services with advanced management
✅ **Complete Pricing System** - Tiers, add-ons marketplace, dynamic pricing rules, discount codes

---

## Phase 1: Database Foundation (COMPLETED ✅)

### What Was Done

✅ Installed required npm packages:
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` - Drag and drop
- `react-dropzone` - File upload
- `react-easy-crop` - Image cropping
- `openai` - AI image tagging
- `react-colorful` - Color picker
- `@tiptap/react`, `@tiptap/starter-kit` - Rich text editor
- `compressorjs` - Image compression

✅ Created 3 database migrations:
1. `20260108000001_create_gallery_system.sql` - Gallery images, collections, AI tagging
2. `20260108000002_create_services_packages.sql` - Services and service packages
3. `20260108000003_create_pricing_system.sql` - Tiers, add-ons, rules, discounts

✅ Created TypeScript type definitions:
- `src/types/gallery.ts` - Gallery types and helpers
- `src/types/services.ts` - Services and packages types
- `src/types/pricing.ts` - Pricing system types

---

## Step 1: Run Database Migrations

### Option A: Using Supabase CLI (Recommended)

```bash
# Make sure you're logged in to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref rkvzzzgyoulifccnfcpv

# Run migrations
npx supabase db push
```

### Option B: Manual SQL Execution

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - First: `20260108000001_create_gallery_system.sql`
   - Second: `20260108000002_create_services_packages.sql`
   - Third: `20260108000003_create_pricing_system.sql`

### Verification

After running migrations, verify the tables were created:

```sql
-- Check gallery tables
SELECT COUNT(*) FROM public.gallery_images;
SELECT COUNT(*) FROM public.gallery_collections;

-- Check services tables
SELECT COUNT(*) FROM public.services;
SELECT COUNT(*) FROM public.service_packages;

-- Check pricing tables
SELECT COUNT(*) FROM public.pricing_tiers;
SELECT COUNT(*) FROM public.add_ons;
SELECT COUNT(*) FROM public.pricing_rules;
SELECT COUNT(*) FROM public.discount_codes;
```

---

## Step 2: Verify Storage Buckets

The migrations automatically create three storage buckets. Verify they exist:

1. Go to Supabase Dashboard → Storage
2. Confirm these buckets exist:
   - `gallery-images` (public, 10MB limit)
   - `gallery-thumbnails` (public, 2MB limit)
   - `service-images` (public, 10MB limit)

If buckets weren't created automatically, create them manually with these settings:

**gallery-images:**
- Public: ✅ Yes
- File size limit: 10MB
- Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

**gallery-thumbnails:**
- Public: ✅ Yes
- File size limit: 2MB
- Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

**service-images:**
- Public: ✅ Yes
- File size limit: 10MB
- Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

---

## Step 3: Regenerate Supabase Types

After running migrations, regenerate TypeScript types to include new tables:

```bash
# Option 1: Using Supabase CLI
npx supabase gen types typescript --project-id rkvzzzgyoulifccnfcpv > src/integrations/supabase/types.ts

# Option 2: Manual download from dashboard
# Go to Supabase Dashboard → API → Generate Types
# Copy the generated types and paste into src/integrations/supabase/types.ts
```

---

## Step 4: Set Up OpenAI API (For AI Tagging)

1. Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

2. Add to your `.env` file:
```bash
VITE_OPENAI_API_KEY=sk-...your-key-here
```

3. **Optional**: If you prefer Google Cloud Vision instead of OpenAI:
   - Get API key from Google Cloud Console
   - Update `src/lib/ai/image-tagging.ts` to use Google's API

---

## Step 5: Test the Setup

### Test Database Access

```typescript
// Test in browser console or create a test file
import { supabase } from '@/integrations/supabase/client';

// Test gallery images table
const { data, error } = await supabase
  .from('gallery_images')
  .select('*')
  .limit(1);

console.log('Gallery test:', { data, error });

// Test services table
const { data: services } = await supabase
  .from('services')
  .select('*')
  .limit(1);

console.log('Services test:', services);
```

### Test Storage Access

```typescript
// Test image upload
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

const { data, error } = await supabase.storage
  .from('gallery-images')
  .upload(`test/${Date.now()}.jpg`, file);

console.log('Upload test:', { data, error });
```

---

## What's Next: Phase 2 Implementation

Now that Phase 1 (Database Foundation) is complete, the next phases are:

### Phase 2: Gallery Manager Core (Next)
- [ ] Create GalleryManager component
- [ ] Build ImageUploader with drag-and-drop
- [ ] Implement useImageUpload hook
- [ ] Create ImageGrid with drag-and-drop reordering
- [ ] Build ImageCard component
- [ ] Add category filtering

### Phase 3: Gallery Advanced Features
- [ ] Implement ImageEditor (crop, filters)
- [ ] Build BulkActionsToolbar
- [ ] Create CollectionManager
- [ ] Add metadata editing

### Phase 4: AI Auto-Tagging
- [ ] Create process-gallery-image edge function
- [ ] Build AITaggingPanel component
- [ ] Implement batch AI processing

### Phase 5-7: Services, Packages & Pricing
- [ ] Create enhanced ServicesManager
- [ ] Build PackagesManager
- [ ] Implement complete Pricing System

---

## Database Schema Reference

### Gallery System Tables

**gallery_images**
- Stores all gallery images with metadata
- AI tagging support (ai_tags, ai_description, ai_confidence)
- Categorization (bridal, editorial, evening_glam, etc.)
- Display ordering and publishing controls

**gallery_collections**
- Organize images into themed collections
- Each collection has cover image and slug

**gallery_collection_images**
- Many-to-many relationship between images and collections

### Services System Tables

**services**
- All available services with pricing
- Categories: makeup, hair, combo, bridal, event, bundle
- Stripe integration support
- Deposit percentage configuration

**service_packages**
- Service bundles at special pricing
- Automatic savings calculation
- Total duration calculation

**package_services**
- Many-to-many relationship between packages and services
- Quantity support for multiple of same service

### Pricing System Tables

**pricing_tiers**
- Bronze/Silver/Gold/Platinum tiers per service
- Custom pricing and features for each tier

**add_ons**
- Marketplace of add-on services
- Service compatibility rules
- Variable pricing support

**pricing_rules**
- Dynamic pricing based on conditions
- Day of week, time of day, seasonal rules
- Priority-based rule application

**discount_codes**
- Promotional discount codes
- Usage limits and tracking
- Referral code support
- Buy X Get Y functionality

**discount_code_usage**
- Tracks all discount code redemptions
- Per-user usage tracking

---

## Helper Functions

### Gallery Functions

```sql
-- Get full image URL from storage path
SELECT public.get_gallery_image_url('path/to/image.jpg');

-- Get thumbnail URL
SELECT public.get_thumbnail_url('path/to/thumb.jpg');
```

### Services Functions

```sql
-- Calculate package savings automatically
SELECT public.calculate_package_savings('package-uuid');

-- Calculate total package duration
SELECT public.calculate_package_duration('package-uuid');
```

### Pricing Functions

```sql
-- Validate discount code
SELECT * FROM public.validate_discount_code(
  'WELCOME20',
  ARRAY['service-uuid-1', 'service-uuid-2']::UUID[],
  ARRAY[]::UUID[],
  150.00,
  'user-uuid'
);

-- Record discount usage
SELECT public.record_discount_usage(
  'WELCOME20',
  30.00,
  'user-uuid',
  'appointment-uuid'
);

-- Evaluate pricing rules for a service
SELECT public.evaluate_pricing_rules(
  'service-uuid',
  '2026-01-15'::DATE,
  '18:00'::TIME,
  120.00
);
```

---

## Security Notes

✅ **Row Level Security (RLS)** is enabled on all tables
✅ **Admin-only policies** protect write operations
✅ **Public read policies** allow viewing published content
✅ **Storage policies** restrict uploads to admins only

**Admin Check Function:**
```sql
public.has_role(auth.uid(), 'admin')
```

This function is used throughout all policies to verify admin access.

---

## Troubleshooting

### Issue: Migrations fail to run

**Solution:**
- Check that you're logged in to Supabase CLI
- Verify project ID is correct
- Try running migrations one at a time manually

### Issue: Storage buckets not created

**Solution:**
- Create buckets manually in Supabase Dashboard
- Copy storage policies from migration file
- Run them in SQL Editor

### Issue: RLS policies blocking access

**Solution:**
- Verify you're logged in as admin user
- Check user_roles table has admin role for your user:
```sql
SELECT * FROM public.user_roles WHERE user_id = auth.uid();
```
- Add admin role if missing:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES (auth.uid(), 'admin');
```

### Issue: TypeScript types not updated

**Solution:**
- Regenerate types using Supabase CLI
- Restart your dev server
- Clear TypeScript cache: `rm -rf node_modules/.cache`

---

## Environment Variables Checklist

Make sure these are set in your `.env` file:

```bash
# Supabase (already configured)
VITE_SUPABASE_URL=https://rkvzzzgyoulifccnfcpv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-key-here

# OpenAI (for AI tagging)
VITE_OPENAI_API_KEY=sk-...your-key-here

# Optional: Google Cloud Vision (alternative to OpenAI)
# VITE_GOOGLE_CLOUD_VISION_KEY=your-key-here
```

---

## Support

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Review migration files for any SQL errors
3. Verify all environment variables are set correctly
4. Check Supabase Dashboard logs for detailed error messages

---

**Setup Status: Phase 1 Complete ✅**
**Next Step: Begin Phase 2 - Gallery Manager Core Implementation**

*Last Updated: January 8, 2026*
