import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground'
import GlassCard from '../components/GlassCard';

export default function ContactScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.message.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        });

      if (error) throw error;

      Alert.alert(
        'Message Sent!',
        'Thank you for reaching out. We\'ll get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({ name: '', email: '', message: '' });
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TexturedBackground variant="medium">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContainer}>
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
            <Text style={styles.title}>Contact Us</Text>
          </LinearGradient>

          <View style={styles.content}>
            <GlassCard intensity="light" style={styles.introSection}>
              <Text style={styles.introTitle}>Get in Touch</Text>
              <Text style={styles.introText}>
                Have questions about our classes, need guidance on your yoga journey,
                or want to share feedback? We'd love to hear from you.
              </Text>
            </GlassCard>

            <GlassCard intensity="medium" style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="location" size={24} color={colors.primary} />
                <View style={styles.contactText}>
                  <Text style={styles.contactLabel}>Location</Text>
                  <Text style={styles.contactValue}>Rishikesh, Uttarakhand, India</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Ionicons name="mail" size={24} color={colors.primary} />
                <View style={styles.contactText}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>hello@yogaflow.com</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Ionicons name="time" size={24} color={colors.primary} />
                <View style={styles.contactText}>
                  <Text style={styles.contactLabel}>Response Time</Text>
                  <Text style={styles.contactValue}>Within 24 hours</Text>
                </View>
              </View>
            </GlassCard>

            <GlassCard intensity="strong" style={styles.formSection}>
              <Text style={styles.formTitle}>Send us a Message</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Your full name"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="your.email@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  value={formData.message}
                  onChangeText={(value) => handleInputChange('message', value)}
                  placeholder="Tell us how we can help you..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <Text style={styles.submitButtonText}>Sending...</Text>
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color={colors.textWhite} />
                      <Text style={styles.submitButtonText}>Send Message</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </GlassCard>

            <GlassCard intensity="light" style={styles.additionalInfo}>
              <Text style={styles.additionalTitle}>Other Ways to Connect</Text>

              <View style={styles.socialLinks}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-instagram" size={24} color={colors.primary} />
                  <Text style={styles.socialText}>Follow us on Instagram</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-youtube" size={24} color={colors.primary} />
                  <Text style={styles.socialText}>Subscribe to our YouTube</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={24} color={colors.primary} />
                  <Text style={styles.socialText}>Like us on Facebook</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TexturedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  content: {
    padding: 20,
    paddingBottom: 120, // Add bottom padding to prevent overlap with tab bar
  },
  introSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    textAlign: 'center',
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    marginLeft: 15,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  messageInput: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  submitButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  additionalInfo: {
    marginBottom: 20,
  },
  additionalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 15,
    textAlign: 'center',
  },
  socialLinks: {
    gap: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  socialText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: 12,
  },
});