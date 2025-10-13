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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground';
import GlassCard from '../components/GlassCard';

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
  achievements: string[];
}

export default function InstructorsScreen({ navigation }: any) {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const instructors: Instructor[] = [
    {
      id: '1',
      name: 'Guru Anand Sharma',
      specialization: 'Hatha & Ashtanga Yoga',
      experience: '15+ years',
      certification: 'Certified in Rishikesh',
      bio: 'Master Anand has been teaching traditional yoga in Rishikesh for over 15 years. He specializes in Hatha and Ashtanga yoga, helping students build strength, flexibility, and inner peace. His deep understanding of ancient yogic texts and modern anatomy creates a perfect balance for practitioners of all levels.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      greeting: 'Namaste, welcome to Yoga Flow. I am here to guide you on your spiritual journey with the ancient wisdom of Hatha and Ashtanga yoga.',
      languages: ['English', 'Hindi', 'Sanskrit'],
      achievements: ['500-hour RYT Certified', 'Rishikesh Yoga Alliance', 'Traditional Hatha Master']
    },
    {
      id: '2',
      name: 'Priya Devi',
      specialization: 'Vinyasa & Meditation',
      experience: '12+ years',
      certification: 'Certified in Rishikesh',
      bio: 'Priya brings grace and mindfulness to every session. Her expertise in Vinyasa flow and meditation helps students find balance in both body and mind. She has trained over 1000 students worldwide and specializes in stress relief and emotional healing through yoga.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      greeting: 'Namaste, dear soul. Let us flow together and discover the peace within. I will guide you through beautiful Vinyasa sequences that heal both body and spirit.',
      languages: ['English', 'Hindi'],
      achievements: ['Vinyasa Flow Specialist', 'Meditation Teacher Training', 'Stress Relief Expert']
    },
    {
      id: '3',
      name: 'Swami Rajesh',
      specialization: 'Pranayama & Philosophy',
      experience: '20+ years',
      certification: 'Certified in Rishikesh',
      bio: 'Swami Rajesh is a master of breath work and yoga philosophy. His deep understanding of ancient texts brings authentic wisdom to modern practice. He has spent years in ashrams studying under renowned gurus and now shares this sacred knowledge with the world.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      greeting: 'Om Namah Shivaya. Welcome to the sacred practice of yoga, where breath meets consciousness. Together we will explore the profound depths of pranayama and ancient wisdom.',
      languages: ['English', 'Hindi', 'Sanskrit'],
      achievements: ['Pranayama Master', 'Yoga Philosophy Scholar', 'Ashram Trained']
    },
    {
      id: '4',
      name: 'Maya Patel',
      specialization: 'Yin Yoga & Healing',
      experience: '10+ years',
      certification: 'Certified in Rishikesh',
      bio: 'Maya specializes in restorative practices and healing yoga. Her gentle approach helps students release tension and find deep relaxation. She combines traditional Yin yoga with modern therapeutic techniques to create transformative healing experiences.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      greeting: 'Namaste, beautiful being. Let us create space for healing and transformation together. Through gentle Yin practice, we will release what no longer serves you.',
      languages: ['English', 'Hindi', 'Gujarati'],
      achievements: ['Yin Yoga Specialist', 'Therapeutic Yoga', 'Healing Arts Practitioner']
    }
  ];

  const playGreeting = (instructor: Instructor) => {
    // Simulate audio greeting with text display
    Alert.alert(
      `🙏 Namaste from ${instructor.name}`,
      `"${instructor.greeting}"\n\n🎧 Note: Audio greeting feature coming soon!`,
      [
        { text: 'Thank You', style: 'default' },
        { text: 'Learn More', onPress: () => setSelectedInstructor(instructor) }
      ]
    );
  };

  return (
    <TexturedBackground variant="subtle">
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
          </TouchableOpacity>
          <Text style={styles.title}>Our Rishikesh Masters</Text>
          <Text style={styles.subtitle}>
            Learn from certified instructors trained in the birthplace of yoga
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>🧘‍♀️ Meet Your Teachers</Text>
          <Text style={styles.sectionDescription}>
            Each instructor brings decades of experience and authentic Rishikesh training to guide your practice
          </Text>

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

                <Text style={styles.bioPreview} numberOfLines={2}>
                  {instructor.bio}
                </Text>

                <View style={styles.achievementsContainer}>
                  {instructor.achievements.slice(0, 2).map((achievement, index) => (
                    <View key={index} style={styles.achievementTag}>
                      <Ionicons name="star" size={12} color={colors.primary} />
                      <Text style={styles.achievementText}>{achievement}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.languagesContainer}>
                  <Text style={styles.languagesLabel}>Languages:</Text>
                  {instructor.languages.map((language, index) => (
                    <View key={index} style={styles.languageTag}>
                      <Text style={styles.languageText}>{language}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.greetingButton}
                    onPress={() => playGreeting(instructor)}
                  >
                    <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
                    <Text style={styles.greetingButtonText}>Read Greeting</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => setSelectedInstructor(instructor)}
                  >
                    <Ionicons name="information-circle" size={20} color={colors.textWhite} />
                    <Text style={styles.profileButtonText}>Learn More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Instructor Detail Modal */}
        <Modal
          visible={selectedInstructor !== null}
          transparent={true}
          animationType="slide"
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
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.modalHeader}>
                    <Image source={{ uri: selectedInstructor.avatar }} style={styles.modalAvatar} />
                    <Text style={styles.modalName}>{selectedInstructor.name}</Text>
                    <Text style={styles.modalSpecialization}>{selectedInstructor.specialization}</Text>
                    <View style={styles.modalCertification}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.teal} />
                      <Text style={styles.modalCertificationText}>{selectedInstructor.certification}</Text>
                    </View>
                  </View>

                  <View style={styles.greetingSection}>
                    <Ionicons name="volume-high" size={24} color={colors.primary} />
                    <Text style={styles.greetingText}>"{selectedInstructor.greeting}"</Text>
                  </View>

                  <View style={styles.bioSection}>
                    <Text style={styles.bioTitle}>About {selectedInstructor.name}</Text>
                    <Text style={styles.bioText}>{selectedInstructor.bio}</Text>
                  </View>

                  <View style={styles.achievementsSection}>
                    <Text style={styles.achievementsTitle}>Certifications & Achievements</Text>
                    {selectedInstructor.achievements.map((achievement, index) => (
                      <View key={index} style={styles.achievementItem}>
                        <Ionicons name="star" size={16} color={colors.primary} />
                        <Text style={styles.achievementItemText}>{achievement}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalLanguages}>
                    <Text style={styles.languagesTitle}>Languages Spoken:</Text>
                    <View style={styles.languagesList}>
                      {selectedInstructor.languages.map((language, index) => (
                        <View key={index} style={styles.modalLanguageTag}>
                          <Text style={styles.modalLanguageText}>{language}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              )}
            </GlassCard>
          </View>
        </Modal>
      </ScrollView>
    </TexturedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 120,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  instructorCard: {
    marginBottom: 25,
    padding: 0,
  },
  cardHeader: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  certificationText: {
    fontSize: 12,
    color: colors.teal,
    fontWeight: '600',
    marginLeft: 6,
  },
  cardContent: {
    padding: 20,
    paddingTop: 10,
  },
  instructorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  specialization: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 5,
  },
  experience: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  bioPreview: {
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  achievementsContainer: {
    marginBottom: 15,
  },
  achievementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
    marginLeft: 6,
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  languagesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 10,
  },
  languageTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  languageText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  greetingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentLight,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  greetingButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  profileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  profileButtonText: {
    fontSize: 14,
    color: colors.textWhite,
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
    maxHeight: '85%',
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
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSpecialization: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalCertification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalCertificationText: {
    fontSize: 14,
    color: colors.teal,
    fontWeight: '600',
    marginLeft: 8,
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    lineHeight: 22,
  },
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  achievementItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    marginLeft: 10,
  },
  modalLanguages: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  languagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 15,
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalLanguageTag: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
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