# Advanced Image Management Features

## Overview

Two powerful new image management features have been added to the admin dashboard:

1. **Service Image Management** - Upload and manage hero images for each service
2. **Before/After Gallery** - Create stunning transformation showcases with paired images

---

## 1. Service Image Management

### Features

**Powerful Image Upload:**
- Drag-and-drop or click to upload
- Automatic image compression (max 1200px, 80% quality)
- Real-time preview
- File validation (type and size)
- Instant upload to Supabase Storage
- Remove and replace functionality

**Visual Service Cards:**
- Service images displayed at the top of each card
- Beautiful 160px height preview
- Hover effects and smooth transitions
- Responsive design
- Fallback to no-image state

**Integration:**
- Built into Service Form dialog
- Images stored in `service-images` bucket
- Public access for displaying on website
- Admin-only upload permissions

### How to Use

1. **Navigate to Services Manager:**
   - Admin Dashboard → Services tab

2. **Add Image to Service:**
   - Click "Add Service" or "Edit" existing service
   - In the form, find the "Service Image" section
   - Click to upload or drag & drop an image
   - Image compresses and uploads automatically
   - Preview appears immediately

3. **Remove Image:**
   - Hover over the image preview
   - Click "Remove Image" button
   - Image deleted from storage

4. **View on Service Card:**
   - Service cards now display the uploaded image
   - Image appears at top of card with 160px height
   - Professional appearance with cover fit

### Technical Details

**Files Created:**
- `ServiceImageUploader.tsx` (200 lines) - Upload component with compression
- Updated `ServiceForm.tsx` - Integrated image uploader
- Updated `ServicesManager.tsx` - Display images on cards

**Database:**
- Uses existing `services.image_url` column
- Stores public URL from Supabase Storage

**Storage:**
- Bucket: `service-images`
- Path: `services/{timestamp}-{random}.{ext}`
- Compression: 1200px max, 80% quality
- Max file size: 10MB

**Features:**
- ✅ Automatic compression with Compressorjs
- ✅ Unique filename generation
- ✅ Upload progress feedback
- ✅ Error handling with toast notifications
- ✅ Image preview before save
- ✅ Remove from storage on delete
- ✅ Public access for website display

---

## 2. Before/After Gallery Manager

### Features

**Powerful Pairing System:**
- Select any two unpaired images
- Link them as before/after pair
- Add transformation notes
- Visual side-by-side display
- Unlink functionality

**Smart Image Selection:**
- Grid view of available images
- Click to select before image
- Click to select after image
- Visual selection indicators
- Excludes already-paired images

**Professional Display:**
- Side-by-side comparison layout
- "Before" and "After" badges
- Transformation notes display
- Featured and published status
- Responsive grid layout

**Advanced Features:**
- Edit transformation notes
- Unlink pairs with confirmation
- Search by notes or titles
- Category auto-set to 'before_after'
- Database-driven pairing

### How to Use

1. **Navigate to Before/After Tab:**
   - Admin Dashboard → Gallery → Before/After tab

2. **Create Before/After Pair:**
   - Click "Create Pair" button
   - Select "Before" image from grid (click to highlight)
   - Select "After" image from grid
   - Add transformation notes (optional)
   - Click "Create Pair"

3. **View Pairs:**
   - All pairs displayed in responsive grid
   - Before image on left, After on right
   - Transformation notes below images
   - Status badges (Featured, Unpublished)

4. **Edit Transformation Notes:**
   - Click three-dot menu on any pair
   - Select "Edit Notes"
   - Update the transformation description
   - Click "Update"

5. **Unlink Pair:**
   - Click three-dot menu on any pair
   - Select "Unlink Pair"
   - Confirm action
   - Images return to available pool

### Technical Details

**Files Created:**
- `BeforeAfterManager.tsx` (473 lines) - Main management component
- `useBeforeAfterPairs.ts` (146 lines) - Custom hook for CRUD operations
- `20260110000002_enhance_images.sql` - Database migration

**Database Enhancements:**

**New Columns (gallery_images):**
```sql
before_after_pair_id UUID - References paired image
is_before_image BOOLEAN - true=before, false=after, null=unpaired
transformation_notes TEXT - Description of transformation
```

**New View:**
```sql
before_after_pairs - Joined view of all pairs
```

**New Functions:**
```sql
link_before_after_images() - Create pair with validation
unlink_before_after_images() - Safely unlink pair
```

**Features:**
- ✅ Database-driven pairing
- ✅ Visual selection interface
- ✅ Real-time availability checking
- ✅ Transformation notes editing
- ✅ Safe unlinking (returns images to pool)
- ✅ Search functionality
- ✅ Responsive grid display
- ✅ Status badges
- ✅ Error handling

---

## Database Migration

### Migration: `20260110000002_enhance_images.sql`

**What it does:**
1. Adds before/after pairing columns to gallery_images
2. Creates before_after_pairs view for easy querying
3. Creates service-images storage bucket
4. Adds storage policies (public read, admin write/delete)
5. Creates helper functions for linking/unlinking

**To Apply:**
Run in Supabase SQL Editor:
```sql
-- Copy contents of migration file
-- Execute in SQL Editor
```

Or use Supabase CLI:
```bash
npx supabase db push
```

### Verification

**Check tables:**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'gallery_images'
  AND column_name IN ('before_after_pair_id', 'is_before_image', 'transformation_notes');
```

**Check view:**
```sql
SELECT * FROM before_after_pairs LIMIT 5;
```

**Check storage bucket:**
```sql
SELECT name, public FROM storage.buckets WHERE name = 'service-images';
```

---

## Gallery Manager Updates

### New Tab Structure

Gallery Manager now has **4 tabs**:

1. **Images** - Original image management (upload, organize, tag)
2. **Before/After** ⭐ NEW - Transformation showcase
3. **Collections** - Themed image collections
4. **AI Tagging** - Automatic tagging with OpenAI

### Updated UI

- Grid layout: 4 equal-width tabs
- Responsive labels (hide text on mobile, show icons)
- Consistent styling across all tabs
- Smooth transitions

---

## Usage Examples

### Example 1: Adding Service Image

```typescript
// User workflow:
1. Open Services Manager
2. Click "Edit" on "Bridal Makeup" service
3. Upload bridal-hero.jpg (3MB)
   → Compresses to 800KB
   → Uploads to service-images/1736519234-abc123.jpg
   → URL saved to database
4. Service card now shows beautiful hero image
5. Public website displays image on service page
```

### Example 2: Creating Before/After Pair

```typescript
// User workflow:
1. Upload "before-client1.jpg" to gallery
2. Upload "after-client1.jpg" to gallery
3. Go to Gallery → Before/After tab
4. Click "Create Pair"
5. Select before-client1.jpg (left column)
6. Select after-client1.jpg (right column)
7. Add note: "Full glam bridal makeup with airbrush foundation and false lashes"
8. Click "Create Pair"
9. Pair appears in gallery with side-by-side display
10. Both images auto-categorized as 'before_after'
```

---

## Component Architecture

### Service Image Management

```
ServiceForm.tsx
├── ServiceImageUploader.tsx
│   ├── File input with drag & drop
│   ├── Compressorjs for compression
│   ├── Supabase Storage upload
│   └── Preview and remove functionality
└── Form data with image_url

ServicesManager.tsx
└── Service cards with image display
    ├── 160px height image section
    └── Fallback to no-image state
```

### Before/After Management

```
GalleryManager.tsx
└── Tab: before-after
    └── BeforeAfterManager.tsx
        ├── useBeforeAfterPairs hook
        │   ├── Fetch pairs from view
        │   ├── linkPair() RPC call
        │   ├── unlinkPair() RPC call
        │   └── updatePair() notes update
        ├── Create Pair Dialog
        │   ├── Grid of available images
        │   ├── Before selection
        │   ├── After selection
        │   └── Transformation notes
        ├── Pairs Display Grid
        │   ├── Side-by-side images
        │   ├── Badges (Before/After)
        │   └── Status indicators
        └── Edit Notes Dialog
```

---

## Best Practices

### Service Images

1. **Image Size:** Upload high-quality images (at least 1200px wide)
2. **Aspect Ratio:** Use consistent ratios (16:9 or 4:3 recommended)
3. **File Format:** JPG for photos, PNG for graphics
4. **Content:** Show the service result, not just equipment
5. **Lighting:** Use well-lit, professional photos
6. **Branding:** Consistent style across all services

### Before/After Pairs

1. **Consistency:** Use same angle and lighting for both shots
2. **Clear Transformation:** Choose images that show dramatic improvement
3. **Notes:** Add detailed transformation descriptions
4. **Quality:** Both images should be high resolution
5. **Timing:** Take "after" photo immediately upon completion
6. **Client Consent:** Always get permission before posting
7. **Categorization:** Let system auto-categorize as 'before_after'

---

## Performance Considerations

### Service Images

- **Compression:** All images compressed before upload (saves bandwidth)
- **CDN:** Supabase Storage uses CDN for fast delivery
- **Lazy Loading:** Images load on demand (future enhancement)
- **Caching:** Browser caches images for repeat visits

### Before/After Gallery

- **View Optimization:** Uses database view for efficient queries
- **Thumbnail Support:** Can use thumbnail_path for faster loading
- **Pagination Ready:** Structure supports pagination for large galleries
- **Indexed Queries:** Database indexes on pairing columns

---

## Security

### Service Images

✅ **Upload Security:**
- Admin-only upload (RLS policy)
- File type validation (images only)
- File size limit (10MB max)
- Unique filename generation (prevents overwrites)

✅ **Access Security:**
- Public read access for website
- Admin-only write/delete
- CORS configured for Supabase

### Before/After Pairs

✅ **Data Security:**
- RLS policies on gallery_images
- Function-based pairing (validates data)
- Admin-only operations
- Referential integrity (foreign keys)

---

## Troubleshooting

### Service Image Issues

**Image won't upload:**
- Check file size (must be < 10MB)
- Verify file type (must be image/*)
- Check Supabase connection
- Verify admin permissions

**Image not displaying:**
- Check if image_url is saved
- Verify storage bucket policies
- Check browser console for errors
- Confirm public access enabled

**Compression too aggressive:**
- Edit ServiceImageUploader.tsx
- Change maxWidth/maxHeight (line 30)
- Change quality parameter (line 29)

### Before/After Issues

**Images not appearing in selection:**
- Check if images are already paired
- Verify is_published = true
- Check category filters
- Confirm images exist in database

**Pairing fails:**
- Check if both images are selected
- Verify images not already paired
- Check database function exists
- Review Supabase logs

**Unlink not working:**
- Confirm admin permissions
- Check RLS policies
- Verify function exists
- Review error messages

---

## Future Enhancements

### Possible Additions

1. **Service Images:**
   - Multiple images per service (gallery)
   - Image cropping tool
   - Filters and adjustments
   - AI-generated alt text

2. **Before/After:**
   - Slider comparison view
   - Video before/after
   - Timeline transformations (multiple stages)
   - Auto-pairing suggestions (AI matching)
   - Public gallery with filtering
   - Social media sharing

3. **General:**
   - Bulk image operations
   - Image analytics (views, engagement)
   - Watermarking
   - Image optimization pipeline

---

## Summary

### What Was Added

✅ **Service Image Management:**
- Upload component with compression
- Form integration
- Card display
- Storage management

✅ **Before/After Gallery:**
- Pairing system
- Visual selection interface
- Transformation notes
- Database-driven architecture

✅ **Database:**
- New columns for pairing
- Helper functions
- Optimized view
- Storage bucket

✅ **UI/UX:**
- 4-tab gallery structure
- Responsive design
- Professional displays
- Error handling

### Files Created/Modified

**New Files (6):**
1. ServiceImageUploader.tsx (200 lines)
2. BeforeAfterManager.tsx (473 lines)
3. useBeforeAfterPairs.ts (146 lines)
4. 20260110000002_enhance_images.sql (migration)
5. ADMIN_IMAGE_MANAGEMENT.md (this file)

**Modified Files (3):**
1. ServiceForm.tsx - Added image uploader
2. ServicesManager.tsx - Display images on cards
3. GalleryManager.tsx - Added 4th tab

**Total:** 9 files, ~1,200 lines of code

---

## Quick Start

1. **Apply Migration:**
   ```bash
   # Copy SQL from migration file
   # Run in Supabase SQL Editor
   ```

2. **Add Service Images:**
   - Go to Admin → Services
   - Edit any service
   - Upload an image
   - Save service

3. **Create Before/After Pair:**
   - Go to Admin → Gallery → Before/After
   - Click "Create Pair"
   - Select before image
   - Select after image
   - Add notes
   - Create pair

4. **View Results:**
   - Service cards show hero images
   - Before/After gallery shows transformations
   - Public website can display both

---

*Image Management System Enhanced - January 10, 2026*
