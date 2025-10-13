import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground';
import GlassCard from '../components/GlassCard';
import WorldMap from '../components/WorldMap';
import Testimonials from '../components/Testimonials';
import InviteShare from '../components/InviteShare';
import { useUserRole } from '../hooks/useUserRole';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { isAdmin, isStudent } = useUserRole();

  return (
    <TexturedBackground variant="subtle">
      <ScrollView style={styles.container}>
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' }}
        style={styles.hero}
      >
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 138, 101, 0.4)',
            'rgba(93, 78, 117, 0.7)'
          ]}
          style={styles.heroOverlay}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Yoga Flow</Text>
            <Text style={styles.heroSubtitle}>
              Train with Rishikesh's best yoga teachers — online
            </Text>
            <Text style={styles.heroDescription}>
              Experience authentic yoga with modern convenience
            </Text>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Classes')}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color={colors.textWhite} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Yoga Flow</Text>

        <GlassCard intensity="light" style={styles.missionCard}>
          <View style={styles.cardIconContainer}>
            <Ionicons name="heart" size={28} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            To bring the ancient wisdom of yoga from the spiritual capital of Rishikesh
            to practitioners worldwide through authentic, accessible online classes.
          </Text>
        </GlassCard>

        <GlassCard intensity="light" style={styles.missionCard}>
          <View style={styles.cardIconContainer}>
            <Ionicons name="eye" size={28} color={colors.teal} />
          </View>
          <Text style={styles.cardTitle}>Our Vision</Text>
          <Text style={styles.cardText}>
            To bring the wisdom of traditional yoga from Rishikesh to the world through modern, live experiences.
          </Text>
        </GlassCard>

        <GlassCard intensity="light" style={styles.missionCard}>
          <View style={styles.cardIconContainer}>
            <Ionicons name="leaf" size={28} color={colors.mint} />
          </View>
          <Text style={styles.cardTitle}>Our Values</Text>
          <Text style={styles.cardText}>
            Rooted in lineage and elevated by modern tools, we value authenticity, mindful progress, inclusive community, and measurable transformation that honors both tradition and today.
          </Text>
        </GlassCard>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What We Offer</Text>

        <View style={styles.featuresGrid}>
          <TouchableOpacity onPress={() => navigation.navigate('Classes')}>
            <GlassCard intensity="medium" style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="play-circle" size={40} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Live Classes</Text>
              <Text style={styles.featureText}>Join real-time sessions with expert teachers</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Community')}>
            <GlassCard intensity="medium" style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="people" size={40} color={colors.teal} />
              </View>
              <Text style={styles.featureTitle}>Community</Text>
              <Text style={styles.featureText}>Connect with fellow teachers and fellow practitioners</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Asanas')}>
            <GlassCard intensity="medium" style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="body" size={40} color={colors.purple} />
              </View>
              <Text style={styles.featureTitle}>Free Asanas</Text>
              <Text style={styles.featureText}>Learn poses with detailed guides</Text>
            </GlassCard>
          </TouchableOpacity>

          {isAdmin ? (
            <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
              <GlassCard intensity="medium" style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="cloud-upload" size={40} color={colors.primary} />
                </View>
                <Text style={styles.featureTitle}>Upload Video</Text>
                <Text style={styles.featureText}>Add new content for students</Text>
              </GlassCard>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Blog')}>
              <GlassCard intensity="medium" style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="library" size={40} color={colors.indigo} />
                </View>
                <Text style={styles.featureTitle}>Yoga Wisdom</Text>
                <Text style={styles.featureText}>Read insights and research</Text>
              </GlassCard>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* World Map */}
      <WorldMap />

      {/* Testimonials */}
      <Testimonials />

      {/* Invite & Share */}
      <InviteShare />

      {/* Contact CTA */}
      <View style={styles.section}>
        <GlassCard intensity="medium" style={styles.contactCta}>
          <View style={styles.contactIconContainer}>
            <Ionicons name="sparkles" size={32} color={colors.primary} />
          </View>
          <Text style={styles.contactTitle}>Ready to Begin?</Text>
          <Text style={styles.contactText}>
            Have questions? We're here to guide you on your yoga journey.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => navigation.navigate('Contact')}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.contactGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="send" size={18} color={colors.textWhite} />
              <Text style={styles.contactButtonText}>Get in Touch</Text>
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </ScrollView>
    </TexturedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 120,
  },
  hero: {
    height: 450,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
    width: '100%',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 20,
    color: colors.textWhite,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.95,
  },
  heroDescription: {
    fontSize: 16,
    color: colors.textWhite,
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  ctaButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  ctaButtonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  section: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  missionCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 160,
    justifyContent: 'center',
  },
  featureIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  contactCta: {
    alignItems: 'center',
    marginBottom: 50,
  },
  contactIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 26,
  },
  contactButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  contactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 14,
  },
  contactButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});