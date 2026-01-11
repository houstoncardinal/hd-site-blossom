# 🚀 Admin Dashboard - Quick Start Guide

## 1. Grant Admin Access

Run this SQL in your Supabase SQL Editor:

```sql
-- Grant admin role to your user
INSERT INTO public.user_roles (user_id, role)
VALUES ('5066a2d5-25fb-4b4a-a2a9-3e873edec1ec', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify it worked
SELECT * FROM public.user_roles WHERE user_id = '5066a2d5-25fb-4b4a-a2a9-3e873edec1ec';
```

## 2. Set Up OpenAI for AI Tagging (Optional)

1. Go to Supabase Dashboard → Project Settings → Edge Functions
2. Add secret: `OPENAI_API_KEY` with your OpenAI API key
3. Deploy the edge function:

```bash
npx supabase functions deploy process-gallery-image
```

## 3. Access the Dashboard

### Development Mode (Current):
- Navigate to: `http://localhost:5173/admin`
- DEV_BYPASS is currently enabled, so no login required

### Production Mode:
1. Set `DEV_BYPASS = false` in `/src/components/admin/ProtectedRoute.tsx`
2. Login at `/auth` with your admin account
3. Access dashboard at `/admin`

## 4. Tab-by-Tab Features

### 📊 Overview
- **Instant Stats**: Today's appointments, revenue, ratings, team count
- **Trends**: Monthly growth indicators
- **Recent Activity**: Latest appointments and reviews
- **Alerts**: Pending items requiring attention
- **Quick Actions**: Jump to any section

### 📅 Appointments
- **View All**: Filter by status (Pending/Confirmed/Completed)
- **Search**: Find by client name, email, phone
- **Update Status**: Confirm or complete bookings
- **Export**: Download appointment data

### ⭐ Reviews
- **Moderate**: Approve or reject reviews
- **Feature**: Mark best reviews as featured
- **Filter**: View by approval status
- **Respond**: Reply to client feedback (if enabled)

### 👥 Team
- **Add Members**: Create artist profiles
- **Upload Photos**: Professional headshots
- **Set Specialties**: Assign expertise areas
- **Manage Status**: Active/inactive toggles
- **Reorder**: Drag-and-drop display order

### 🖼️ Gallery (3 Tabs)
- **Images**: Upload, organize, tag photos
  - Drag & drop multi-upload
  - Auto compression
  - Bulk operations
  - Metadata editing

- **Collections**: Group images by theme
  - Create collections
  - Set cover images
  - Manage visibility

- **AI Tagging**: Auto-tag with AI
  - Batch process images
  - Generate descriptions
  - View confidence scores

### ✨ Services
- **Add Services**: Create service catalog
- **Set Pricing**: Base price and duration
- **Categorize**: Group by type
- **Deposits**: Set deposit percentages

### 📦 Packages
- **Bundle Services**: Create combo packages
- **Auto-Calculate**: Savings shown automatically
- **Set Pricing**: Special bundle pricing
- **Select Services**: Multi-service selection

### 💰 Pricing (4 Tabs)
- **Tiers**: Bronze/Silver/Gold/Platinum pricing
- **Add-Ons**: Extra services marketplace
- **Rules**: Dynamic pricing (day/time based)
- **Discounts**: Promo codes and deals

### 📈 Analytics
- **Revenue Charts**: Track income over time
- **Booking Trends**: Popular services
- **Client Stats**: Demographics
- **Growth**: Month/year comparisons

### 🏢 Business
- **Info**: Contact details, hours
- **Settings**: Booking preferences
- **Policies**: Cancellation, terms
- **Social**: Social media links

### 🔔 Notifications
- **Feed**: All system notifications
- **Mark Read**: Manage read status
- **Filters**: By notification type

### ⚙️ Settings
- **Notifications**: Email, SMS preferences
- **Security**: 2FA, password, sessions
- **Appearance**: Dark mode, compact view
- **Business**: Export data, manage hours

## 5. Common Tasks

### Upload Images to Gallery:
1. Go to **Gallery** tab
2. Click **Upload Images**
3. Drag & drop or select files
4. Choose category
5. Add tags (optional)
6. Upload!

### Add AI Tags to Images:
1. Go to **Gallery** → **AI Tagging** tab
2. Select category (or All)
3. Choose "Unprocessed Only" or "All Images"
4. Click **Start Processing**
5. Watch real-time progress
6. Review generated tags

### Create a Service Package:
1. Go to **Packages** tab
2. Click **Create Package**
3. Enter name and description
4. Select services to bundle
5. Set package price (lower than total)
6. See automatic savings calculation
7. Click **Create**

### Approve a Review:
1. Go to **Reviews** tab
2. Filter by "Pending"
3. Read the review
4. Click **Approve** or **Reject**
5. Optionally mark as **Featured**

### Update Appointment Status:
1. Go to **Appointments** tab
2. Find the appointment
3. Click status dropdown
4. Select new status (Confirmed/Completed)
5. Status updates automatically

## 6. Keyboard Shortcuts (Ready)

Coming soon:
- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + ,` - Settings
- `Ctrl/Cmd + N` - New item (context aware)
- `Esc` - Close dialogs

## 7. Tips & Best Practices

### Image Management:
- ✅ Upload high-quality originals (auto-compressed)
- ✅ Use descriptive filenames
- ✅ Categorize properly
- ✅ Add alt text for SEO
- ✅ Use AI tagging for efficiency

### Service Pricing:
- ✅ Set base prices competitively
- ✅ Use tiers for upselling
- ✅ Create packages for bundles
- ✅ Add popular add-ons

### Review Management:
- ✅ Approve authentic reviews quickly
- ✅ Feature best testimonials
- ✅ Respond to negative feedback
- ✅ Monitor average rating

### Appointments:
- ✅ Confirm bookings promptly
- ✅ Mark completed after service
- ✅ Track no-shows
- ✅ Export for accounting

## 8. Mobile Access

The admin dashboard is fully responsive:
- **Phone**: Single column, mobile menu
- **Tablet**: Two columns, touch optimized
- **Desktop**: Full layout, all features

## 9. Performance

Your admin dashboard is optimized for:
- ⚡ Fast page loads
- ⚡ Smooth animations
- ⚡ Instant feedback
- ⚡ Optimistic updates
- ⚡ Cached data

## 10. Support & Troubleshooting

### Dashboard not loading?
- Check DEV_BYPASS setting
- Verify user has admin role
- Check browser console for errors

### Can't upload images?
- Verify Supabase Storage is configured
- Check storage bucket policies
- Ensure file size < 10MB

### AI tagging not working?
- Verify OPENAI_API_KEY is set
- Check Edge Function is deployed
- Review function logs in Supabase

### Data not updating?
- Hard refresh (Ctrl+Shift+R)
- Check network tab for errors
- Verify RLS policies

## 11. Production Deployment

Before going live:

1. **Security**:
   ```typescript
   // In ProtectedRoute.tsx
   const DEV_BYPASS = false; // ← Set to false
   ```

2. **Environment**:
   - Set all production environment variables
   - Add OPENAI_API_KEY to Supabase
   - Configure email templates

3. **Database**:
   - Run all migrations
   - Grant admin access
   - Test all CRUD operations

4. **Testing**:
   - Test on mobile devices
   - Verify all features work
   - Check image uploads
   - Test AI tagging

## 🎉 You're Ready!

Your enterprise admin dashboard is fully functional and ready to manage your entire beauty business.

**Need Help?**
- Read ADMIN_FEATURES.md for complete feature list
- Check database migrations in /supabase/migrations
- Review component code in /src/components/admin

**Enjoy your world-class admin system! 🚀**
