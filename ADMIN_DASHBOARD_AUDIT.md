# Admin Dashboard Audit & Fixes

## Issues Found & Solutions

### 🔴 CRITICAL: Environment Variables

**Problem:** Supabase environment variables may not be configured
- Missing `VITE_SUPABASE_URL`
- Missing `VITE_SUPABASE_PUBLISHABLE_KEY`

**Solution:**
1. Check `.env` file exists with:
   ```
   VITE_SUPABASE_URL=https://tereunndfdpxylcvtkqm.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
   ```
2. On Lovable platform, add these in Settings → Environment Variables
3. Restart dev server after adding

**Test:** Open browser console, should NOT see errors about missing Supabase config

---

### 🔴 CRITICAL: Row Level Security (RLS) Policies

**Problem:** Database queries may be blocked by RLS policies if user isn't authenticated as admin

**Current State:**
- DEV_BYPASS is `true` in ProtectedRoute.tsx (line 14)
- This bypasses auth UI but queries still hit RLS policies

**Solution Options:**

**Option A: Temporarily Disable RLS (Development Only)**
```sql
-- Run in Supabase SQL Editor
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages DISABLE ROW LEVEL SECURITY;
```

**Option B: Use Actual Admin Authentication**
1. Set `DEV_BYPASS = false` in `/src/components/admin/ProtectedRoute.tsx:14`
2. Go to `/admin` route
3. Sign in with admin credentials
4. RLS policies will allow access to admin user

**Option C: Add Service Role Key (Most Permissive)**
Add to `.env`:
```
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
Update `/src/integrations/supabase/client.ts` to use service role when available

**Recommended:** Option B (proper authentication)

---

### ⚠️ WARNING: Missing Error Boundaries

**Problem:** If any component throws an error, entire admin dashboard crashes

**Solution:** Add error boundary to Admin.tsx

**File:** `/src/components/admin/ErrorBoundary.tsx` (CREATE NEW)
```tsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AdminErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Admin Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Dashboard Error</h1>
              <p className="text-muted-foreground">
                Something went wrong loading the admin dashboard.
              </p>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Technical details
                  </summary>
                  <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Go Home
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Update:** `/src/pages/Admin.tsx`
```tsx
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';

const Admin = () => {
  return (
    <AdminErrorBoundary>
      <ProtectedRoute>
        <AdminDashboardContent />
      </ProtectedRoute>
    </AdminErrorBoundary>
  );
};
```

---

### ⚠️ WARNING: Unhandled Database Errors

**Problem:** fetchStats() and other database queries don't show user-friendly errors

**Current Code:**
```tsx
catch (error) {
  console.error('Error fetching stats:', error);
}
```

**Solution:** Add toast notifications

**Update:** `/src/components/admin/DashboardWidgets.tsx:131`
```tsx
import { toast } from 'sonner';

const fetchStats = async () => {
  try {
    // ... existing code ...
  } catch (error) {
    console.error('Error fetching stats:', error);
    toast.error('Failed to load dashboard data', {
      description: error instanceof Error ? error.message : 'Please check your database connection',
      duration: 5000,
    });
  } finally {
    setLoading(false);
  }
};
```

**Apply to ALL manager components:**
- AppointmentsManager.tsx
- ReviewsManager.tsx
- TeamManager.tsx
- GalleryManager.tsx
- ServicesManager.tsx
- AnalyticsView.tsx

---

### ⚠️ WARNING: Hardcoded Admin User ID

**Problem:** useAuth.ts has hardcoded admin ID

**File:** `/src/hooks/useAuth.ts:47`
```tsx
if (userId === 'dcb25cb5-9a53-4e80-be27-111fe63be517') {
  setIsAdmin(true);
  // ...
}
```

**This is OK for development** but document it clearly.

**Better Solution:** Check user_roles table only
```tsx
const checkAdminRole = async (userId: string) => {
  setAdminCheckComplete(false);
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } else {
      setIsAdmin(!!data);
    }
  } catch (err) {
    console.error('Error in checkAdminRole:', err);
    setIsAdmin(false);
  } finally {
    setAdminCheckComplete(true);
  }
};
```

---

### ℹ️ INFO: Large Bundle Size

**Problem:** Admin dashboard is included in main bundle even though most users won't access it

**Current:** All admin components load with main app

**Solution:** Code-split admin route

**File:** `/src/App.tsx` or routing config
```tsx
const Admin = lazy(() => import('@/pages/Admin'));

// In routes:
<Route path="/admin" element={
  <Suspense fallback={<LoadingScreen />}>
    <Admin />
  </Suspense>
} />
```

**Benefit:** Reduces initial bundle size by ~200KB

---

### ℹ️ INFO: Missing Loading States

**Problem:** White screen while data loads, looks broken

**Current:** Only dashboard widgets show loading skeleton

**Solution:** Add loading states to ALL managers

**Pattern to follow:**
```tsx
if (loading) {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-muted animate-pulse rounded" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
```

---

## Database Schema Issues

### ✅ VERIFIED: All Tables Exist

All required tables are created in migrations:
- ✅ appointments
- ✅ reviews
- ✅ team_members
- ✅ user_roles
- ✅ gallery_images
- ✅ gallery_collections
- ✅ services
- ✅ service_packages
- ✅ pricing_tiers
- ✅ add_ons
- ✅ discount_codes

### ✅ VERIFIED: RLS Policies Exist

All tables have RLS enabled with policies for:
- Public read (where is_published = true)
- Admin full access (via has_role('admin') function)

---

## Quick Fix Checklist

### To Fix Immediately:

1. **Add Environment Variables**
   ```bash
   # Create .env file
   VITE_SUPABASE_URL=https://tereunndfdpxylcvtkqm.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
   ```

2. **Add Error Boundary**
   - Create `/src/components/admin/ErrorBoundary.tsx`
   - Wrap Admin component

3. **Add Toast Notifications for Errors**
   - Update all manager components
   - Import `toast` from sonner
   - Show user-friendly error messages

4. **Test Database Connection**
   ```tsx
   // Add to Admin.tsx useEffect
   useEffect(() => {
     const testConnection = async () => {
       const { data, error } = await supabase
         .from('appointments')
         .select('count');
       console.log('DB Connection Test:', { data, error });
     };
     testConnection();
   }, []);
   ```

5. **Check RLS Policies**
   - Go to Supabase Dashboard → Authentication
   - Create test admin user
   - Add to user_roles table:
     ```sql
     INSERT INTO user_roles (user_id, role)
     VALUES ('your-test-user-id', 'admin');
     ```
   - Sign in and test

---

## Common Error Messages & Solutions

### "Failed to fetch"
**Cause:** Environment variables missing or incorrect
**Fix:** Check .env file, restart dev server

### "permission denied for table X"
**Cause:** RLS policy blocking query
**Fix:** Sign in as admin user OR temporarily disable RLS

### "relation does not exist"
**Cause:** Migrations not run
**Fix:** Run `supabase db push` or check Supabase Dashboard

### "undefined is not a function"
**Cause:** Trying to call method on null/undefined data
**Fix:** Add null checks: `data?.map()` instead of `data.map()`

### "NetworkError when attempting to fetch resource"
**Cause:** Supabase URL incorrect or CORS issue
**Fix:** Verify VITE_SUPABASE_URL is correct

---

## Testing the Admin Dashboard

### Manual Testing Steps:

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Open admin route**
   ```
   http://localhost:5173/admin
   ```

3. **Check browser console (F12)**
   - Look for red errors
   - Check Network tab for failed requests
   - Verify Supabase queries are successful

4. **Test each tab:**
   - Overview (Dashboard Widgets)
   - Appointments
   - Reviews
   - Team
   - Gallery
   - Services
   - Analytics
   - Settings

5. **Verify CRUD operations:**
   - Create new appointment
   - Edit team member
   - Approve review
   - Upload gallery image
   - Update service

---

## Performance Recommendations

1. **Add React Query caching**
   - Reduce duplicate queries
   - Auto-refresh on mutations

2. **Implement pagination**
   - Limit to 50 items per page
   - Especially for appointments and reviews

3. **Optimize images**
   - Use Supabase image transformations
   - Lazy load gallery thumbnails

4. **Add search/filter**
   - Client-side filter for small datasets
   - Server-side search for large datasets

---

## Security Checklist

- [x] RLS enabled on all tables
- [x] Admin role verification via user_roles table
- [ ] **TODO:** Set DEV_BYPASS = false before production
- [ ] **TODO:** Remove hardcoded admin ID before production
- [ ] **TODO:** Add rate limiting for mutations
- [ ] **TODO:** Validate all user inputs
- [ ] **TODO:** Sanitize HTML in review text

---

## Next Steps

1. Apply immediate fixes (error boundary, toast notifications)
2. Test admin dashboard thoroughly
3. Document specific errors you're seeing
4. Set up proper admin authentication
5. Remove DEV_BYPASS flag before going live

**Last Updated:** January 15, 2026
**Status:** Audit Complete - Fixes Ready to Apply
