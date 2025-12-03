import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';
import CustomTabBar from '../components/CustomTabBar';
import { getUserData } from '../services/userSync';
import { supabase } from '../services/supabase';

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Contact: undefined;
  Profile: undefined;
  EditProfile: undefined;
  EditVideo: { video: any };
  Onboarding: undefined;
  RoleSelection: undefined;
  Research: undefined;
  Instructors: undefined;
};

export type AuthStackParamList = {
  AuthChoice: undefined;
  SignIn: undefined;
  SignUp: undefined;
  AdminSignIn: undefined;
};

export type StudentTabParamList = {
  Home: undefined;
  Classes: undefined;
  Program: undefined;
  Community: undefined;
  Resources: undefined;
};

export type AdminTabParamList = {
  Home: undefined;
  Upload: undefined;
  Videos: undefined;
  Community: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;

// Screens
import HomeScreen from '../screens/HomeScreen';
import ClassesScreen from '../screens/ClassesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ContactScreen from '../screens/ContactScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthChoiceScreen from '../screens/AuthChoiceScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AdminSignInScreen from '../screens/AdminSignInScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import AdminVideoUploadScreen from '../screens/AdminVideoUploadScreen';
import AdminVideosScreen from '../screens/AdminVideosScreen';
import EditVideoScreen from '../screens/EditVideoScreen';
import ResearchScreen from '../screens/ResearchScreen';
import InstructorsScreen from '../screens/InstructorsScreen';
import ProgramScreen from '../screens/ProgramScreen';
import ResourcesScreen from '../screens/ResourcesScreen';

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const StudentTab = createBottomTabNavigator<StudentTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();

const StudentTabNavigator = () => {
  return (
    <StudentTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <StudentTab.Screen name="Home" component={HomeScreen} />
      <StudentTab.Screen name="Classes" component={ClassesScreen} />
      <StudentTab.Screen name="Program" component={ProgramScreen} />
      <StudentTab.Screen name="Community" component={CommunityScreen} />
      <StudentTab.Screen name="Resources" component={ResourcesScreen} />
    </StudentTab.Navigator>
  );
};

const AdminTabNavigator = () => {
  return (
    <AdminTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <AdminTab.Screen name="Home" component={HomeScreen} />
      <AdminTab.Screen name="Upload" component={AdminVideoUploadScreen} />
      <AdminTab.Screen name="Videos" component={AdminVideosScreen} />
      <AdminTab.Screen name="Community" component={CommunityScreen} />
    </AdminTab.Navigator>
  );
};

const AuthNavigator = ({ onAdminSignIn }: { onAdminSignIn: (role: 'ADMIN') => void }) => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AuthChoice">
      <AuthStack.Screen name="AuthChoice" component={AuthChoiceScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="AdminSignIn">
        {(props) => <AdminSignInScreen {...props} onSignIn={onAdminSignIn} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
};

const MainAppNavigator = () => {
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, [user]);

  const checkUserRole = async () => {
    if (!user?.id) {
      setIsCheckingRole(false);
      return;
    }

    try {
      // Check if user exists in Supabase and has a role
      const userData = await getUserData(user.id);
      if (userData?.role && userData.role !== 'STUDENT' && userData.role !== 'ADMIN') {
        // Convert lowercase roles to uppercase for consistency
        const normalizedRole = userData.role.toUpperCase() as 'STUDENT' | 'ADMIN';
        setUserRole(normalizedRole);
        await AsyncStorage.setItem('userRole', normalizedRole);
      } else if (userData?.role) {
        // User exists with proper role
        setUserRole(userData.role);
        await AsyncStorage.setItem('userRole', userData.role);
      } else {
        // User doesn't exist in Supabase or doesn't have a role
        console.log('User needs role selection');
        // Clear any cached role to force role selection
        await AsyncStorage.removeItem('userRole');
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      // If there's an error, clear cache and let them go through role selection
      await AsyncStorage.removeItem('userRole');
      setUserRole(null);
    } finally {
      setIsCheckingRole(false);
    }
  };

  const handleRoleSelected = async (role: 'STUDENT' | 'ADMIN') => {
    if (!user) {
      console.error('No user found when setting role');
      return;
    }

    try {
      // Import syncUserWithRole here to avoid circular imports
      const { syncUserWithRole } = await import('../services/userSync');

      // Sync the role to Supabase and AsyncStorage
      await syncUserWithRole(user, role);
      setUserRole(role);

      // Clear any cached role data to force refresh
      await AsyncStorage.setItem('userRole', role);
    } catch (error) {
      console.error('Error saving user role:', error);
      // Still set the role in state even if sync fails
      setUserRole(role);
      // Save to AsyncStorage as fallback
      try {
        await AsyncStorage.setItem('userRole', role);
      } catch (storageError) {
        console.error('Error saving to AsyncStorage:', storageError);
      }
    }
  };

  if (isCheckingRole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userRole ? (
        <Stack.Screen name="RoleSelection">
          {(props) => (
            <RoleSelectionScreen
              {...props}
              onRoleSelected={handleRoleSelected}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={userRole === 'ADMIN' ? AdminTabNavigator : StudentTabNavigator}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="EditVideo" component={EditVideoScreen} />
          <Stack.Screen name="Research" component={ResearchScreen} />
          <Stack.Screen name="Instructors" component={InstructorsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function AppNavigator() {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState<'ADMIN' | null>(null);
  const [checkingAdminAuth, setCheckingAdminAuth] = useState(true);
  const [authKey, setAuthKey] = useState(0); // Force re-render on auth change

  useEffect(() => {
    checkAdminAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        setAdminAuthenticated(false);
        setAdminRole(null);
        setAuthKey(prev => prev + 1);
      } else if (event === 'SIGNED_IN' && session) {
        await checkAdminAuth();
        setAuthKey(prev => prev + 1);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminAuth = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      const adminUserId = await AsyncStorage.getItem('adminUserId');
      
      if (role === 'ADMIN' && adminUserId) {
        // Verify admin session with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user.id === adminUserId) {
          // Double-check user role in database
          const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', adminUserId)
            .single();
          
          if (!error && userData && (userData.role === 'ADMIN' || userData.role === 'admin')) {
            setAdminAuthenticated(true);
            setAdminRole('ADMIN');
            return;
          }
        }
        
        // Clear invalid session
        await AsyncStorage.removeItem('userRole');
        await AsyncStorage.removeItem('adminUserId');
        await AsyncStorage.removeItem('adminEmail');
        setAdminAuthenticated(false);
        setAdminRole(null);
      }
    } catch (error) {
      console.error('Error checking admin auth:', error);
      setAdminAuthenticated(false);
      setAdminRole(null);
    } finally {
      setCheckingAdminAuth(false);
    }
  };

  const handleAdminSignIn = async (role: 'ADMIN') => {
    console.log('Admin signed in successfully');
    setAdminRole(role);
    setAdminAuthenticated(true);
    setAuthKey(prev => prev + 1); // Force navigation update
  };

  const handleAdminSignOut = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('adminUserId');
    await AsyncStorage.removeItem('adminEmail');
    setAdminAuthenticated(false);
    setAdminRole(null);
    setAuthKey(prev => prev + 1); // Force navigation update
  };

  if (checkingAdminAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  // Admin is authenticated - show admin navigator
  if (adminAuthenticated && adminRole === 'ADMIN') {
    return (
      <NavigationContainer key={`admin-${authKey}`}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={AdminTabNavigator} />
          <Stack.Screen name="Profile">
            {(props) => <ProfileScreen {...props} onSignOut={handleAdminSignOut} />}
          </Stack.Screen>
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="EditVideo" component={EditVideoScreen} />
          <Stack.Screen name="Research" component={ResearchScreen} />
          <Stack.Screen name="Instructors" component={InstructorsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Student authentication with Clerk
  return (
    <NavigationContainer key={`student-${authKey}`}>
      <SignedIn>
        <MainAppNavigator />
      </SignedIn>
      <SignedOut>
        <AuthNavigator onAdminSignIn={handleAdminSignIn} />
      </SignedOut>
    </NavigationContainer>
  );
}