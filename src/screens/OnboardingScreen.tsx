import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
  onOnboardingComplete?: () => void;
}

export default function OnboardingScreen({ navigation, onOnboardingComplete }: OnboardingScreenProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Auto-play animation
    animationRef.current?.play();
  }, []);

  const handleStartFlow = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      onOnboardingComplete?.();
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require('../assets/onboarding-animation.json')}
          style={styles.animation}
          loop={false}
          onAnimationFinish={handleStartFlow}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Yoga Flow</Text>
        <Text style={styles.subtitle}>
          Train with Rishikesh's best yoga teachers — online
        </Text>
        <Text style={styles.description}>
          Experience authentic yoga with modern convenience
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleStartFlow}>
          <Text style={styles.buttonText}>Start Your Flow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9f0',
  },
  animationContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: width * 0.8,
    height: height * 0.4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#047857',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#10b981',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});