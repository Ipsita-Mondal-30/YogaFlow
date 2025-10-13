import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

interface Testimonial {
  id: string;
  name: string;
  location: string;
  story: string;
  rating: number;
  avatar?: string;
  practice_duration: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Mock testimonials data
    const mockTestimonials: Testimonial[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        location: 'San Francisco, USA',
        story: 'Yoga Flow transformed my mornings. The authentic teachings from Rishikesh masters helped me find inner peace I never knew existed. My anxiety has reduced significantly.',
        rating: 5,
        practice_duration: '6 months'
      },
      {
        id: '2',
        name: 'Raj Patel',
        location: 'London, UK',
        story: 'As someone with chronic back pain, I was skeptical. But the structured curriculum and expert guidance have given me my life back. I can finally sleep peacefully.',
        rating: 5,
        practice_duration: '8 months'
      },
      {
        id: '3',
        name: 'Maria Santos',
        location: 'São Paulo, Brazil',
        story: 'The community aspect is incredible. Connecting with fellow practitioners worldwide while learning traditional yoga has been life-changing. My stress levels have dropped dramatically.',
        rating: 5,
        practice_duration: '4 months'
      },
      {
        id: '4',
        name: 'David Kim',
        location: 'Seoul, South Korea',
        story: 'The research-backed approach convinced me to try yoga. The measurable improvements in my sleep quality and blood pressure have amazed even my doctor.',
        rating: 5,
        practice_duration: '10 months'
      },
      {
        id: '5',
        name: 'Emma Wilson',
        location: 'Melbourne, Australia',
        story: 'Starting with the free trial was perfect. The progressive curriculum helped me build confidence. Now yoga is an essential part of my daily routine.',
        rating: 5,
        practice_duration: '7 months'
      }
    ];
    setTestimonials(mockTestimonials);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={14}
        color={colors.primary}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💫 Transformation Stories</Text>
        <Text style={styles.subtitle}>
          Real experiences from our global yoga family
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.testimonialScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {testimonials.map((testimonial) => (
          <GlassCard key={testimonial.id} intensity="medium" style={styles.testimonialCard}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                {testimonial.avatar ? (
                  <Image source={{ uri: testimonial.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{testimonial.name}</Text>
                <Text style={styles.userLocation}>{testimonial.location}</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(testimonial.rating)}
                </View>
              </View>
            </View>

            <Text style={styles.story}>"{testimonial.story}"</Text>

            <View style={styles.cardFooter}>
              <View style={styles.practiceInfo}>
                <Ionicons name="time" size={14} color={colors.textSecondary} />
                <Text style={styles.practiceText}>
                  Practicing for {testimonial.practice_duration}
                </Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Join thousands who've transformed their lives with authentic yoga
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  testimonialScroll: {
    paddingLeft: 20,
  },
  scrollContent: {
    paddingRight: 20,
  },
  testimonialCard: {
    width: width * 0.8,
    marginRight: 15,
    padding: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  story: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  cardFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 15,
  },
  practiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  practiceText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});