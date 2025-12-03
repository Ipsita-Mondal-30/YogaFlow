/**
 * Script to create 4 admin users in Supabase
 * 
 * Usage:
 * 1. Install dependencies: npm install @supabase/supabase-js
 * 2. Set environment variables or update the config below
 * 3. Run: node scripts/create-admins.js
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration - Update these with your Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

// Admin users to create
const ADMIN_USERS = [
  {
    email: 'yogaadmin1@yogaflow.com',
    password: 'YogaAdmin@123',
    name: 'Yoga Admin 1',
    username: 'yogaadmin1'
  },
  {
    email: 'yogaadmin2@yogaflow.com',
    password: 'YogaAdmin@456',
    name: 'Yoga Admin 2',
    username: 'yogaadmin2'
  },
  {
    email: 'yogaadmin3@yogaflow.com',
    password: 'YogaAdmin@789',
    name: 'Yoga Admin 3',
    username: 'yogaadmin3'
  },
  {
    email: 'yogaadmin4@yogaflow.com',
    password: 'YogaAdmin@012',
    name: 'Yoga Admin 4',
    username: 'yogaadmin4'
  }
];

async function createAdminUsers() {
  // Initialize Supabase client with service role key
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('🚀 Starting admin user creation...\n');

  for (const admin of ADMIN_USERS) {
    try {
      console.log(`Creating admin: ${admin.email}`);

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: {
          name: admin.name,
          role: 'ADMIN'
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  User ${admin.email} already exists in auth`);
          
          // Try to get existing user
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find(u => u.email === admin.email);
          
          if (existingUser) {
            // Update users table
            await updateUserTable(supabase, existingUser.id, admin);
          }
        } else {
          throw authError;
        }
      } else if (authData.user) {
        console.log(`✅ Created auth user: ${authData.user.id}`);
        
        // Add user to users table
        await updateUserTable(supabase, authData.user.id, admin);
      }

      console.log(`✅ Successfully set up admin: ${admin.email}\n`);

    } catch (error) {
      console.error(`❌ Error creating admin ${admin.email}:`, error.message);
      console.error(error);
    }
  }

  console.log('🎉 Admin user creation complete!');
  console.log('\n📋 Admin Credentials:');
  ADMIN_USERS.forEach((admin, index) => {
    console.log(`\nAdmin ${index + 1}:`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: ${admin.password}`);
  });
}

async function updateUserTable(supabase, userId, admin) {
  const { error: dbError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      clerk_id: admin.username,
      name: admin.name,
      email: admin.email,
      role: 'ADMIN',
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });

  if (dbError) {
    console.error(`⚠️  Error updating users table:`, dbError.message);
  } else {
    console.log(`✅ Added to users table with role ADMIN`);
  }
}

// Run the script
if (require.main === module) {
  createAdminUsers()
    .then(() => {
      console.log('\n✨ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { createAdminUsers };
