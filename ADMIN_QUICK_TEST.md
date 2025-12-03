# Admin Quick Test Guide

## Test Admin Authentication & Video Upload

Follow these steps to verify everything is working:

---

## 1. Sign In as Admin

1. Open the Yoga Flow app
2. Tap **"Admin Sign In"**
3. Enter credentials:
   - Email: `yogaadmin1@yogaflow.com`
   - Password: `YogaAdmin@123`
4. Tap **"Sign In as Admin"**

**Expected Result:**
✅ Sign in succeeds
✅ Bottom navigation shows: Home | Upload | Videos | Community
✅ No "Access Denied" errors

---

## 2. Test Upload Tab Access

1. Tap the **"Upload"** tab in bottom navigation
2. Screen should load without errors

**Expected Result:**
✅ Upload screen loads
✅ Shows "Upload Video" title
✅ Shows "Video File" section
✅ Shows "Select Video File" button
✅ No "Access Denied" message

---

## 3. Upload a Test Video

1. Tap **"Select Video File"**
2. Choose any video from your device
3. Video preview should appear
4. Fill in the form:
   - **Title:** "Test Yoga Session"
   - **Description:** "This is a test video upload"
   - **Category:** "Beginner Yoga"
   - **Duration:** "15 minutes"
   - **Difficulty:** Tap "Beginner"
   - **Tags:** "yoga, beginner, test"
5. Optionally tap **"Select Thumbnail"** to add a thumbnail image
6. Tap **"Save Video"**

**Expected Result:**
✅ Video file selected successfully
✅ Video preview shows
✅ All form fields work
✅ Save button is enabled
✅ "Video Saved!" alert appears
✅ Options to upload another or view videos

---

## 4. Verify Video in Videos Tab

1. From the success alert, tap **"View Videos"** (or navigate to Videos tab)
2. Your uploaded video should appear in the list

**Expected Result:**
✅ Videos tab loads
✅ Test video appears in the list
✅ Shows title, description, and thumbnail
✅ Can tap to view video details

---

## 5. Test Profile

1. Tap the profile button (top-right corner)
2. Profile screen should show admin info

**Expected Result:**
✅ Shows admin email (yogaadmin1@yogaflow.com)
✅ Shows admin badge with shield icon
✅ "Sign Out" button is visible

---

## 6. Test Sign Out

1. In Profile screen, tap **"Sign Out"**
2. Confirm sign out

**Expected Result:**
✅ Returns to Auth Choice screen
✅ Can sign in again
✅ No errors or crashes

---

## Quick Troubleshooting

### Can't Sign In
- **Check:** Admin account exists in Supabase Auth
- **Check:** Admin synced to database (run `supabase-sync-admins.sql`)
- **Fix:** See `ADMIN_AUTH_TROUBLESHOOTING.md`

### "Access Denied" on Upload
- **Check:** Signed in as admin (not student)
- **Check:** AsyncStorage has `userRole` = 'ADMIN'
- **Fix:** Sign out and sign in again

### Can't Select Video
- **Check:** Device permissions for media access
- **Check:** Video file format is supported
- **Fix:** Grant permissions in device settings

### Video Doesn't Save
- **Check:** Title and description are filled
- **Check:** Console logs for errors
- **Fix:** See `ADMIN_VIDEO_UPLOAD_FIX.md`

---

## All Tests Passed? 🎉

If all steps work correctly, your admin authentication and video upload are fully functional!

---

## Additional Tests (Optional)

### Test Multiple Admins
- Sign out
- Sign in with `yogaadmin2@yogaflow.com` / `YogaAdmin@456`
- Verify upload works for this admin too

### Test Student Access
- Sign out from admin
- Sign in as student (use Clerk)
- Verify Upload tab is NOT visible
- Verify student sees: Home | Classes | Program | Community | Resources

### Test Navigation
- As admin, navigate between all tabs
- Verify no crashes or errors
- Verify profile button works from all tabs

---

**Quick Reference:**

| Test | Status |
|------|--------|
| Admin Sign In | ⬜ |
| Upload Tab Access | ⬜ |
| Video Selection | ⬜ |
| Video Upload | ⬜ |
| Video in List | ⬜ |
| Profile Display | ⬜ |
| Sign Out | ⬜ |

Check off each test as you complete it!
