/**
 * Admin User Setup Script
 * 
 * This script helps you set up admin users in Supabase.
 * 
 * IMPORTANT: You need to create the admin users in Supabase Auth first!
 * 
 * Steps:
 * 1. Go to your Supabase Dashboard > Authentication > Users
 * 2. Click "Add User" and create each admin with email/password:
 *    - yogaadmin1@yogaflow.com / YogaAdmin@123
 *    - yogaadmin2@yogaflow.com / YogaAdmin@456
 *    - yogaadmin3@yogaflow.com / YogaAdmin@789
 *    - yogaadmin4@yogaflow.com / YogaAdmin@012
 * 
 * 3. After creating each user, copy their UUID from the dashboard
 * 4. Run this SQL in Supabase SQL Editor to add them to the users table:
 */

const adminSetupSQL = `
-- Insert admin users into the users table
-- Replace the UUIDs with the actual user IDs from Supabase Auth

-- First, let's check if the users table exists and has the right structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Insert admin users (replace 'REPLACE_WITH_UUID_FROM_AUTH' with actual UUIDs)
INSERT INTO users (id, clerk_id, name, email, role, created_at, updated_at)
VALUES 
  ('REPLACE_WITH_UUID_1', 'admin1', 'Yoga Admin 1', 'yogaadmin1@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('REPLACE_WITH_UUID_2', 'admin2', 'Yoga Admin 2', 'yogaadmin2@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('REPLACE_WITH_UUID_3', 'admin3', 'Yoga Admin 3', 'yogaadmin3@yogaflow.com', 'ADMIN', NOW(), NOW()),
  ('REPLACE_WITH_UUID_4', 'admin4', 'Yoga Admin 4', 'yogaadmin4@yogaflow.com', 'ADMIN', NOW(), NOW())
ON CONFLICT (id) DO UPDATE 
SET role = 'ADMIN', updated_at = NOW();

-- Verify the admin users were created
SELECT id, email, role FROM users WHERE role = 'ADMIN';
`;

console.log('='.repeat(80));
console.log('ADMIN USER SETUP INSTRUCTIONS');
console.log('='.repeat(80));
console.log('\nStep 1: Create Admin Users in Supabase Auth');
console.log('-'.repeat(80));
console.log('Go to: Supabase Dashboard > Authentication > Users > Add User\n');
console.log('Create these 4 admin accounts:\n');
console.log('1. Email: yogaadmin1@yogaflow.com');
console.log('   Password: YogaAdmin@123\n');
console.log('2. Email: yogaadmin2@yogaflow.com');
console.log('   Password: YogaAdmin@456\n');
console.log('3. Email: yogaadmin3@yogaflow.com');
console.log('   Password: YogaAdmin@789\n');
console.log('4. Email: yogaadmin4@yogaflow.com');
console.log('   Password: YogaAdmin@012\n');

console.log('\nStep 2: Copy User IDs');
console.log('-'.repeat(80));
console.log('After creating each user, copy their UUID from the Supabase dashboard.\n');

console.log('\nStep 3: Run SQL in Supabase');
console.log('-'.repeat(80));
console.log('Go to: Supabase Dashboard > SQL Editor > New Query\n');
console.log('Copy and paste this SQL (replace UUIDs with actual values):\n');
console.log(adminSetupSQL);

console.log('\n' + '='.repeat(80));
console.log('ALTERNATIVE: Quick Setup Function');
console.log('='.repeat(80));
console.log('\nIf you want to automate this, run this SQL function:\n');

const quickSetupSQL = `
-- This function will sync auth users to the users table
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

-- Run the sync function
SELECT * FROM sync_admin_users();
`;

console.log(quickSetupSQL);
console.log('\n' + '='.repeat(80));
console.log('After setup, test login with any admin account in the app!');
console.log('='.repeat(80));
