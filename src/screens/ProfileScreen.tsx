import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';

export default function ProfileScreen({ navigation }: any) {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [showAbout, setShowAbout] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    } catch (error) {
      console.error('Error loading user role:', error);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'school-outline',
      title: 'Our Instructors',
      subtitle: 'Meet our certified Rishikesh masters',
      onPress: () => navigation.navigate('Instructors'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About Yoga Flow',
      subtitle: 'Learn more about our mission',
      onPress: () => setShowAbout(true),
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={colors.primary} />
              </View>
            )}
          </View>
          <Text style={styles.userName}>
            {user?.fullName || user?.firstName || 'Yoga Practitioner'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.primaryEmailAddress?.emailAddress || 'Welcome to Yoga Flow'}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>


        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index === menuItems.length - 1 && styles.lastMenuItem]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacer} />
        
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LinearGradient
            colors={[colors.error, '#C0392B']}
            style={styles.signOutGradient}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.textWhite} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      </ScrollView>

      {/* About Modal */}
      <Modal
        visible={showAbout}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAbout(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAbout(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>About Yoga Flow</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.aboutHeader}>
              <Text style={styles.aboutEmoji}>🧘‍♀️</Text>
              <Text style={styles.aboutTitle}>About Yoga Flow</Text>
              <Text style={styles.aboutSubtitle}>Bringing the Soul of Rishikesh to the World</Text>
            </View>
            
            <Text style={styles.aboutDescription}>
              Yoga Flow is more than just an online yoga platform — it's a movement to reconnect the world with authentic yoga, taught by certified instructors from Rishikesh, the Yoga Capital of the World.
            </Text>
            
            <Text style={styles.aboutDescription}>
              We believe yoga is not just a workout — it's a way of life. And at Yoga Flow, we're committed to preserving its purity while making it accessible to anyone, anywhere.
            </Text>
            
            <View style={styles.storySection}>
              <Text style={styles.storyTitle}>🌱 Our Story</Text>
              <Text style={styles.storyText}>
                It all began with a vision:
              </Text>
              <Text style={styles.storyText}>
                What if the peace and wisdom of traditional yoga could reach living rooms across the globe?
              </Text>
              <Text style={styles.storyText}>
                After witnessing the global shift toward mental, physical, and emotional well-being — especially during the pandemic — we realized people needed more than just fitness videos. They needed real yoga, taught with heart.
              </Text>
              <Text style={styles.storyText}>
                So we created Yoga Flow — a space where certified teachers from Rishikesh guide students through live online sessions and offer a connected community via Telegram — all supported by a simple, peaceful, and intuitive platform.
              </Text>
            </View>
            
            <View style={styles.uniqueSection}>
              <Text style={styles.uniqueTitle}>🧘‍♀️ What Makes Yoga Flow Unique</Text>
              <View style={styles.uniquePoint}>
                <Text style={styles.uniqueLabel}>• Rooted in Rishikesh:</Text>
                <Text style={styles.uniqueDescription}> All our instructors are certified professionals from the spiritual home of yoga.</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 120, // Reduced padding to prevent overlap with tab bar
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    paddingBottom: 110,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textWhite,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20, // Add bottom padding to prevent content overlap
  },
  menuContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    marginBottom: 30,
    marginTop: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signOutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    height: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 24,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  aboutHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  aboutEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  aboutSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  aboutDescription: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  storySection: {
    marginTop: 20,
    marginBottom: 30,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  storyText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  uniqueSection: {
    marginBottom: 40,
  },
  uniqueTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  uniquePoint: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  uniqueLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  uniqueDescription: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 24,
  },
});