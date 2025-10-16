// Environment configuration with fallbacks for production
export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  clerk: {
    publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  },
  cloudinary: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '',
    uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  },
};

// Validation function
export const validateEnvironment = () => {
  const errors: string[] = [];

  if (!config.supabase.url) {
    errors.push('EXPO_PUBLIC_SUPABASE_URL is missing');
  }
  if (!config.supabase.anonKey) {
    errors.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing');
  }
  if (!config.clerk.publishableKey) {
    errors.push('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is missing');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Development mode check
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;