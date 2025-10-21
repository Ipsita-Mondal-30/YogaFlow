import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'light' | 'medium' | 'strong';
}

const GRADIENT_COLORS = ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)'] as const;

function GlassCard({ children, style, intensity = 'medium' }: GlassCardProps) {
  const glassStyle = useMemo(() => {
    switch (intensity) {
      case 'light':
        return styles.glassLight;
      case 'strong':
        return styles.glassStrong;
      default:
        return styles.glassMedium;
    }
  }, [intensity]);

  return (
    <View style={[styles.container, glassStyle, style]}>
      <LinearGradient
        colors={GRADIENT_COLORS as any}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

export default React.memo(GlassCard);

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  glassLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  glassMedium: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  glassStrong: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
});