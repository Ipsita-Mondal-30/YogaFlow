import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../services/supabase';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground';
import GlassCard from '../components/GlassCard';
import CustomNotification from '../components/CustomNotification';

interface RoleSelectionScreenProps {
  onRoleSelected: (role: 'STUDENT' | 'ADMIN') => void;
}

export default function RoleSelectionScreen({ onRoleSelected }: RoleSelectionScreenProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'ADMIN' | null>(null);
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const roles = [
    {
      id: 'STUDENT' as const,
      title: 'Student',
      description: 'Join classes, connect with community, and learn yoga',
      icon: 'school-outline',
      color: colors.primary,
      features: [
        'Access to live and recorded classes',
        'Community chat participation',
        'Free asana library',
        'Progress tracking'
      ]
    },
    {
      id: 'ADMIN' as const,
      title: 'Teacher/Admin',
      description: 'Teach classes and manage the yoga platform',
      icon: 'person-outline',
      color: colors.teal,
      features: [
        'Create and host live classes',
        'Upload recorded sessions',
        'Manage student interactions',
        'Share yoga wisdom through blog'
      ]
    }
  ];

  const handleRoleSelection = async (role: 'STUDENT' | 'ADMIN') => {
    if (!user) {
      setNotification({
        visible: true,
        type: 'error',
        title: 'Authentication Error',
        message: 'User not found. Please try signing in again.',
      });
      return;
    }

    setLoading(true);
    try {
      // Check if user already exists in our database
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      if (existingUser) {
        // Update existing user's role
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: role.toLowerCase() })
          .eq('clerk_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Create new user with selected role
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            clerk_id: user.id,
            name: user.fullName || user.firstName || 'Anonymous',
            email: user.primaryEmailAddress?.emailAddress || '',
            role: role.toLowerCase(),
          });

        if (insertError) throw insertError;
      }

      // Don't update Clerk metadata - just proceed with role selection
      // Clerk metadata updates can be problematic and aren't necessary for our flow

      setNotification({
        visible: true,
        type: 'success',
        title: 'Welcome to Yoga Flow!',
        message: `You're all set as a ${role.toLowerCase()}. Let's start your yoga journey!`,
      });

      // Proceed to main app after a short delay
      setTimeout(() => {
        onRoleSelected(role);
      }, 2000);
    } catch (error) {
      console.error('Error setting user role:', error);
      setNotification({
        visible: true,
        type: 'error',
        title: 'Oops!',
        message: 'Failed to set your role. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TexturedBackground variant="medium">
      <View style={styles.container}>
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
          </View>
          
          <Text style={styles.welcomeTitle}>Welcome, {user?.firstName || 'Yogi'}!</Text>
          <Text style={styles.welcomeSubtitle}>
            Choose your role to get started with your yoga journey
          </Text>
        </View>

        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                selectedRole === role.id && styles.selectedRoleCard
              ]}
              onPress={() => setSelectedRole(role.id)}
              disabled={loading}
            >
              <GlassCard 
                intensity={selectedRole === role.id ? "strong" : "medium"} 
                style={styles.roleCardContent}
              >
                <View style={styles.roleHeader}>
                  <View style={[styles.roleIconContainer, { backgroundColor: role.color }]}>
                    <Ionicons name={role.icon as any} size={32} color={colors.textWhite} />
                  </View>
                  <View style={styles.roleTitleContainer}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                  </View>
                  {selectedRole === role.id && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    </View>
                  )}
                </View>

                <View style={styles.featuresContainer}>
                  {role.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <View style={[styles.checkmarkContainer, { backgroundColor: role.color }]}>
                        <Ionicons name="checkmark" size={14} color={colors.textWhite} />
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedRole || loading) && styles.disabledButton
            ]}
            onPress={() => selectedRole && handleRoleSelection(selectedRole)}
            disabled={!selectedRole || loading}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.continueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <Text style={styles.continueButtonText}>Setting up your account...</Text>
              ) : (
                <>
                  <Text style={styles.continueButtonText}>
                    Continue as {selectedRole === 'STUDENT' ? 'Student' : 'Teacher'}
                  </Text>
                  <Ionicons name="arrow-forward" size={22} color={colors.textWhite} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.noteText}>
            You can change your role later in your profile settings
          </Text>
        </View>
      </View>

      <CustomNotification
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
      />
    </TexturedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 20,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.secondary,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  rolesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 20,
    maxHeight: '65%',
  },
  roleCard: {
    marginBottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoleCard: {
    transform: [{ scale: 1.02 }],
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  roleCardContent: {
    padding: 0,
    borderRadius: 18,
    minHeight: 180,
    maxHeight: 200,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    paddingBottom: 0,
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  roleTitleContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  selectedIndicator: {
    marginLeft: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 2,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  actionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 8,
    marginTop: 'auto',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0.2,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginRight: 10,
    textTransform: 'capitalize',
  },
  noteText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    opacity: 0.8,
  },
});