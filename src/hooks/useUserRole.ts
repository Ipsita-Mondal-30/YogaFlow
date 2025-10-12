import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../services/userSync';

export type UserRole = 'STUDENT' | 'ADMIN' | null;

export interface UseUserRoleReturn {
  userRole: UserRole;
  isLoading: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  refreshRole: () => Promise<void>;
  setRole: (role: UserRole) => Promise<void>;
}

/**
 * Custom hook to manage user role state and authorization
 */
export function useUserRole(): UseUserRoleReturn {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadUserRole();
    } else if (isLoaded && !user) {
      setUserRole(null);
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  const loadUserRole = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // First, try to get role from AsyncStorage
      let cachedRole: string | null = null;
      try {
        cachedRole = await AsyncStorage.getItem('userRole');
        if (cachedRole && (cachedRole === 'STUDENT' || cachedRole === 'ADMIN')) {
          setUserRole(cachedRole as UserRole);
        }
      } catch (storageError) {
        console.warn('AsyncStorage error:', storageError);
      }

      // Then, fetch from database with timeout and better error handling
      const userId = user.id;
      if (!userId) {
        console.warn('User ID is null, cannot load user role');
        return;
      }
      
      try {
        // Add timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database request timeout')), 10000)
        );
        
        const userData = await Promise.race([
          getUserData(userId),
          timeoutPromise
        ]) as any;
        
        if (userData?.role) {
          const dbRole = userData.role as UserRole;
          setUserRole(dbRole);
          
          // Update cache if different
          if (cachedRole !== dbRole) {
            try {
              if (dbRole) await AsyncStorage.setItem('userRole', dbRole);
            } catch (cacheError) {
              console.warn('Cache update error:', cacheError);
            }
          }
        }
      } catch (dbError) {
        console.warn('Database fetch error, using cached role:', dbError);
        // If database fails, keep using cached role if available
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      // Don't set a default role - let the user go through role selection
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRole = async () => {
    await loadUserRole();
  };

  const setRole = async (role: UserRole) => {
    try {
      setUserRole(role);
      
      // Add timeout and better error handling for AsyncStorage operations
      const storageOperation = role 
        ? AsyncStorage.setItem('userRole', role)
        : AsyncStorage.removeItem('userRole');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AsyncStorage timeout')), 5000)
      );
      
      await Promise.race([storageOperation, timeoutPromise]);
    } catch (error) {
      console.error('Error setting user role:', error);
      // Don't throw error to prevent crashes, just log it
    }
  };

  return {
    userRole,
    isLoading,
    isStudent: userRole === 'STUDENT',
    isAdmin: userRole === 'ADMIN',
    refreshRole,
    setRole,
  };
}

/**
 * Hook for role-based conditional rendering
 */
export function useRoleAccess(allowedRoles: UserRole[]) {
  const { userRole, isLoading } = useUserRole();
  
  return {
    hasAccess: !isLoading && allowedRoles.includes(userRole),
    isLoading,
    userRole,
  };
}

/**
 * Utility functions for role checking
 */
export const RoleUtils = {
  isStudent: (role: UserRole): boolean => role === 'STUDENT',
  isAdmin: (role: UserRole): boolean => role === 'ADMIN',
  hasRole: (role: UserRole, allowedRoles: UserRole[]): boolean => 
    allowedRoles.includes(role),
  canUploadVideos: (role: UserRole): boolean => role === 'ADMIN',
  canManageContent: (role: UserRole): boolean => role === 'ADMIN',
  canAccessStudentFeatures: (role: UserRole): boolean => 
    role === 'STUDENT' || role === 'ADMIN',
};