-- ============================================================================
-- ADMIN USER SYNC FUNCTION
-- ============================================================================
-- This function syncs admin users from Supabase Auth to the users table
-- Run this AFTER creating admin accounts in Supabase Authentication > Users
-- ============================================================================

-- Create the sync function
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
    -- Find the auth user by email
    SELECT id, email INTO auth_user
    FROM auth.users
    WHERE auth.users.email = admin_emails[i];
    
    IF auth_user.id IS NOT NULL THEN
      -- Insert or update in users table
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
      RETURN QUERY SELECT admin_emails[i], NULL::uuid, 'Auth user not found - create in Auth first'::text;
    END IF;
  END LOOP;
END;
$$;

-- ============================================================================
-- RUN THE SYNC
-- ============================================================================
-- This will sync all admin users from Auth to the users table
SELECT * FROM sync_admin_users();

-- ============================================================================
-- VERIFY ADMIN USERS
-- ============================================================================
-- Check that all admins are properly set up
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  au.email as auth_email,
  au.confirmed_at,
  u.created_at
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.role = 'ADMIN'
ORDER BY u.email;

-- ============================================================================
-- EXPECTED OUTPUT
-- ============================================================================
-- You should see 4 rows with:
-- - Matching IDs between users and auth.users
-- - role = 'ADMIN'
-- - confirmed_at should not be null
-- - All 4 admin emails listed
-- ============================================================================
