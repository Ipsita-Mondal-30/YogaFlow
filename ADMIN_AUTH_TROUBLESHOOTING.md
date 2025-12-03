# Admin Authentication Troubleshooting Guide

## Problem: "Access Denied" after Admin Sign In

If you're experiencing issues where admins can't sign in or get "Access Denied" errors, follow these steps:

---

## Step 1: Verify Admin Users Exist in Supabase Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Users**
3. Check if these admin accounts exist:
   - yogaadmin1@yogaflow.com
   - yogaadmin2@yogaflow.com
   - yogaadmin3@yogaflow.com
   - yogaadmin4@yogaflow.com

**If they don't exist:**
- Click "Add User" (or "Invite User")
- Create each admin with their email and password:
  - yogaadmin1@yogaflow.com / YogaAdmin@123
  - yogaadmin2@yogaflow.com / YogaAdmin@456
  - yogaadmin3@yogaflow.com / YogaAdmin@789
  - yogaadmin4@yogaflow.com / YogaAdmin@012
- Make sure "Auto Confirm User" is checked

---

## Step 2: Sync Admin Users to Database

After creating users in Supabase Auth, you need to add them to the `users` table.

### Option A: Automatic Sync (Recommended)

1. Go to **SQL Editor** in Supabase
2. Create and run this function:

```sql
CREATE OR REPLACE FUNCTION sync_admin_users()
RETURNS TABLE(email text, user_id uuid, status text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_emails TEXT[] := ARRAY[
    'yogaadmin1@yogaflow.com',
    'yogaadmin2@yogaflow.com',
    'yogaadmin3@yogaflow.com',
    'yogaadmin4@yogaflow.com'
  ];
  admin_names TEXT[] := ARRAY[
    'Yoga Admin 1',
    'Yoga Admin 2',
    'Yoga Admin 3',
    'Yoga Admin 4'
  ];
  auth_user RECORD;
  i INTEGER;
BEGIN
  FOR i IN 1..4 LOOP
    SELECT id, email INTO auth_user
    FROM auth.users
    WHERE auth.users.email = admin_emails[i];
    
    IF auth_user.id IS NOT NULL THEN
      INSERT INTO users (id, clerk_id, name, email, role, created_at, updated_at)
      VALUES (
        auth_user.id,
        'admin' || i,
        admin_names[i],
        admin_emails[i],
        'ADMIN',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE
      SET role = 'ADMIN', updated_at = NOW();
      
      RETURN QUERY SELECT admin_emails[i], auth_user.id, 'Synced successfully'::text;
    ELSE
      RETURN QUERY SELECT admin_emails[i], NULL::uuid, 'Auth user not found'::text;
    END IF;
  END LOOP;
END;
$$;

-- Run the sync
SELECT * FROM sync_admin_users();
```

3. Check the output - it should show "Synced successfully" for each admin

### Option B: Manual Insert

1. Go to **Authentication > Users** and copy each admin's UUID
2. Go to **SQL Editor** and run:

```sql
INSERT INTO users (id, clerk_id, name, email, role, created_at, updated_at)
VALUES 
  ('PASTE_UUID_1_HERE', 'admin1', 'Yoga Admin 1', 'yogaadmin1@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('PASTE_UUID_2_HERE', 'admin2', 'Yoga Admin 2', 'yogaadmin2@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('PASTE_UUID_3_HERE', 'admin3', 'Yoga Admin 3', 'yogaadmin3@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('PASTE_UUID_4_HERE', 'admin4', 'Yoga Admin 4', 'yogaadmin4@yogaflow.com', 'ADMIN', NOW(), NOW())
ON CONFLICT (id) DO UPDATE 
SET role = 'ADMIN', updated_at = NOW();
```

---

## Step 3: Verify Database Records

Run this query to confirm admins are in the database:

```sql
SELECT id, email, role, created_at 
FROM users 
WHERE role = 'ADMIN';
```

You should see all 4 admin accounts with role = 'ADMIN'.

---

## Step 4: Test Admin Login

1. Open the app
2. On the auth choice screen, select "Admin Sign In"
3. Try logging in with any admin account:
   - Email: yogaadmin1@yogaflow.com
   - Password: YogaAdmin@123

**What should happen:**
- Sign in should succeed
- You should see the admin navigation (Home, Upload, Videos, Community)
- Profile should show admin badge and email

---

## Common Issues and Solutions

### Issue: "Invalid login credentials"
**Cause:** Password is incorrect or user doesn't exist in Supabase Auth
**Solution:** 
- Verify the password is correct
- Check if user exists in Authentication > Users
- Try resetting the password in Supabase dashboard

### Issue: "Access Denied - You do not have admin privileges"
**Cause:** User exists in Auth but not in users table, or role is not 'ADMIN'
**Solution:**
- Run the sync function from Step 2
- Verify role in database: `SELECT role FROM users WHERE email = 'yogaadmin1@yogaflow.com';`
- Role should be exactly 'ADMIN' (uppercase)

### Issue: Sign in succeeds but shows student navigation
**Cause:** Role not properly stored in AsyncStorage or state not updating
**Solution:**
1. Clear app data/cache
2. Restart the app
3. Sign in again
4. Check AsyncStorage: The app should store:
   - userRole: 'ADMIN'
   - adminUserId: (the UUID)
   - adminEmail: (the email)

### Issue: Can't sign out properly
**Cause:** Auth state listener not working
**Solution:**
- The latest code includes proper auth state management
- Sign out should now work correctly and return to auth screen

---

## Debugging Tips

### Check Auth Session
In your app, you can check the current session:

```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Current session:', session);
```

### Check AsyncStorage
```javascript
const role = await AsyncStorage.getItem('userRole');
const adminId = await AsyncStorage.getItem('adminUserId');
console.log('Stored role:', role);
console.log('Stored admin ID:', adminId);
```

### Check Database Role
```sql
SELECT u.id, u.email, u.role, au.email as auth_email
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email LIKE '%yogaadmin%';
```

---

## What Changed in the Fix

1. **Added auth state listener** - App now listens for Supabase auth changes
2. **Improved role verification** - Double-checks role in database during sign-in
3. **Better state management** - Uses authKey to force navigation updates
4. **Proper sign-out handling** - Clears all admin data and updates UI immediately
5. **Admin badge in profile** - Shows admin status clearly in profile screen

---

## Testing Checklist

- [ ] Admin can sign in with correct credentials
- [ ] Admin sees correct navigation (Home, Upload, Videos, Community)
- [ ] Profile shows admin badge and email
- [ ] Admin can navigate between tabs
- [ ] Admin can sign out successfully
- [ ] After sign out, returns to auth choice screen
- [ ] Can sign in again after signing out
- [ ] Invalid credentials show proper error message
- [ ] Non-admin accounts are rejected with "Access Denied"

---

## Need More Help?

If you're still experiencing issues:

1. Check the browser/app console for error messages
2. Verify your Supabase connection in `.env`:
   - EXPO_PUBLIC_SUPABASE_URL
   - EXPO_PUBLIC_SUPABASE_ANON_KEY
3. Make sure you're using the correct Supabase project
4. Try creating a fresh admin account with a different email to test

---

## Quick Setup Script

Run this to see setup instructions:
```bash
node scripts/setup-admin-users.js
```
