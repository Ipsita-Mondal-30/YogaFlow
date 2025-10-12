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
    
    // All users are now treated as regular users (no role distinction)
    const userRole: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT';
    
    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: fullName,
      avatarUrl: clerkUser.imageUrl || undefined,
      role: userRole,
      // Initialize default user settings
      subscriptionPlan: 'free',
      totalClassesJoined: 0,
    };

    // Check if user already exists
    const existingUser = await DatabaseService.getUserByClerkId(clerkUser.id);
    
    if (existingUser) {
      // User already exists, no update method available in current DatabaseService
      console.log('User already exists in Prisma:', clerkUser.id);
    } else {
      // Create new user
      await DatabaseService.createUser(userData);
      console.log('User created in Prisma:', clerkUser.id);
    }
  } catch (error) {
    console.error('Error syncing user with Prisma:', error);
    throw new Error('Failed to sync user with Prisma');
  }
}
/**
 * Sync user data with Supabase
 * Upserts user metadata for Supabase Storage access and other features
 */
export async function syncUserWithSupabase(clerkUser: ClerkUser): Promise<void> {
  try {
    // All users are treated as regular users
    const userRole = 'student';

    const userData = {
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
      avatar_url: clerkUser.imageUrl || null,
      role: userRole,
      updated_at: new Date().toISOString(),
    };

    // Upsert user in Supabase users table
    const { error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'clerk_id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Supabase sync error:', error);
      throw error;
    }

    console.log('User synced with Supabase:', clerkUser.id);
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
 * Sync user data with a specific role
 * This function is called after role selection
 */
export async function syncUserWithRole(clerkUser: ClerkUser, role: 'STUDENT' | 'ADMIN'): Promise<void> {
  try {
    const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';
    
    // Update Supabase with selected role
    const userData = {
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: clerkUser.fullName || fullName,
      avatar_url: clerkUser.imageUrl || null,
      role: role.toLowerCase(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'clerk_id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Supabase role sync error:', error);
      throw error;
    }

    // Store role in AsyncStorage for quick access
    await AsyncStorage.setItem('userRole', role);
    
    console.log('User role synchronized:', clerkUser.id, role);
  } catch (error) {
    console.error('Error syncing user role:', error);
    throw error;
  }
}

/**
 * Get user data from Supabase by Clerk ID
 */
export async function getUserData(clerkId: string) {
  try {
    // Fetch from Supabase since Prisma is using mock implementation
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) {
      console.error('Error fetching user data from Supabase:', error);
      return null;
    }

    // Convert Supabase data format to match expected format
    if (data) {
      return {
        id: data.id,
        clerkId: data.clerk_id,
        name: data.name || 'User',
        email: data.email,
        avatarUrl: data.avatar_url,
        role: data.role ? data.role.toUpperCase() as 'STUDENT' | 'TEACHER' | 'ADMIN' : 'STUDENT', // Convert to uppercase to match enum
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    return null;
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