# Quick Admin Setup Guide

## 🚀 5-Minute Setup

Follow these steps to get admin authentication working:

---

## Step 1: Open Supabase Dashboard
Go to your Supabase project dashboard at https://supabase.com

---

## Step 2: Create Admin Users in Auth

1. Click **Authentication** in the left sidebar
2. Click **Users** tab
3. Click **Add User** button (or **Invite User**)
4. Create each admin account:

   **Admin 1:**
   - Email: `yogaadmin1@yogaflow.com`
   - Password: `YogaAdmin@123`
   - ✅ Check "Auto Confirm User"
   - Click **Create User**

   **Admin 2:**
   - Email: `yogaadmin2@yogaflow.com`
   - Password: `YogaAdmin@456`
   - ✅ Check "Auto Confirm User"
   - Click **Create User**

   **Admin 3:**
   - Email: `yogaadmin3@yogaflow.com`
   - Password: `YogaAdmin@789`
   - ✅ Check "Auto Confirm User"
   - Click **Create User**

   **Admin 4:**
   - Email: `yogaadmin4@yogaflow.com`
   - Password: `YogaAdmin@012`
   - ✅ Check "Auto Confirm User"
   - Click **Create User**

---

## Step 3: Sync to Database

1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this SQL:

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

SELECT * FROM sync_admin_users();
```

4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. You should see output showing "Synced successfully" for each admin

---

## Step 4: Verify Setup

Run this query to confirm:

```sql
SELECT id, email, role FROM users WHERE role = 'ADMIN';
```

You should see 4 rows with all admin emails.

---

## Step 5: Test in App

1. Open the Yoga Flow app
2. On the auth choice screen, tap **"Admin Sign In"**
3. Enter credentials:
   - Email: `yogaadmin1@yogaflow.com`
   - Password: `YogaAdmin@123`
4. Tap **"Sign In as Admin"**

**Expected Result:**
- ✅ Sign in succeeds
- ✅ You see admin navigation (Home, Upload, Videos, Community)
- ✅ Profile shows admin badge
- ✅ You can upload and manage videos

---

## ✅ Done!

Your admin authentication is now set up and working!

---

## 🆘 Having Issues?

### "Invalid login credentials"
- Double-check the password (case-sensitive)
- Make sure user was created in Step 2
- Try resetting password in Supabase dashboard

### "Access Denied"
- Make sure you ran the SQL in Step 3
- Verify role is 'ADMIN' in database (Step 4)
- Check that user IDs match between auth and users table

### Still stuck?
See `ADMIN_AUTH_TROUBLESHOOTING.md` for detailed help.

---

## 📝 Admin Credentials Reference

| Email | Password |
|-------|----------|
| yogaadmin1@yogaflow.com | YogaAdmin@123 |
| yogaadmin2@yogaflow.com | YogaAdmin@456 |
| yogaadmin3@yogaflow.com | YogaAdmin@789 |
| yogaadmin4@yogaflow.com | YogaAdmin@012 |

⚠️ **Remember:** Change these passwords for production use!
