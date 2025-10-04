import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { colors } from '../utils/colors';
import CustomTabBar from '../components/CustomTabBar';

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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Classes" component={ClassesScreen} />
      <Tab.Screen name="Chats" component={CommunityScreen} />
      <Tab.Screen name="Blog" component={BlogScreen} />
      <Tab.Screen name="Asanas" component={AsanasScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

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
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
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