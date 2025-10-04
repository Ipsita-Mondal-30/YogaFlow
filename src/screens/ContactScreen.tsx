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
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={styles.title}>Contact Us</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>Get in Touch</Text>
            <Text style={styles.introText}>
              Have questions about our classes, need guidance on your yoga journey, 
              or want to share feedback? We'd love to hear from you.
            </Text>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="location" size={24} color="#10b981" />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>Rishikesh, Uttarakhand, India</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="mail" size={24} color="#10b981" />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>hello@yogaflow.com</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="time" size={24} color="#10b981" />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Response Time</Text>
                <Text style={styles.contactValue}>Within 24 hours</Text>
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
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
              {loading ? (
                <Text style={styles.submitButtonText}>Sending...</Text>
              ) : (
                <>
                  <Ionicons name="send" size={20} color="white" />
                  <Text style={styles.submitButtonText}>Send Message</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.additionalInfo}>
            <Text style={styles.additionalTitle}>Other Ways to Connect</Text>
            
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-instagram" size={24} color="#10b981" />
                <Text style={styles.socialText}>Follow us on Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-youtube" size={24} color="#10b981" />
                <Text style={styles.socialText}>Subscribe to our YouTube</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#10b981" />
                <Text style={styles.socialText}>Like us on Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065f46',
  },
  content: {
    padding: 20,
  },
  introSection: {
    marginBottom: 30,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 10,
  },
  introText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  contactInfo: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: '#6b7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#f9fafb',
  },
  messageInput: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  additionalInfo: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  additionalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 15,
  },
  socialLinks: {
    gap: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f0f9f0',
    borderRadius: 10,
  },
  socialText: {
    fontSize: 16,
    color: '#065f46',
    fontWeight: '600',
    marginLeft: 12,
  },
});