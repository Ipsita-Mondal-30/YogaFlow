import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export type UserRole = 'student' | 'teacher';

interface RoleSelectionProps {
  selectedRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
  disabled?: boolean;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onRoleSelect,
  disabled = false,
}) => {
  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student',
      subtitle: 'Learn and practice yoga',
      icon: 'school-outline' as keyof typeof Ionicons.glyphMap,
      description: 'Access free asanas, join community chat, book classes, and track your progress',
      color: '#4F46E5',
    },
    {
      id: 'teacher' as UserRole,
      title: 'Teacher',
      subtitle: 'Teach and inspire others',
      icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
      description: 'Upload class videos, schedule live sessions, write blogs, and manage students',
      color: '#059669',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>
        Select how you'd like to use Yoga Flow
      </Text>

      <View style={styles.rolesContainer}>
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                isSelected && styles.selectedCard,
                { borderColor: isSelected ? role.color : '#E5E7EB' },
                disabled && styles.disabledCard,
              ]}
              onPress={() => !disabled && onRoleSelect(role.id)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <View style={styles.roleHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isSelected ? role.color : '#F3F4F6' },
                  ]}
                >
                  <Ionicons
                    name={role.icon}
                    size={24}
                    color={isSelected ? '#FFFFFF' : '#6B7280'}
                  />
                </View>
                <View style={styles.roleInfo}>
                  <Text
                    style={[
                      styles.roleTitle,
                      isSelected && { color: role.color },
                    ]}
                  >
                    {role.title}
                  </Text>
                  <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                </View>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={role.color}
                  />
                )}
              </View>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.noteContainer}>
        <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
        <Text style={styles.noteText}>
          You can change your role later in your profile settings
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  rolesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    backgroundColor: '#F8FAFC',
  },
  disabledCard: {
    opacity: 0.6,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  roleDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    flex: 1,
  },
});

export default RoleSelection;