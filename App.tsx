import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClerkProvider, tokenCache } from './src/services/clerk';
import AppNavigator from './src/navigation/AppNavigator';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

export default function App() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingStatus = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(onboardingStatus === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <AppNavigator 
          hasSeenOnboarding={hasSeenOnboarding} 
          onOnboardingComplete={handleOnboardingComplete}
        />
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
