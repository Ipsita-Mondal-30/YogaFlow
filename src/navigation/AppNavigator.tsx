import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { View, Text, ActivityIndicator } from 'react-native';

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

// Teacher Screens
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import TeacherClassesScreen from '../screens/teacher/TeacherClassesScreen';
import TeacherClassUploadScreen from '../screens/teacher/TeacherClassUploadScreen';
import TeacherAnalyticsScreen from '../screens/teacher/TeacherAnalyticsScreen';

// Student Screens
import StudentProgressScreen from '../screens/student/StudentProgressScreen';
import StudentClassBookingScreen from '../screens/student/StudentClassBookingScreen';

// Services
import { syncUserData } from '../services/userSync';
import { useUserRole, UserRole } from '../hooks/useUserRole';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Student Tab Navigator
const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Classes') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'Book') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Asanas') {
            iconName = focused ? 'body' : 'body-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Classes" component={ClassesScreen} />
      <Tab.Screen name="Book" component={StudentClassBookingScreen} />
      <Tab.Screen name="Progress" component={StudentProgressScreen} />
      <Tab.Screen name="Asanas" component={AsanasScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Teacher Tab Navigator
const TeacherTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'My Classes') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherDashboardScreen} />
      <Tab.Screen name="My Classes" component={TeacherClassesScreen} />
      <Tab.Screen name="Upload" component={TeacherClassUploadScreen} />
      <Tab.Screen name="Analytics" component={TeacherAnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Role-based Tab Navigator
const RoleBasedTabNavigator = () => {
  const { userRole, loading, error } = useUserRole();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#6b7280' }}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <Text style={{ fontSize: 16, color: '#ef4444', textAlign: 'center' }}>Error loading user role</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Defaulting to student view</Text>
      </View>
    );
  }

  // Default to student if role is not determined
  if (userRole === 'TEACHER' || userRole === 'ADMIN') {
    return <TeacherTabNavigator />;
  }

  return <StudentTabNavigator />;
};

// Authentication Navigator for signed out users
const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

// Main App Navigator for signed in users
const MainAppNavigator = ({ 
  hasSeenOnboarding, 
  onOnboardingComplete 
}: { 
  hasSeenOnboarding: boolean;
  onOnboardingComplete?: () => void;
}) => {
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
      ) : (
        <>
           <Stack.Screen name="Main" component={RoleBasedTabNavigator} />
           <Stack.Screen name="Contact" component={ContactScreen} />
           <Stack.Screen name="Profile" component={ProfileScreen} />
         </>
      )}
    </Stack.Navigator>
  );
};

// User Sync Component
const UserSyncHandler = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  useEffect(() => {
    const handleUserSync = async () => {
      if (user) {
        try {
          await syncUserData(user);
          console.log('User data synchronized successfully');
        } catch (error) {
          console.error('Failed to sync user data:', error);
        }
      }
    };

    handleUserSync();
  }, [user]);

  return <>{children}</>;
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
        <UserSyncHandler>
          <MainAppNavigator 
            hasSeenOnboarding={hasSeenOnboarding}
            onOnboardingComplete={onOnboardingComplete}
          />
        </UserSyncHandler>
      </SignedIn>
      <SignedOut>
        <AuthNavigator />
      </SignedOut>
    </NavigationContainer>
  );
}