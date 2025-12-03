# Admin Video Upload Fix

## Problem
Admin users were unable to upload videos even after successfully signing in. The upload screen was showing "Access Denied" or not allowing video uploads.

## Root Cause
The `AdminVideoUploadScreen` was using the `useUserRole()` hook, which relies on Clerk's `useUser()` hook. Since admin users are authenticated through Supabase (not Clerk), the hook couldn't detect their admin status, resulting in access denial.

## Solution

### 1. Updated AdminVideoUploadScreen.tsx
Changed from using `useUserRole()` hook to directly checking AsyncStorage for admin status:

**Before:**
```typescript
const { user } = useUser();
const { isAdmin, isLoading: roleLoading } = useUserRole();
```

**After:**
```typescript
const [isAdmin, setIsAdmin] = useState(false);
const [adminUserId, setAdminUserId] = useState<string | null>(null);
const [roleLoading, setRoleLoading] = useState(true);

useEffect(() => {
  checkAdminStatus();
}, []);

const checkAdminStatus = async () => {
  const role = await AsyncStorage.getItem('userRole');
  const userId = await AsyncStorage.getItem('adminUserId');
  
  if (role === 'ADMIN' && userId) {
    setIsAdmin(true);
    setAdminUserId(userId);
  }
};
```

### 2. Updated useUserRole.ts Hook
Enhanced the hook to check for admin users authenticated via Supabase before checking Clerk users:

**Added:**
```typescript
const checkAdminUser = async () => {
  const role = await AsyncStorage.getItem('userRole');
  const adminUserId = await AsyncStorage.getItem('adminUserId');
  
  if (role === 'ADMIN' && adminUserId) {
    setUserRole('ADMIN');
    setIsLoading(false);
    return true;
  }
  return false;
};
```

This ensures the hook works for both:
- Admin users (Supabase auth)
- Student users (Clerk auth)

## How It Works Now

### Admin Video Upload Flow

1. **Admin Signs In**
   - Authenticates via Supabase
   - Stores in AsyncStorage:
     - `userRole`: 'ADMIN'
     - `adminUserId`: (UUID)
     - `adminEmail`: (email)

2. **Admin Navigates to Upload Tab**
   - AdminVideoUploadScreen loads
   - Checks AsyncStorage for admin credentials
   - If valid, shows upload interface
   - If invalid, shows access denied

3. **Admin Selects Video**
   - Can pick video file from device
   - Can optionally add thumbnail
   - Video preview shows in the UI

4. **Admin Fills Video Details**
   - Title (required)
   - Description (required)
   - Category (optional)
   - Duration (optional)
   - Difficulty level (Beginner/Intermediate/Advanced)
   - Tags (comma-separated)

5. **Admin Saves Video**
   - Video data saved with `adminUserId` as uploader
   - Saved to local storage via `videoStorage` service
   - Success message shown
   - Options to upload another or view videos

## Testing Checklist

- [x] Admin can access Upload tab
- [x] Upload screen loads without "Access Denied"
- [x] Can select video file
- [x] Can select thumbnail image
- [x] Can fill in video details
- [x] Can save video successfully
- [x] Video appears in Videos tab after saving
- [x] Can upload multiple videos
- [x] Student users cannot access upload screen

## Files Modified

1. **src/screens/AdminVideoUploadScreen.tsx**
   - Removed dependency on `useUserRole()` hook
   - Added direct AsyncStorage check for admin status
   - Uses `adminUserId` instead of Clerk `user.id`

2. **src/hooks/useUserRole.ts**
   - Added `checkAdminUser()` function
   - Checks AsyncStorage before checking Clerk
   - Supports both admin and student authentication

## Related Issues Fixed

This fix also resolves:
- Admin users seeing "Access Denied" on upload screen
- `useUserRole()` hook not detecting admin users
- Video upload failing due to missing user ID
- Navigation showing wrong tabs for admin users

## Important Notes

- Admin authentication uses **Supabase** (not Clerk)
- Student authentication uses **Clerk** (not Supabase)
- Both systems store role in AsyncStorage for quick access
- The `useUserRole()` hook now supports both authentication methods
- Video uploads are currently stored locally (not in cloud storage)

## Next Steps

If you want to add cloud storage for videos:
1. Set up Cloudinary or AWS S3
2. Update `videoStorage.ts` service
3. Add upload progress tracking
4. Add video compression/optimization
5. Add thumbnail auto-generation

## Troubleshooting

### "Access Denied" on Upload Screen
- Verify admin is signed in: Check AsyncStorage for `userRole` = 'ADMIN'
- Verify admin user ID exists: Check AsyncStorage for `adminUserId`
- Try signing out and signing in again

### Video Upload Fails
- Check console logs for errors
- Verify video file format is supported
- Check device storage permissions
- Ensure video file size is reasonable

### Video Doesn't Appear After Upload
- Check Videos tab
- Verify video was saved: Check console logs
- Try refreshing the Videos screen
- Check `videoStorage` service for errors

## Success Criteria

✅ Admin can sign in successfully
✅ Admin can access Upload tab
✅ Admin can select and preview videos
✅ Admin can fill in video details
✅ Admin can save videos
✅ Videos appear in Videos tab
✅ Multiple uploads work correctly
✅ Student users cannot access upload

---

**Last Updated:** December 3, 2025
