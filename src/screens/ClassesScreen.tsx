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
import { Ionicons } from '@expo/vector-icons';
import { supabase, Class } from '../services/supabase';
import { useAuth } from '@clerk/clerk-expo';

export default function ClassesScreen() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isSignedIn } = useAuth();

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
      setClasses(data || []);
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

    if (classItem.type === 'live' && classItem.meeting_link) {
      Alert.alert(
        'Join Live Class',
        `Join "${classItem.title}" with ${classItem.teacher?.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join', onPress: () => {
            // In a real app, you'd open the meeting link
            Alert.alert('Success', 'Joining live class...');
          }},
        ]
      );
    } else if (classItem.type === 'recorded') {
      Alert.alert('Play Recording', `Playing "${classItem.title}"`);
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Yoga Classes</Text>
        <Text style={styles.subtitle}>
          Join live sessions or watch recorded classes
        </Text>
      </View>

      {classes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
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
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {classItem.duration_minutes} minutes
                  </Text>
                </View>
                
                {classItem.type === 'live' && (
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {formatDate(classItem.start_at)}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  classItem.type === 'live' && !isUpcoming(classItem.start_at)
                    ? styles.disabledButton
                    : styles.enabledButton
                ]}
                onPress={() => handleJoinClass(classItem)}
                disabled={classItem.type === 'live' && !isUpcoming(classItem.start_at)}
              >
                <Ionicons
                  name={classItem.type === 'live' ? 'videocam' : 'play'}
                  size={20}
                  color="white"
                />
                <Text style={styles.actionButtonText}>
                  {classItem.type === 'live' 
                    ? (isUpcoming(classItem.start_at) ? 'Join Live' : 'Class Ended')
                    : 'Watch Recording'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
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
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  classesContainer: {
    padding: 20,
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
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
    color: '#065f46',
    marginBottom: 5,
  },
  teacherName: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  liveBadge: {
    backgroundColor: '#fef2f2',
  },
  recordedBadge: {
    backgroundColor: '#f0f9ff',
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveText: {
    color: '#dc2626',
  },
  recordedText: {
    color: '#2563eb',
  },
  description: {
    fontSize: 16,
    color: '#374151',
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
    color: '#6b7280',
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
    backgroundColor: '#10b981',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});