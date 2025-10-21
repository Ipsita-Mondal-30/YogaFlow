import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';

interface TexturedBackgroundProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'medium' | 'strong';
}

const GRADIENT_COLORS = {
  subtle: [colors.background, colors.accentLight, colors.background],
  medium: [colors.background, colors.accentLight, colors.primaryLight, colors.background],
  strong: [colors.accentLight, colors.primaryLight, colors.primary, colors.accentLight],
} as const;

function TexturedBackground({ children, variant = 'subtle' }: TexturedBackgroundProps) {
  const gradientColors = useMemo(() => GRADIENT_COLORS[variant], [variant]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

export default React.memo(TexturedBackground);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});