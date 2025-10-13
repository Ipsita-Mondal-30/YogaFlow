import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import GlassCard from './GlassCard';

export default function InviteShare() {
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: '🧘‍♀️ Join me on Yoga Flow! Experience authentic yoga from Rishikesh masters with live classes, community support, and proven health benefits. Start your free trial today! 🌟',
        url: 'https://yogaflow.app', // Replace with actual app URL
        title: 'Join Our Global Yoga Family',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          Alert.alert('Thank you!', 'Your invitation has been shared successfully.');
        } else {
          // Shared
          Alert.alert('Thank you!', 'Your invitation has been shared successfully.');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share invitation. Please try again.');
    }
  };

  const shareOptions = [
    {
      id: 'general',
      title: 'Share Yoga Flow',
      subtitle: 'Invite friends to join our community',
      icon: 'share-social',
      color: colors.primary,
      action: handleShare
    },
    {
      id: 'whatsapp',
      title: 'Share on WhatsApp',
      subtitle: 'Send to your yoga buddies',
      icon: 'logo-whatsapp',
      color: '#25D366',
      action: () => {
        // WhatsApp sharing logic would go here
        handleShare();
      }
    },
    {
      id: 'instagram',
      title: 'Share on Instagram',
      subtitle: 'Spread the yoga love',
      icon: 'logo-instagram',
      color: '#E4405F',
      action: () => {
        // Instagram sharing logic would go here
        handleShare();
      }
    }
  ];

  return (
    <GlassCard intensity="light" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>❤️ Grow Our Global Yoga Family</Text>
        <Text style={styles.subtitle}>
          Share the gift of authentic yoga with friends and family
        </Text>
      </View>

      <View style={styles.benefitsContainer}>
        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={20} color={colors.primary} />
          <Text style={styles.benefitText}>Free month for every friend who joins</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="people" size={20} color={colors.teal} />
          <Text style={styles.benefitText}>Build your practice community</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="heart" size={20} color={colors.purple} />
          <Text style={styles.benefitText}>Share the wellness journey</Text>
        </View>
      </View>

      <View style={styles.shareOptions}>
        {shareOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.shareButton}
            onPress={option.action}
          >
            <LinearGradient
              colors={[option.color, `${option.color}CC`]}
              style={styles.shareGradient}
            >
              <Ionicons name={option.icon as any} size={24} color={colors.textWhite} />
              <View style={styles.shareContent}>
                <Text style={styles.shareTitle}>{option.title}</Text>
                <Text style={styles.shareSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={colors.textWhite} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          "The best way to take care of the future is to take care of the present moment." - Thich Nhat Hanh
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 0,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
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
  benefitsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
    fontWeight: '500',
    flex: 1,
  },
  shareOptions: {
    paddingHorizontal: 20,
    gap: 12,
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  shareContent: {
    flex: 1,
    marginLeft: 15,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 2,
  },
  shareSubtitle: {
    fontSize: 12,
    color: colors.textWhite,
    opacity: 0.9,
  },
  footer: {
    padding: 20,
    paddingTop: 15,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});