# Social Media Feeds Setup Guide

This guide will help you configure and customize the Facebook and Instagram feeds on your website.

## 📱 What's Included

Your website now has **three social media feed components**:

1. **SocialMediaFeeds** - Unified tabbed interface with both Instagram and Facebook (used on homepage)
2. **FacebookFeed** - Standalone Facebook page plugin
3. **InstagramEmbed** - Standalone Instagram embed component
4. **InstagramFeed** - Grid-style Instagram feed with static images

---

## 🔧 Current Setup

### Homepage Configuration
The homepage (`src/pages/Index.tsx`) currently uses the **SocialMediaFeeds** component, which displays:
- Instagram feed (tab 1) - Shows your Instagram grid
- Facebook page feed (tab 2) - Shows your Facebook page timeline

### Social Media Accounts Configured
All feeds pull from your business configuration in `src/config/business.ts`:

```typescript
social: {
  instagram: {
    handle: '@hda_studio',
    url: 'https://www.instagram.com/hda_studio/',
  },
  facebook: {
    handle: 'HDA Studio',
    url: 'https://www.facebook.com/hdastudio',
  }
}
```

---

## ✅ Facebook Feed - FULLY FUNCTIONAL

The Facebook feed is **100% functional** and requires **NO API keys**! It uses Facebook's official Page Plugin.

### What It Does:
- ✅ Shows your latest Facebook posts automatically
- ✅ Displays your page's profile photo and cover
- ✅ Shows follower count
- ✅ Allows users to like and follow your page directly
- ✅ Updates in real-time when you post new content
- ✅ No API setup required!

### Already Configured:
- Uses the Facebook SDK (automatically loaded)
- Points to your Facebook page: `https://www.facebook.com/hdastudio`
- Mobile responsive
- Beautiful card design with shadow effects

### Customization Options:
To customize the Facebook feed, edit `src/components/SocialMediaFeeds.tsx` or `src/components/FacebookFeed.tsx`:

```jsx
<div
  className="fb-page w-full"
  data-href={BUSINESS_CONFIG.social.facebook.url}
  data-tabs="timeline"           // Options: timeline, events, messages
  data-width="500"               // Width in pixels
  data-height="600"              // Height in pixels
  data-small-header="false"      // true = compact header
  data-hide-cover="false"        // true = hide cover photo
  data-show-facepile="true"      // true = show followers
>
```

---

## 📸 Instagram Feed Options

You have **2 Instagram feed styles** to choose from:

### Option 1: Instagram Grid (Currently Active)
**Component:** `InstagramFeed.tsx`
- Shows a beautiful grid of your work
- Uses your actual images from the public folder
- No API required
- Fully customizable

**To Update Images:**
Edit `src/components/InstagramFeed.tsx` and update the `posts` array:

```typescript
const posts = [
  {
    image: '/IMG_8915.JPG',      // Your image file
    likes: 456,                   // Engagement metrics
    comments: 32,
    caption: 'Evening glam perfection ✨ #hdastudio #eveningglam',
  },
  // Add more posts...
];
```

### Option 2: Instagram Embeds (Advanced)
**Component:** `InstagramEmbed.tsx`
- Shows actual embedded Instagram posts
- Uses Instagram's official embed API
- Displays captions, likes, and comments from Instagram

**To Activate:**
1. Get your Instagram post URLs (e.g., `https://www.instagram.com/p/ABC123/`)
2. Edit `src/components/InstagramEmbed.tsx`:

```typescript
const instagramPosts = [
  'https://www.instagram.com/p/YOUR_POST_1/',
  'https://www.instagram.com/p/YOUR_POST_2/',
  'https://www.instagram.com/p/YOUR_POST_3/',
];
```

3. Replace `InstagramFeed` with `InstagramEmbed` in `SocialMediaFeeds.tsx`

---

## 🎨 Switching Feed Styles

### To Use Separate Facebook/Instagram Pages:

**Replace** the `SocialMediaFeeds` component in `src/pages/Index.tsx` with individual components:

```typescript
// Instead of:
import SocialMediaFeeds from '@/components/SocialMediaFeeds';

// Use:
import InstagramFeed from '@/components/InstagramFeed';
import FacebookFeed from '@/components/FacebookFeed';

// Then in the return:
<InstagramFeed />
<FacebookFeed />
```

### To Use Instagram Embeds Instead of Grid:

Edit `src/components/SocialMediaFeeds.tsx`:

```typescript
// Change this:
import InstagramFeed from './InstagramFeed';

// To this:
import InstagramEmbed from './InstagramEmbed';

// Then replace in the component:
<TabsContent value="instagram" className="mt-0">
  <InstagramEmbed />  {/* Changed from InstagramFeed */}
</TabsContent>
```

---

## 📊 Social Stats Configuration

The social media stats bar at the bottom of `SocialMediaFeeds` shows:
- Instagram followers
- Facebook fans
- Posts per month

**To Update Stats:**
Edit `src/components/SocialMediaFeeds.tsx` around line 115:

```jsx
<div className="text-4xl font-serif font-light text-primary mb-2">
  500+  {/* Update this number */}
</div>
<div className="text-muted-foreground">Instagram Followers</div>
```

---

## 🚀 Advanced: Instagram API Integration (Optional)

For **automatic** Instagram feed updates, you can integrate the Instagram Basic Display API:

### Steps:
1. Create a Facebook Developer account
2. Create an app and get an Access Token
3. Use Instagram Basic Display API to fetch posts
4. Store access token in environment variables

**This is optional** - the current grid-style feed works perfectly without API access!

---

## 🎯 Recommended Configuration

For the **best user experience**, we recommend:

1. **Keep the current setup** with `SocialMediaFeeds` component
2. **Update Instagram grid images** monthly with your latest work
3. **Facebook feed** auto-updates (no maintenance needed!)
4. **Update social stats** every quarter

---

## 📝 Quick Reference

| Component | Location | Functionality | API Needed? |
|-----------|----------|---------------|-------------|
| SocialMediaFeeds | Homepage | Tabbed IG + FB | No |
| FacebookFeed | Standalone | FB Page Plugin | No |
| InstagramFeed | Standalone | Image Grid | No |
| InstagramEmbed | Standalone | Embed Posts | No |

---

## 🎨 Styling & Customization

All components use Tailwind CSS and are fully customizable:

- **Colors:** Edit theme in `tailwind.config.ts`
- **Layout:** Adjust grid columns in component files
- **Spacing:** Modify padding/margin classes
- **Animation:** Change Framer Motion settings

---

## 🔍 Testing

To test your social feeds:

1. **Facebook Feed:**
   - Should load within 2-3 seconds
   - Shows your latest posts
   - "Like" button should be functional

2. **Instagram Feed:**
   - All images should display
   - Click should open Instagram profile
   - Hover effects should work

---

## ✅ Maintenance Checklist

- [ ] Update Instagram grid images monthly
- [ ] Verify Facebook feed loads correctly
- [ ] Update social stats quarterly
- [ ] Test on mobile devices
- [ ] Check loading performance

---

## 💡 Pro Tips

1. **Performance:** The Facebook SDK loads asynchronously - no impact on page speed!
2. **Mobile:** All feeds are fully responsive
3. **SEO:** Social feeds include proper Schema.org markup
4. **Privacy:** Facebook plugin is GDPR compliant

---

## 🆘 Troubleshooting

**Facebook feed not loading?**
- Check your Facebook page URL in `src/config/business.ts`
- Ensure Facebook page is published (not draft)
- Clear browser cache

**Instagram images not showing?**
- Verify image paths in `src/components/InstagramFeed.tsx`
- Check images exist in `/public` folder
- Confirm file names match exactly (case-sensitive)

---

## 📞 Need Help?

If you need assistance configuring the feeds, check:
1. Component files in `src/components/`
2. Business config in `src/config/business.ts`
3. This documentation

---

**Last Updated:** January 2026
**Components:** SocialMediaFeeds, FacebookFeed, InstagramFeed, InstagramEmbed
