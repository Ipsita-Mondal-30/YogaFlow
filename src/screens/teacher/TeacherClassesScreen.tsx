import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface ClassItem {
  id: string;
  title: string;
  type: 'LIVE' | 'RECORDED';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  date: string;
  duration: number;
  studentsEnrolled: number;
  maxStudents?: number;
}

const TeacherClassesScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  // Mock data - in real app, this would come from API
  const mockClasses: ClassItem[] = [
    {
      id: '1',
      title: 'Morning Vinyasa Flow',
      type: 'LIVE',
      status: 'SCHEDULED',
      date: '2024-01-15T08:00:00Z',
      duration: 60,
      studentsEnrolled: 12,
      maxStudents: 20,
    },
    {
      id: '2',
      title: 'Beginner Hatha Yoga',
      type: 'RECORDED',
      status: 'COMPLETED',
      date: '2024-01-10T10:00:00Z',
      duration: 45,
      studentsEnrolled: 25,
    },
    {
      id: '3',
      title: 'Advanced Ashtanga',
      type: 'LIVE',
      status: 'SCHEDULED',
      date: '2024-01-20T18:00:00Z',
      duration: 90,
      studentsEnrolled: 8,
      maxStudents: 15,
    },
  ];

  const upcomingClasses = mockClasses.filter(c => c.status === 'SCHEDULED');
  const completedClasses = mockClasses.filter(c => c.status === 'COMPLETED');

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return '#10b981';
      case 'COMPLETED':
        return '#6b7280';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleClassAction = (classItem: ClassItem, action: 'edit' | 'cancel' | 'view') => {
    switch (action) {
      case 'edit':
        Alert.alert('Edit Class', `Edit ${classItem.title}`);
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Class',
          `Are you sure you want to cancel ${classItem.title}?`,
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', style: 'destructive' },
          ]
        );
        break;
      case 'view':
        Alert.alert('View Details', `View details for ${classItem.title}`);
        break;
    }
  };

  const renderClassCard = (classItem: ClassItem) => (
    <View key={classItem.id} style={styles.classCard}>
      <View style={styles.classHeader}>
        <View style={styles.classInfo}>
          <Text style={styles.classTitle}>{classItem.title}</Text>
          <Text style={styles.classDate}>{formatDate(classItem.date)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(classItem.status) }]}>
          <Text style={styles.statusText}>{classItem.status}</Text>
        </View>
      </View>

      <View style={styles.classDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{classItem.duration} min</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            {classItem.studentsEnrolled}
            {classItem.maxStudents ? `/${classItem.maxStudents}` : ''} students
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons 
            name={classItem.type === 'LIVE' ? 'radio-outline' : 'videocam-outline'} 
            size={16} 
            color="#6b7280" 
          />
          <Text style={styles.detailText}>{classItem.type}</Text>
        </View>
      </View>

      <View style={styles.classActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleClassAction(classItem, 'view')}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        
        {classItem.status === 'SCHEDULED' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleClassAction(classItem, 'edit')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleClassAction(classItem, 'cancel')}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Classes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Add Class', 'Navigate to add new class')}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({upcomingClasses.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedClasses.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' ? (
          upcomingClasses.length > 0 ? (
            upcomingClasses.map(renderClassCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No upcoming classes</Text>
              <Text style={styles.emptySubtitle}>Schedule your first class to get started</Text>
            </View>
          )
        ) : (
          completedClasses.length > 0 ? (
            completedClasses.map(renderClassCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No completed classes</Text>
              <Text style={styles.emptySubtitle}>Your completed classes will appear here</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10b981',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#10b981',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  classCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  classDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  classActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  viewButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  viewButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  editButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default TeacherClassesScreen;