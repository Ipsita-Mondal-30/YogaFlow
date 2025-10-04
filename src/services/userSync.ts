import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatabaseService } from './database';
import { supabase } from './supabase';

// Type for Clerk user data
type ClerkUser = NonNullable<ReturnType<typeof useUser>['user']>;

export interface UserSyncData {
  clerkId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  // Teacher-specific fields
  bio?: string;
  specialization?: string;
  certifications?: string[];
  experience?: number;
  hourlyRate?: number;
  // Student-specific fields
  subscriptionPlan?: string;
  subscriptionEnd?: Date;
  totalClassesJoined?: number;
}

/**
 * Sync user data with Prisma database
 * Creates or updates user record in our local/backend database
 */
export async function syncUserWithPrisma(clerkUser: ClerkUser): Promise<void> {
  try {
    const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';
    
    // Get role from AsyncStorage (set during signup)
    let userRole: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT';
    try {
      const pendingRole = await AsyncStorage.getItem('pendingUserRole');
      if (pendingRole === 'teacher') {
        userRole = 'TEACHER';
      } else if (pendingRole === 'student') {
        userRole = 'STUDENT';
      }
      // Clear the pending role after use
      await AsyncStorage.removeItem('pendingUserRole');
    } catch (asyncError) {
      console.log('No pending role found, defaulting to STUDENT');
    }

    const userData: UserSyncData = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: fullName,
      avatarUrl: clerkUser.imageUrl || undefined,
      role: userRole,
      // Initialize role-specific defaults
      ...(userRole === 'STUDENT' && {
        subscriptionPlan: 'free',
        totalClassesJoined: 0,
      }),
      ...(userRole === 'TEACHER' && {
        certifications: [],
        experience: 0,
      }),
    };

    // Check if user already exists
    const existingUser = await DatabaseService.getUserByClerkId(clerkUser.id);
    
    if (existingUser) {
      // User already exists, no update method available in current DatabaseService
      console.log('User already exists in Prisma:', clerkUser.id);
    } else {
      // Create new user
      await DatabaseService.createUser(userData);
      console.log(`User created in Prisma with role ${userRole}:`, clerkUser.id);
    }
  } catch (error) {
    console.error('Error syncing user with Prisma:', error);
    throw new Error('Failed to sync user with database');
  }
}

/**
 * Sync user data with Supabase
 * Upserts user metadata for Supabase Storage access and other features
 */
export async function syncUserWithSupabase(clerkUser: ClerkUser): Promise<void> {
  try {
    // Get role from AsyncStorage or default to student
    let userRole = 'student';
    try {
      const pendingRole = await AsyncStorage.getItem('pendingUserRole');
      if (pendingRole) {
        userRole = pendingRole;
      }
    } catch (asyncError) {
      console.log('No pending role found for Supabase sync, defaulting to student');
    }

    const userData = {
      id: clerkUser.id, // Use Clerk ID as primary key
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      first_name: clerkUser.firstName || null,
      last_name: clerkUser.lastName || null,
      profile_image_url: clerkUser.imageUrl || null,
      role: userRole,
      updated_at: new Date().toISOString(),
    };

    // Upsert user in Supabase users table
    const { error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Supabase sync error:', error);
      throw error;
    }

    console.log(`User synced with Supabase with role ${userRole}:`, clerkUser.id);
  } catch (error) {
    console.error('Error syncing user with Supabase:', error);
    throw new Error('Failed to sync user with Supabase');
  }
}

/**
 * Complete user synchronization with both Prisma and Supabase
 * This is the main function to call after successful Clerk authentication
 */
export async function syncUserData(clerkUser: ClerkUser): Promise<void> {
  try {
    // Sync with Prisma first (our primary database)
    await syncUserWithPrisma(clerkUser);
    
    // Then sync with Supabase (for metadata and storage access)
    await syncUserWithSupabase(clerkUser);
    
    console.log('User data fully synchronized:', clerkUser.id);
  } catch (error) {
    console.error('Error in complete user sync:', error);
    throw error;
  }
}

/**
 * Get user data from Prisma by Clerk ID
 */
export async function getUserData(clerkId: string) {
  try {
    return await DatabaseService.getUserByClerkId(clerkId);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Delete user data from both Prisma and Supabase
 * Use this when a user deletes their account
 */
export async function deleteUserData(clerkId: string): Promise<void> {
  try {
    // Note: DatabaseService doesn't have deleteUser method yet
    // This would need to be implemented in the DatabaseService
    console.log('Delete user functionality not implemented yet:', clerkId);
    
    // Delete from Supabase
    await supabase
      .from('users')
      .delete()
      .eq('id', clerkId);
    
    console.log('User data deleted from Supabase:', clerkId);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}