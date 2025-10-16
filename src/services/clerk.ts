import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage for web
        return localStorage.getItem(key);
      }
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage for web
        localStorage.setItem(key, value);
        return;
      }
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('Error saving token:', err);
      return;
    }
  },
};

// Production-ready Clerk configuration
export const clerkConfig = {
  tokenCache,
  // Add any additional Clerk configuration here
  publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
};

export { ClerkProvider, useAuth, useUser };