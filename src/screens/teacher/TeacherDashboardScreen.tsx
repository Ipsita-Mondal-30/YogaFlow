import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../services/supabase';

interface TeacherStats {
  totalClasses: number;
  studentsReached: number;
  averageRating: number;
}

const TeacherDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [stats, setStats] = useState<TeacherStats>({ totalClasses: 0, studentsReached: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTeacherStats();
    }
  }, [user]);

  const fetchTeacherStats = async () => {
    try {
      setLoading(true);
      
      // Get teacher's user data from Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user?.id)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        return;
      }

      // Fetch total classes created by this teacher
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', userData.id);

      if (classesError) {
        console.error('Error fetching classes:', classesError);
        return;
      }

      // Fetch total students reached (unique enrollments)
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('student_id, class_id, classes!inner(teacher_id)')
        .eq('classes.teacher_id', userData.id);

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
      }

      const uniqueStudents = new Set(enrollmentsData?.map(e => e.student_id) || []).size;
      
      setStats({
        totalClasses: classesData?.length || 0,
        studentsReached: uniqueStudents,
        averageRating: 4.8, // TODO: Implement rating system
      });
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardItems = [
    {
      title: 'Upload Class Video',
      description: 'Share your yoga sessions with students',
      icon: 'videocam' as keyof typeof Ionicons.glyphMap,
      color: '#10b981',
      onPress: () => (navigation as any).navigate('Upload'),
    },
    {
      title: 'Schedule Live Class',
      description: 'Plan and schedule live yoga sessions',
      icon: 'calendar' as keyof typeof Ionicons.glyphMap,
      color: '#3b82f6',
      onPress: () => (navigation as any).navigate('My Classes'),
    },
    {
      title: 'View Analytics',
      description: 'Track student engagement and attendance',
      icon: 'analytics' as keyof typeof Ionicons.glyphMap,
      color: '#8b5cf6',
      onPress: () => (navigation as any).navigate('Analytics'),
    },
    {
      title: 'Manage Classes',
      description: 'Edit or delete your existing classes',
      icon: 'settings' as keyof typeof Ionicons.glyphMap,
      color: '#f59e0b',
      onPress: () => (navigation as any).navigate('My Classes'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Teacher Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage your yoga classes and connect with students
          </Text>
        </View>

        <View style={styles.grid}>
          {dashboardItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { borderLeftColor: item.color }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickStats}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Loading stats...</Text>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalClasses}</Text>
                <Text style={styles.statLabel}>Total Classes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.studentsReached}</Text>
                <Text style={styles.statLabel}>Students Reached</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Average Rating</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  grid: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  quickStats: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
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
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default TeacherDashboardScreen;