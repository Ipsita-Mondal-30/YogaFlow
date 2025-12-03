# Admin Setup Checklist

Use this checklist to ensure admin authentication is properly configured.

---

## 📋 Pre-Setup Checklist

- [ ] Supabase project is created and accessible
- [ ] `.env` file has correct Supabase credentials:
  - [ ] `EXPO_PUBLIC_SUPABASE_URL`
  - [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] App can connect to Supabase (test with student sign-up)
- [ ] `users` table exists in Supabase database

---

## 🔧 Setup Steps

### 1. Create Admin Users in Supabase Auth
- [ ] Opened Supabase Dashboard > Authentication > Users
- [ ] Created yogaadmin1@yogaflow.com with password YogaAdmin@123
- [ ] Created yogaadmin2@yogaflow.com with password YogaAdmin@456
- [ ] Created yogaadmin3@yogaflow.com with password YogaAdmin@789
- [ ] Created yogaadmin4@yogaflow.com with password YogaAdmin@012
- [ ] All users have "Auto Confirm User" checked
- [ ] All users show as "Confirmed" in the dashboard

### 2. Sync Admin Users to Database
- [ ] Opened Supabase Dashboard > SQL Editor
- [ ] Ran the SQL from `supabase-sync-admins.sql`
- [ ] Function executed without errors
- [ ] Output shows "Synced successfully" for all 4 admins

### 3. Verify Database Records
- [ ] Ran verification query: `SELECT id, email, role FROM users WHERE role = 'ADMIN';`
- [ ] Query returns 4 rows
- [ ] All emails match the admin accounts
- [ ] All roles are exactly 'ADMIN' (uppercase)
- [ ] User IDs match between auth.users and users tables

---

## ✅ Testing Checklist

### Basic Sign-In
- [ ] App shows "Auth Choice" screen on launch
- [ ] "Admin Sign In" button is visible and clickable
- [ ] Admin sign-in screen loads correctly
- [ ] Can enter email and password
- [ ] Password visibility toggle works

### Successful Sign-In (yogaadmin1@yogaflow.com)
- [ ] Sign-in succeeds without errors
- [ ] No "Access Denied" message
- [ ] Navigation changes to admin tabs
- [ ] Bottom tabs show: Home, Upload, Videos, Community
- [ ] No student tabs visible (Classes, Program, Resources)

### Profile Screen
- [ ] Profile button visible in top-right corner
- [ ] Tapping profile button opens ProfileScreen
- [ ] Profile shows admin email (yogaadmin1@yogaflow.com)
- [ ] Profile shows admin badge with shield icon
- [ ] "Edit Profile" option is available
- [ ] "Sign Out" button is visible

### Navigation
- [ ] Can navigate to Home tab
- [ ] Can navigate to Upload tab
- [ ] Can navigate to Videos tab
- [ ] Can navigate to Community tab
- [ ] Can open Profile from any tab
- [ ] Can return to tabs from Profile

### Sign-Out
- [ ] Tapping "Sign Out" shows confirmation dialog
- [ ] Confirming sign-out works without errors
- [ ] Returns to Auth Choice screen
- [ ] No admin data persists after sign-out
- [ ] Can sign in again after signing out

### Error Handling
- [ ] Wrong password shows "Invalid login credentials"
- [ ] Non-existent email shows appropriate error
- [ ] Empty fields show "Please enter email and password"
- [ ] Network errors are handled gracefully

### Multiple Admin Accounts
- [ ] Can sign in with yogaadmin1@yogaflow.com
- [ ] Can sign out and sign in with yogaadmin2@yogaflow.com
- [ ] Can sign out and sign in with yogaadmin3@yogaflow.com
- [ ] Can sign out and sign in with yogaadmin4@yogaflow.com
- [ ] Each account shows correct email in profile

---

## 🔍 Verification Queries

Run these in Supabase SQL Editor to verify setup:

### Check Auth Users
```sql
SELECT id, email, confirmed_at, created_at
FROM auth.users
WHERE email LIKE '%yogaadmin%'
ORDER BY email;
```
**Expected:** 4 rows, all confirmed

### Check Database Users
```sql
SELECT id, email, role, created_at
FROM users
WHERE role = 'ADMIN'
ORDER BY email;
```
**Expected:** 4 rows, all with role='ADMIN'

### Check ID Matching
```sql
SELECT 
  u.email,
  u.role,
  au.email as auth_email,
  CASE WHEN u.id = au.id THEN '✓ Match' ELSE '✗ Mismatch' END as id_status
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.role = 'ADMIN'
ORDER BY u.email;
```
**Expected:** All show '✓ Match'

---

## 🐛 Troubleshooting

If any checklist item fails, see:
- `QUICK_ADMIN_SETUP.md` - Quick setup guide
- `ADMIN_AUTH_TROUBLESHOOTING.md` - Detailed troubleshooting
- `ADMIN_CREDENTIALS.md` - Credentials reference

---

## 📱 App Console Checks

When testing, watch the console for these logs:

### Successful Sign-In
```
Admin signed in successfully
Auth state changed: SIGNED_IN
```

### Successful Sign-Out
```
Auth state changed: SIGNED_OUT
```

### Errors to Watch For
- "Error checking admin auth" - Database connection issue
- "Admin sign in error" - Auth or role verification failed
- "Error loading user role" - AsyncStorage issue

---

## ✨ Success Criteria

All items checked = Admin authentication is fully working! 🎉

If any items are unchecked:
1. Review the failed step
2. Check troubleshooting guide
3. Verify Supabase configuration
4. Check console logs for errors
5. Re-run setup steps if needed

---

## 📝 Notes

- Admin accounts use Supabase authentication
- Student accounts use Clerk authentication
- Both systems work independently
- Admin role must be exactly 'ADMIN' (uppercase)
- Passwords are case-sensitive
- For production, change all default passwords

---

## 🔒 Security Reminders

- [ ] Change default passwords before production
- [ ] Store credentials securely
- [ ] Never commit passwords to git
- [ ] Consider implementing 2FA
- [ ] Regularly audit admin access
- [ ] Monitor admin activity logs
- [ ] Rotate passwords periodically

---

**Last Updated:** December 3, 2025
