import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@clerk/clerk-expo';
import { colors } from '../utils/colors';
import { useUserRole } from '../hooks/useUserRole';
import { supabase } from '../services/supabase';

interface Class {
  id: string;
  title: string;
  description?: string;
  start_at: string;
  is_live: boolean;
  video_url?: string;
  duration_minutes?: number;
  type: 'live' | 'recorded';
  teacher?: {
    name: string;
    email: string;
  };
}

export default function ClassesScreen() {
  const navigation = useNavigation();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isSignedIn } = useAuth();
  const { isAdmin, isStudent } = useUserRole();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teacher:users!classes_teacher_id_fkey(name, email)
        `)
        .order('start_at', { ascending: true });

      if (error) throw error;

      // Add type property based on is_live field
      const classesWithType = (data || []).map(classItem => ({
        ...classItem,
        type: classItem.is_live ? 'live' : 'recorded'
      }));

      setClasses(classesWithType);
    } catch (error) {
      console.error('Error fetching classes:', error);
      Alert.alert('Error', 'Failed to load classes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const handleJoinClass = (classItem: Class) => {
    if (!isSignedIn) {
      Alert.alert('Sign In Required', 'Please sign in to join classes');
      return;
    }

    if (classItem.type === 'live') {
      Alert.alert(
        'Join Live Class',
        `Join "${classItem.title}" with ${classItem.teacher?.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Join', onPress: () => {
              // In a real app, you'd open the meeting link or video call
              Alert.alert('Success', 'Joining live class...');
            }
          },
        ]
      );
    } else if (classItem.type === 'recorded' && classItem.video_url) {
      // Navigate to video player screen
      (navigation as any).navigate('VideoPlayer', {
        videoUrl: classItem.video_url,
        title: classItem.title,
        description: classItem.description || '',
        teacherName: classItem.teacher?.name || 'Unknown Teacher',
      });
    } else if (classItem.type === 'recorded') {
      Alert.alert('Error', 'Video not available for this class');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading classes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <Text style={styles.title}>Yoga Classes</Text>
        <Text style={styles.subtitle}>
          Join live sessions or watch recorded classes
        </Text>
      </LinearGradient>

      {classes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={colors.lightGray} />
          <Text style={styles.emptyTitle}>No Classes Available</Text>
          <Text style={styles.emptyText}>
            Check back soon for new classes from our teachers
          </Text>
        </View>
      ) : (
        <View style={styles.classesContainer}>
          {classes.map((classItem) => (
            <View key={classItem.id} style={styles.classCard}>
              <View style={styles.classHeader}>
                <View style={styles.classInfo}>
                  <Text style={styles.classTitle}>{classItem.title}</Text>
                  <Text style={styles.teacherName}>
                    with {classItem.teacher?.name || 'Unknown Teacher'}
                  </Text>
                </View>
                <View style={[
                  styles.typeBadge,
                  classItem.type === 'live' ? styles.liveBadge : styles.recordedBadge
                ]}>
                  <Text style={[
                    styles.typeText,
                    classItem.type === 'live' ? styles.liveText : styles.recordedText
                  ]}>
                    {classItem.type === 'live' ? 'LIVE' : 'RECORDED'}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{classItem.description}</Text>

              <View style={styles.classDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {classItem.duration_minutes} minutes
                  </Text>
                </View>

                {classItem.type === 'live' && (
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {classItem.start_at ? formatDate(classItem.start_at) : 'TBD'}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  classItem.type === 'live' && (!classItem.start_at || !isUpcoming(classItem.start_at))
                    ? styles.disabledButton
                    : styles.enabledButton
                ]}
                onPress={() => handleJoinClass(classItem)}
                disabled={classItem.type === 'live' && (!classItem.start_at || !isUpcoming(classItem.start_at))}
              >
                <Ionicons
                  name={classItem.type === 'live' ? 'videocam' : 'play'}
                  size={20}
                  color="white"
                />
                <Text style={styles.actionButtonText}>
                  {classItem.type === 'live'
                    ? (classItem.start_at && isUpcoming(classItem.start_at) ? 'Join Live' : 'Class Ended')
                    : 'Watch Recording'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      </ScrollView>
      
      {/* Admin Floating Action Button */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => (navigation as any).navigate('AdminVideoUpload')}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={24} color={colors.textWhite} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textWhite,
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  classesContainer: {
    padding: 20,
  },
  classCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 5,
  },
  teacherName: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  liveBadge: {
    backgroundColor: colors.accentLight,
  },
  recordedBadge: {
    backgroundColor: colors.accentLight,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveText: {
    color: colors.primary,
  },
  recordedText: {
    color: colors.primary,
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 15,
  },
  classDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  enabledButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  actionButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});