-- Admin Users Setup Script for Yoga Flow
-- This script creates 4 admin accounts with predefined credentials

-- Note: You need to run this in your Supabase SQL Editor
-- These admins will be able to sign in via the AdminSignInScreen

-- First, create the admin users in Supabase Auth
-- You'll need to do this via Supabase Dashboard > Authentication > Users
-- Or use the Supabase Admin API

-- Admin 1: yogaadmin1
-- Email: yogaadmin1@yogaflow.com
-- Password: YogaAdmin@123

-- Admin 2: yogaadmin2
-- Email: yogaadmin2@yogaflow.com
-- Password: YogaAdmin@456

-- Admin 3: yogaadmin3
-- Email: yogaadmin3@yogaflow.com
-- Password: YogaAdmin@789

-- Admin 4: yogaadmin4
-- Email: yogaadmin4@yogaflow.com
-- Password: YogaAdmin@012

-- After creating users in Supabase Auth, insert them into the users table
-- Replace the UUIDs below with the actual user IDs from Supabase Auth

-- Example insert (you'll need to replace 'USER_ID_FROM_AUTH' with actual IDs):
/*
INSERT INTO users (id, clerk_id, name, email, role, created_at, updated_at)
VALUES 
  ('USER_ID_1', 'admin1', 'Yoga Admin 1', 'yogaadmin1@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('USER_ID_2', 'admin2', 'Yoga Admin 2', 'yogaadmin2@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('USER_ID_3', 'admin3', 'Yoga Admin 3', 'yogaadmin3@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('USER_ID_4', 'admin4', 'Yoga Admin 4', 'yogaadmin4@yogaflow.com', 'ADMIN', NOW(), NOW());
*/

-- Alternative: If you want to create users programmatically, use this function
-- This requires admin privileges

CREATE OR REPLACE FUNCTION create_admin_users()
RETURNS void
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
  i INTEGER;
BEGIN
  FOR i IN 1..4 LOOP
    -- Check if user already exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = admin_emails[i]) THEN
      -- Insert into users table
      -- Note: You still need to create the auth user separately
      INSERT INTO users (clerk_id, name, email, role, created_at, updated_at)
      VALUES (
        'admin' || i,
        admin_names[i],
        admin_emails[i],
        'ADMIN',
        NOW(),
        NOW()
      );
      
      RAISE NOTICE 'Created admin user: %', admin_emails[i];
    ELSE
      RAISE NOTICE 'Admin user already exists: %', admin_emails[i];
    END IF;
  END LOOP;
END;
$$;

-- Run the function to create admin users in the users table
-- SELECT create_admin_users();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users TO authenticated;
