import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { getUserData } from '../services/userSync';
import { useUserRole } from '../hooks/useUserRole';

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { userRole } = useUserRole();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (user) {
      try {
        const data = await getUserData(user.id);
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const ProfileItem = ({ 
    icon, 
    label, 
    value, 
    onPress 
  }: { 
    icon: string; 
    label: string; 
    value?: string; 
    onPress?: () => void; 
  }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <Ionicons name={icon as any} size={24} color="#10b981" />
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemLabel}>{label}</Text>
          {value && <Text style={styles.profileItemValue}>{value}</Text>}
        </View>
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#10b981" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.emailAddresses[0]?.emailAddress}</Text>
          <View style={styles.userRole}>
            <Text style={styles.userRoleText}>{userData?.role || 'Student'}</Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.sectionContent}>
            <ProfileItem
              icon="person-outline"
              label="Full Name"
              value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
            />
            <ProfileItem
              icon="mail-outline"
              label="Email"
              value={user?.emailAddresses[0]?.emailAddress}
            />
            <ProfileItem
              icon="calendar-outline"
              label="Member Since"
              value={userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
            />
          </View>
        </View>

        {/* Role-specific Stats */}
        {userRole === 'TEACHER' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Teaching Stats</Text>
            <View style={styles.sectionContent}>
              <ProfileItem
                icon="play-circle-outline"
                label="Total Classes"
                value="18 classes"
              />
              <ProfileItem
                icon="people-outline"
                label="Total Students"
                value="245 students"
              />
              <ProfileItem
                icon="star-outline"
                label="Average Rating"
                value="4.8 stars"
              />
              <ProfileItem
                icon="card-outline"
                label="Total Earnings"
                value="$3,420"
              />
            </View>
          </View>
        )}

        {userRole === 'STUDENT' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.sectionContent}>
              <ProfileItem
                icon="play-circle-outline"
                label="Classes Completed"
                value="24 classes"
              />
              <ProfileItem
                icon="flame-outline"
                label="Current Streak"
                value="7 days"
              />
              <ProfileItem
                icon="trophy-outline"
                label="Achievements"
                value="5 badges earned"
              />
              <ProfileItem
                icon="time-outline"
                label="Total Practice Time"
                value="36 hours"
              />
            </View>
          </View>
        )}

        {/* Role-specific Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{userRole === 'TEACHER' ? 'Teacher Tools' : 'Quick Actions'}</Text>
          <View style={styles.sectionContent}>
            {userRole === 'TEACHER' ? (
              <>
                <ProfileItem
                  icon="cloud-upload-outline"
                  label="Upload New Class"
                  onPress={() => Alert.alert('Coming Soon', 'Class upload feature will be available soon.')}
                />
                <ProfileItem
                  icon="analytics-outline"
                  label="View Analytics"
                  onPress={() => Alert.alert('Coming Soon', 'Analytics dashboard will be available soon.')}
                />
                <ProfileItem
                  icon="calendar-outline"
                  label="Manage Schedule"
                  onPress={() => Alert.alert('Coming Soon', 'Schedule management will be available soon.')}
                />
              </>
            ) : (
              <>
                <ProfileItem
                  icon="calendar-outline"
                  label="Book a Class"
                  onPress={() => Alert.alert('Coming Soon', 'Class booking will be available soon.')}
                />
                <ProfileItem
                  icon="heart-outline"
                  label="Favorite Classes"
                  onPress={() => Alert.alert('Coming Soon', 'Favorites feature will be available soon.')}
                />
                <ProfileItem
                  icon="download-outline"
                  label="Offline Classes"
                  onPress={() => Alert.alert('Coming Soon', 'Offline downloads will be available soon.')}
                />
              </>
            )}
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.sectionContent}>
            <ProfileItem
              icon="notifications-outline"
              label="Notifications"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon.')}
            />
            <ProfileItem
              icon="shield-outline"
              label="Privacy"
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon.')}
            />
            <ProfileItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => navigation.navigate('Contact')}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Yoga Flow v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ for your wellness journey</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 10,
  },
  userRole: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userRoleText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 15,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemText: {
    marginLeft: 15,
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  profileItemValue: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 10,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  appInfoText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 5,
  },
});