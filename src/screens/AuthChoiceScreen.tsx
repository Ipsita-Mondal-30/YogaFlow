import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

interface AuthChoiceScreenProps {
  navigation: any;
}

export default function AuthChoiceScreen({ navigation }: AuthChoiceScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[colors.primary, colors.secondaryLight]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image 
                  source={require('../assets/yoga.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.logoText}>Yoga Flow</Text>
              <Text style={styles.tagline}>Rishikesh to the World</Text>
            </View>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <Text style={styles.welcomeSubtitle}>
              Choose how you'd like to continue
            </Text>
          </View>

          {/* Choice Cards */}
          <View style={styles.choicesContainer}>
            <TouchableOpacity
              style={styles.choiceCard}
              onPress={() => navigation.navigate('SignIn')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.white, colors.backgroundSecondary]}
                style={styles.cardGradient}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="person" size={40} color={colors.primary} />
                </View>
                <Text style={styles.choiceTitle}>Student</Text>
                <Text style={styles.choiceDescription}>
                  Join classes and learn yoga
                </Text>
                <View style={styles.arrowContainer}>
                  <Ionicons name="arrow-forward" size={20} color={colors.primary} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.choiceCard}
              onPress={() => navigation.navigate('AdminSignIn')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.white, colors.backgroundSecondary]}
                style={styles.cardGradient}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="shield-checkmark" size={40} color={colors.secondary} />
                </View>
                <Text style={styles.choiceTitle}>Admin / Teacher</Text>
                <Text style={styles.choiceDescription}>
                  Manage classes and content
                </Text>
                <View style={styles.arrowContainer}>
                  <Ionicons name="arrow-forward" size={20} color={colors.secondary} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 12,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.95,
  },
  choicesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  choiceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardGradient: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  choiceDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 32,
  },
});