import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';

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
    <LinearGradient
      colors={[colors.background, colors.white]}
      style={styles.container}
    >
      <View style={styles.animationContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="flower" size={60} color={colors.primary} />
        </View>
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
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Start Your Flow</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animationContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  animation: {
    width: width * 0.6,
    height: height * 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 50,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});