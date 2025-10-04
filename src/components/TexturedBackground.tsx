import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';

interface TexturedBackgroundProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'medium' | 'strong';
}

export default function TexturedBackground({ children, variant = 'subtle' }: TexturedBackgroundProps) {
  const getGradientColors = (): [string, string, ...string[]] => {
    switch (variant) {
      case 'medium':
        return [colors.background, colors.accentLight, colors.primaryLight, colors.background];
      case 'strong':
        return [colors.accentLight, colors.primaryLight, colors.primary, colors.accentLight];
      default:
        return [colors.background, colors.accentLight, colors.background];
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});