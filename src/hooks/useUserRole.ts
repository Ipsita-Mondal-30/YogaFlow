import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { getUserData } from '../services/userSync';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export const useUserRole = () => {
  const { user } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userData = await getUserData(user.id);
        if (userData && (userData as any).role) {
          setUserRole((userData as any).role as UserRole);
        } else {
          // Default to STUDENT if no user data found
          setUserRole('STUDENT');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError('Failed to fetch user role');
        // Default to STUDENT on error
        setUserRole('STUDENT');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { userRole, loading, error };
};