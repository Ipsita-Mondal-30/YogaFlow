// Simple test script to verify environment setup
const fs = require('fs');
const path = require('path');

console.log('🧘‍♀️ Yoga Flow - Setup Verification\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} configured`);
    } else {
      console.log(`❌ ${varName} missing`);
    }
  });
} else {
  console.log('❌ .env file not found');
  console.log('   Please copy .env.example to .env and add your keys');
}

// Check if key directories exist
const directories = [
  'src/screens',
  'src/services',
  'src/navigation',
  'src/components',
  'src/utils',
  'src/assets'
];

console.log('\n📁 Directory Structure:');
directories.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir}`);
  }
});

// Check if key files exist
const keyFiles = [
  'src/navigation/AppNavigator.tsx',
  'src/services/supabase.ts',
  'src/services/clerk.ts',
  'src/screens/HomeScreen.tsx',
  'src/screens/OnboardingScreen.tsx',
  'supabase-schema.sql',
  'README.md'
];

console.log('\n📄 Key Files:');
keyFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
  }
});

console.log('\n🚀 Next Steps:');
console.log('1. Add your API keys to .env file');
console.log('2. Run the SQL script in Supabase');
console.log('3. Start the app with: npm start');
console.log('4. Scan QR code with Expo Go app');

console.log('\n🙏 Namaste! Your Yoga Flow app is ready to begin the journey.');