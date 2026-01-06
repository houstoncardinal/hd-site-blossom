# ⚡ QUICK START GUIDE
**Get Your Website Live in 60 Minutes**

---

## ✅ STEP 1: Update Business Info (20 min)

Open: **`src/config/business.ts`**

Update these sections:

### 📞 Phone & Email
```typescript
phone: {
  display: '(YOUR) PHONE-NUMBER',
  raw: '+1YOURNUMBER',
  whatsapp: '1YOURNUMBER',
},
email: {
  primary: 'your@email.com',
  info: 'info@yourdomain.com',
  bookings: 'bookings@yourdomain.com',
},
```

### 📍 Address
```typescript
address: {
  street: 'Your Street Address',
  city: 'Your City',
  state: 'ST',
  zip: '12345',
},
```

### 🌍 GPS Coordinates
1. Go to: https://www.google.com/maps
2. Find your location
3. Right-click → Click coordinates to copy
4. Update:
```typescript
geo: {
  latitude: YOUR_LAT,
  longitude: YOUR_LONG,
},
```

### 📱 Social Media
```typescript
social: {
  instagram: {
    url: 'https://www.instagram.com/YOUR_HANDLE',
    enabled: true,
  },
  facebook: {
    url: 'https://www.facebook.com/YOUR_PAGE',
    enabled: true,
  },
  // Set enabled: false if you don't use a platform
},
```

---

## ✅ STEP 2: Add Analytics (5 min)

Still in `src/config/business.ts`:

### Google Analytics
1. Get ID from: https://analytics.google.com
2. Update:
```typescript
googleAnalytics: {
  measurementId: 'G-XXXXXXXXXX', // Your real ID
  enabled: true, // Change to true
},
```

### Meta Pixel (Optional)
```typescript
metaPixel: {
  pixelId: '1234567890', // Your pixel ID
  enabled: true, // Change to true
},
```

---

## ✅ STEP 3: Test (15 min)

```bash
npm run dev
```

Visit: http://localhost:8083

**Check**:
- [ ] Your phone/email/address shows (not placeholders)
- [ ] Social links work
- [ ] Megamenu appears (hover "Services")
- [ ] Booking form works
- [ ] Cookie banner appears
- [ ] Mobile menu works

---

## ✅ STEP 4: Build & Deploy (20 min)

```bash
npm run build
```

### Deploy to Vercel:
```bash
npm i -g vercel  # If needed
vercel
```

Follow prompts → Done!

Or use Netlify/other hosting.

---

## ✅ STEP 5: Post-Launch (Ongoing)

### Immediately:
- Submit sitemap to Google Search Console
- Create Google Business Profile
- Update social media bios with website link

### This Week:
- Monitor analytics
- Test booking flow
- Announce launch!

---

## 📚 Need More Help?

- **Detailed Setup**: Read `SETUP_INSTRUCTIONS.md`
- **Pre-Launch Checklist**: Read `LAUNCH_AUDIT.md`
- **What Was Built**: Read `COMPLETION_SUMMARY.md`

---

## 🚀 YOU'RE READY TO LAUNCH!

**Total Time**: ~60 minutes
**Result**: Enterprise-level website live!

Good luck! 🎉
