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

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Contact: undefined;
  EditProfile: undefined;
  AdminVideoUpload: undefined;
  EditVideo: { video: any };
  Onboarding: undefined;
  RoleSelection: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type StudentTabParamList = {
  Home: undefined;
  Classes: undefined;
  Chats: undefined;
  Blog: undefined;
  Asanas: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  Home: undefined;
  Upload: undefined;
  Videos: undefined;
  Chats: undefined;
  Profile: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;

// Screens
import HomeScreen from '../screens/HomeScreen';
import ClassesScreen from '../screens/ClassesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import BlogScreen from '../screens/BlogScreen';
import AsanasScreen from '../screens/AsanasScreen';
import ContactScreen from '../screens/ContactScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import AdminVideoUploadScreen from '../screens/AdminVideoUploadScreen';
import AdminVideosScreen from '../screens/AdminVideosScreen';
import EditVideoScreen from '../screens/EditVideoScreen';

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
      <StudentTab.Screen name="Chats" component={CommunityScreen} />
      <StudentTab.Screen name="Blog" component={BlogScreen} />
      <StudentTab.Screen name="Asanas" component={AsanasScreen} />
      <StudentTab.Screen name="Profile" component={ProfileScreen} />
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
      <AdminTab.Screen name="Chats" component={CommunityScreen} />
      <AdminTab.Screen name="Profile" component={ProfileScreen} />
    </AdminTab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};

const MainAppNavigator = ({
  hasSeenOnboarding,
  onOnboardingComplete
}: {
  hasSeenOnboarding: boolean;
  onOnboardingComplete?: () => void;
}) => {
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
      {!hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              {...props}
              onOnboardingComplete={onOnboardingComplete}
            />
          )}
        </Stack.Screen>
      ) : !userRole ? (
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
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="EditVideo" component={EditVideoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function AppNavigator({
  hasSeenOnboarding,
  onOnboardingComplete
}: {
  hasSeenOnboarding: boolean;
  onOnboardingComplete?: () => void;
}) {
  return (
    <NavigationContainer>
      <SignedIn>
        <MainAppNavigator
          hasSeenOnboarding={hasSeenOnboarding}
          onOnboardingComplete={onOnboardingComplete}
        />
      </SignedIn>
      <SignedOut>
        <AuthNavigator />
      </SignedOut>
    </NavigationContainer>
  );
}