import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground';
import GlassCard from '../components/GlassCard';

const { width } = Dimensions.get('window');

export default function PlansScreen({ navigation }: any) {
  const [selectedRegion, setSelectedRegion] = useState<'US' | 'India'>('US');

  const usPlans = [
    {
      id: 'free-trial',
      name: 'Free Trial',
      price: '$0',
      duration: '1 Month',
      popular: true,
      features: [
        'Access to all live classes',
        'Community chat access',
        'Free asana library',
        'Basic progress tracking',
        'Mobile app access'
      ],
      color: colors.teal
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$29',
      duration: 'per month',
      popular: false,
      features: [
        'Everything in Free Trial',
        'Recorded class library',
        'Personal progress analytics',
        'Priority customer support',
        'Offline class downloads'
      ],
      color: colors.primary
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '$299',
      duration: 'per year',
      popular: false,
      savings: 'Save $49',
      features: [
        'Everything in Monthly Plan',
        'One-on-one teacher sessions (2/month)',
        'Personalized yoga curriculum',
        'Advanced health tracking',
        'Early access to new features'
      ],
      color: colors.purple
    }
  ];

  const indiaPlans = [
    {
      id: 'free-trial-in',
      name: 'Free Trial',
      price: '₹0',
      duration: '1 Month',
      popular: true,
      features: [
        'Access to all live classes',
        'Community chat access',
        'Free asana library',
        'Basic progress tracking',
        'Mobile app access'
      ],
      color: colors.teal
    },
    {
      id: 'monthly-in',
      name: 'Monthly Plan',
      price: '₹999',
      duration: 'per month',
      popular: false,
      features: [
        'Everything in Free Trial',
        'Recorded class library',
        'Personal progress analytics',
        'Priority customer support',
        'Offline class downloads'
      ],
      color: colors.primary
    },
    {
      id: 'yearly-in',
      name: 'Yearly Plan',
      price: '₹9,999',
      duration: 'per year',
      popular: false,
      savings: 'Save ₹1,989',
      features: [
        'Everything in Monthly Plan',
        'One-on-one teacher sessions (2/month)',
        'Personalized yoga curriculum',
        'Advanced health tracking',
        'Early access to new features'
      ],
      color: colors.purple
    }
  ];

  const curriculum = [
    {
      level: 'Beginner',
      duration: '4 weeks',
      icon: 'leaf',
      color: colors.teal,
      modules: [
        'Introduction to Yoga Philosophy',
        'Basic Breathing Techniques (Pranayama)',
        'Fundamental Asanas',
        'Meditation Basics',
        'Building a Daily Practice'
      ]
    },
    {
      level: 'Intermediate',
      duration: '6 weeks',
      icon: 'fitness',
      color: colors.primary,
      modules: [
        'Advanced Asana Sequences',
        'Chakra Alignment',
        'Intermediate Pranayama',
        'Yoga Nidra Practice',
        'Mindful Movement Flow'
      ]
    },
    {
      level: 'Advanced',
      duration: '8 weeks',
      icon: 'flame',
      color: colors.purple,
      modules: [
        'Master Level Asanas',
        'Advanced Meditation Techniques',
        'Teaching Methodology',
        'Spiritual Philosophy Deep Dive',
        'Personal Transformation Journey'
      ]
    }
  ];

  const currentPlans = selectedRegion === 'US' ? usPlans : indiaPlans;

  return (
    <TexturedBackground variant="subtle">
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.header}
        >
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>
            Start your yoga journey with our structured programs
          </Text>

          {/* Region Selector */}
          <View style={styles.regionSelector}>
            <TouchableOpacity
              style={[
                styles.regionButton,
                selectedRegion === 'US' && styles.activeRegionButton
              ]}
              onPress={() => setSelectedRegion('US')}
            >
              <Text style={[
                styles.regionButtonText,
                selectedRegion === 'US' && styles.activeRegionButtonText
              ]}>
                🇺🇸 US Plans
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.regionButton,
                selectedRegion === 'India' && styles.activeRegionButton
              ]}
              onPress={() => setSelectedRegion('India')}
            >
              <Text style={[
                styles.regionButtonText,
                selectedRegion === 'India' && styles.activeRegionButtonText
              ]}>
                🇮🇳 India Plans
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Plans Section */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          
          {currentPlans.map((plan) => (
            <GlassCard key={plan.id} intensity="medium" style={styles.planCard}>
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
                {plan.savings && (
                  <Text style={styles.savingsText}>{plan.savings}</Text>
                )}
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color={plan.color} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.selectButton}>
                <LinearGradient
                  colors={[plan.color, `${plan.color}CC`]}
                  style={styles.selectGradient}
                >
                  <Text style={styles.selectButtonText}>
                    {plan.id.includes('free') ? 'Start Free Trial' : 'Select Plan'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>

        {/* Curriculum Section */}
        <View style={styles.curriculumSection}>
          <Text style={styles.sectionTitle}>Learning Curriculum</Text>
          <Text style={styles.sectionSubtitle}>
            Structured learning paths designed by Rishikesh masters
          </Text>

          {curriculum.map((course, index) => (
            <GlassCard key={index} intensity="light" style={styles.curriculumCard}>
              <View style={styles.curriculumHeader}>
                <View style={[styles.levelIcon, { backgroundColor: course.color }]}>
                  <Ionicons name={course.icon as any} size={24} color={colors.textWhite} />
                </View>
                <View style={styles.curriculumInfo}>
                  <Text style={styles.levelName}>{course.level} Level</Text>
                  <Text style={styles.levelDuration}>{course.duration}</Text>
                </View>
              </View>

              <View style={styles.modulesContainer}>
                {course.modules.map((module, moduleIndex) => (
                  <View key={moduleIndex} style={styles.moduleItem}>
                    <Text style={styles.moduleNumber}>{moduleIndex + 1}</Text>
                    <Text style={styles.moduleText}>{module}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Free Trial CTA */}
        <View style={styles.ctaSection}>
          <GlassCard intensity="strong" style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>🎁 Start Your Journey Today</Text>
            <Text style={styles.ctaText}>
              Begin with our 1-month free trial and experience authentic yoga from Rishikesh
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.ctaGradient}
              >
                <Ionicons name="gift" size={20} color={colors.textWhite} />
                <Text style={styles.ctaButtonText}>Start One Month Free</Text>
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
    paddingBottom: 160,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textWhite,
    opacity: 0.9,
    marginBottom: 20,
  },
  regionSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
  },
  regionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeRegionButton: {
    backgroundColor: colors.textWhite,
  },
  regionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textWhite,
  },
  activeRegionButtonText: {
    color: colors.primary,
  },
  plansSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  planCard: {
    marginBottom: 25,
    position: 'relative',
    marginTop: 15,
    overflow: 'visible',
  },
  popularBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1000,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  popularText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  planDuration: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  savingsText: {
    fontSize: 14,
    color: colors.teal,
    fontWeight: '600',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  selectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  selectButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  curriculumSection: {
    padding: 20,
    paddingTop: 0,
  },
  curriculumCard: {
    marginBottom: 20,
  },
  curriculumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  curriculumInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  levelDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modulesContainer: {
    paddingLeft: 10,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentLight,
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  moduleText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  ctaSection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 60,
    marginBottom: 20,
  },
  ctaCard: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 15,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 15,
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  ctaButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});