import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

interface Instructor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  certification: string;
  bio: string;
  avatar: string;
  greeting: string;
  languages: string[];
}

export default function InstructorsSection() {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const instructors: Instructor[] = [
    {
      id: '1',
      name: 'Guru Anand Sharma',
      specialization: 'Hatha & Ashtanga Yoga',
      experience: '15+ years',
      certification: 'Certified in Rishikesh',
      bio: 'Master Anand has been teaching traditional yoga in Rishikesh for over 15 years. He specializes in Hatha and Ashtanga yoga, helping students build strength, flexibility, and inner peace.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      greeting: 'Namaste, welcome to Yoga Flow. I am here to guide you on your spiritual journey.',
      languages: ['English', 'Hindi', 'Sanskrit']
    },
    {
      id: '2',
      name: 'Priya Devi',
      specialization: 'Vinyasa & Meditation',
      experience: '12+ years',
      certification: 'Certified in Rishikesh',
      bio: 'Priya brings grace and mindfulness to every session. Her expertise in Vinyasa flow and meditation helps students find balance in both body and mind.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      greeting: 'Namaste, dear soul. Let us flow together and discover the peace within.',
      languages: ['English', 'Hindi']
    },
    {
      id: '3',
      name: 'Swami Rajesh',
      specialization: 'Pranayama & Philosophy',
      experience: '20+ years',
      certification: 'Certified in Rishikesh',
      bio: 'Swami Rajesh is a master of breath work and yoga philosophy. His deep understanding of ancient texts brings authentic wisdom to modern practice.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      greeting: 'Om Namah Shivaya. Welcome to the sacred practice of yoga, where breath meets consciousness.',
      languages: ['English', 'Hindi', 'Sanskrit']
    },
    {
      id: '4',
      name: 'Maya Patel',
      specialization: 'Yin Yoga & Healing',
      experience: '10+ years',
      certification: 'Certified in Rishikesh',
      bio: 'Maya specializes in restorative practices and healing yoga. Her gentle approach helps students release tension and find deep relaxation.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      greeting: 'Namaste, beautiful being. Let us create space for healing and transformation together.',
      languages: ['English', 'Hindi', 'Gujarati']
    }
  ];

  const playGreeting = (instructor: Instructor) => {
    // In a real app, this would play an audio file
    setSelectedInstructor(instructor);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧘‍♀️ Meet Our Rishikesh Masters</Text>
      <Text style={styles.subtitle}>
        Learn from certified instructors trained in the birthplace of yoga
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.instructorsScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {instructors.map((instructor) => (
          <GlassCard key={instructor.id} intensity="medium" style={styles.instructorCard}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: instructor.avatar }} style={styles.avatar} />
              <View style={styles.certificationBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.teal} />
                <Text style={styles.certificationText}>Certified in Rishikesh</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.instructorName}>{instructor.name}</Text>
              <Text style={styles.specialization}>{instructor.specialization}</Text>
              <Text style={styles.experience}>{instructor.experience} experience</Text>

              <View style={styles.languagesContainer}>
                {instructor.languages.map((language, index) => (
                  <View key={index} style={styles.languageTag}>
                    <Text style={styles.languageText}>{language}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.greetingButton}
                onPress={() => playGreeting(instructor)}
              >
                <Ionicons name="play-circle" size={20} color={colors.primary} />
                <Text style={styles.greetingButtonText}>Hear Greeting</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      {/* Instructor Detail Modal */}
      <Modal
        visible={selectedInstructor !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedInstructor(null)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard intensity="strong" style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedInstructor(null)}
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            {selectedInstructor && (
              <>
                <View style={styles.modalHeader}>
                  <Image source={{ uri: selectedInstructor.avatar }} style={styles.modalAvatar} />
                  <Text style={styles.modalName}>{selectedInstructor.name}</Text>
                  <Text style={styles.modalSpecialization}>{selectedInstructor.specialization}</Text>
                </View>

                <View style={styles.greetingSection}>
                  <Ionicons name="volume-high" size={24} color={colors.primary} />
                  <Text style={styles.greetingText}>"{selectedInstructor.greeting}"</Text>
                </View>

                <Text style={styles.bioText}>{selectedInstructor.bio}</Text>

                <View style={styles.modalLanguages}>
                  <Text style={styles.languagesLabel}>Languages:</Text>
                  <View style={styles.languagesList}>
                    {selectedInstructor.languages.map((language, index) => (
                      <View key={index} style={styles.modalLanguageTag}>
                        <Text style={styles.modalLanguageText}>{language}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  instructorsScroll: {
    paddingLeft: 20,
  },
  scrollContent: {
    paddingRight: 20,
  },
  instructorCard: {
    width: width * 0.7,
    marginRight: 15,
    padding: 0,
  },
  cardHeader: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certificationText: {
    fontSize: 11,
    color: colors.teal,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardContent: {
    padding: 20,
    paddingTop: 10,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  specialization: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 5,
  },
  experience: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  languageTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    margin: 2,
  },
  languageText: {
    fontSize: 10,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  greetingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentLight,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  greetingButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    padding: 25,
    paddingBottom: 20,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  modalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 5,
  },
  modalSpecialization: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 12,
  },
  greetingText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontStyle: 'italic',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  bioText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalLanguages: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  languagesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 10,
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalLanguageTag: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  modalLanguageText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});