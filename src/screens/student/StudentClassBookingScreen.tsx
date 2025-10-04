import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface YogaClass {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  price: number;
  rating: number;
  studentsEnrolled: number;
  maxStudents: number;
  description: string;
  schedule: {
    date: string;
    time: string;
  }[];
  thumbnail: string;
  isBookmarked: boolean;
}

const StudentClassBookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');

  // Mock data for available classes
  const availableClasses: YogaClass[] = [
    {
      id: '1',
      title: 'Morning Flow',
      instructor: 'Sarah Johnson',
      duration: 60,
      difficulty: 'Beginner',
      category: 'Vinyasa',
      price: 25,
      rating: 4.8,
      studentsEnrolled: 12,
      maxStudents: 20,
      description: 'Start your day with gentle flowing movements and mindful breathing.',
      schedule: [
        { date: '2024-01-15', time: '07:00 AM' },
        { date: '2024-01-16', time: '07:00 AM' },
        { date: '2024-01-17', time: '07:00 AM' },
      ],
      thumbnail: 'https://via.placeholder.com/300x200',
      isBookmarked: false,
    },
    {
      id: '2',
      title: 'Power Yoga',
      instructor: 'Mike Chen',
      duration: 75,
      difficulty: 'Advanced',
      category: 'Power',
      price: 35,
      rating: 4.9,
      studentsEnrolled: 8,
      maxStudents: 15,
      description: 'High-intensity yoga practice to build strength and endurance.',
      schedule: [
        { date: '2024-01-15', time: '06:00 PM' },
        { date: '2024-01-17', time: '06:00 PM' },
      ],
      thumbnail: 'https://via.placeholder.com/300x200',
      isBookmarked: true,
    },
    {
      id: '3',
      title: 'Restorative Evening',
      instructor: 'Emma Wilson',
      duration: 90,
      difficulty: 'Beginner',
      category: 'Restorative',
      price: 30,
      rating: 4.7,
      studentsEnrolled: 15,
      maxStudents: 18,
      description: 'Gentle, relaxing practice perfect for unwinding after a long day.',
      schedule: [
        { date: '2024-01-16', time: '07:30 PM' },
        { date: '2024-01-18', time: '07:30 PM' },
      ],
      thumbnail: 'https://via.placeholder.com/300x200',
      isBookmarked: false,
    },
  ];

  const categories = ['All', 'Vinyasa', 'Hatha', 'Power', 'Yin', 'Restorative'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredClasses = availableClasses.filter(yogaClass => {
    const categoryMatch = selectedCategory === 'All' || yogaClass.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || yogaClass.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleBookClass = (yogaClass: YogaClass) => {
    setSelectedClass(yogaClass);
    setBookingModalVisible(true);
  };

  const confirmBooking = () => {
    if (!selectedSchedule) {
      Alert.alert('Error', 'Please select a schedule');
      return;
    }

    Alert.alert(
      'Booking Confirmed',
      `You have successfully booked "${selectedClass?.title}" for ${selectedSchedule}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setBookingModalVisible(false);
            setSelectedClass(null);
            setSelectedSchedule('');
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4ECDC4';
      case 'Intermediate': return '#FFE66D';
      case 'Advanced': return '#FF6B9D';
      default: return '#999';
    }
  };

  const ClassCard: React.FC<{ yogaClass: YogaClass }> = ({ yogaClass }) => (
    <View style={styles.classCard}>
      <Image source={{ uri: yogaClass.thumbnail }} style={styles.classThumbnail} />
      <TouchableOpacity style={styles.bookmarkButton}>
        <Ionicons
          name={yogaClass.isBookmarked ? 'heart' : 'heart-outline'}
          size={20}
          color={yogaClass.isBookmarked ? '#FF6B9D' : '#999'}
        />
      </TouchableOpacity>
      
      <View style={styles.classInfo}>
        <View style={styles.classHeader}>
          <Text style={styles.classTitle}>{yogaClass.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(yogaClass.difficulty) }]}>
            <Text style={styles.difficultyText}>{yogaClass.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.instructorName}>with {yogaClass.instructor}</Text>
        <Text style={styles.classDescription} numberOfLines={2}>{yogaClass.description}</Text>
        
        <View style={styles.classDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{yogaClass.duration} min</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.detailText}>{yogaClass.rating}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{yogaClass.studentsEnrolled}/{yogaClass.maxStudents}</Text>
          </View>
        </View>
        
        <View style={styles.classFooter}>
          <Text style={styles.price}>${yogaClass.price}</Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => handleBookClass(yogaClass)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Class</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <Text style={styles.filterLabel}>Category:</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.selectedFilter,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === category && styles.selectedFilterText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <Text style={styles.filterLabel}>Level:</Text>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.filterButton,
                selectedDifficulty === difficulty && styles.selectedFilter,
              ]}
              onPress={() => setSelectedDifficulty(difficulty)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === difficulty && styles.selectedFilterText,
                ]}
              >
                {difficulty}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Classes List */}
      <ScrollView style={styles.classesList}>
        {filteredClasses.map((yogaClass) => (
          <ClassCard key={yogaClass.id} yogaClass={yogaClass} />
        ))}
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Class</Text>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {selectedClass && (
              <>
                <Text style={styles.modalClassTitle}>{selectedClass.title}</Text>
                <Text style={styles.modalInstructor}>with {selectedClass.instructor}</Text>
                
                <Text style={styles.scheduleLabel}>Select Schedule:</Text>
                {selectedClass.schedule.map((schedule, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.scheduleOption,
                      selectedSchedule === `${schedule.date} at ${schedule.time}` && styles.selectedSchedule,
                    ]}
                    onPress={() => setSelectedSchedule(`${schedule.date} at ${schedule.time}`)}
                  >
                    <Text style={styles.scheduleDate}>{schedule.date}</Text>
                    <Text style={styles.scheduleTime}>{schedule.time}</Text>
                  </TouchableOpacity>
                ))}
                
                <View style={styles.modalFooter}>
                  <Text style={styles.modalPrice}>Total: ${selectedClass.price}</Text>
                  <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
                    <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterScroll: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
    alignSelf: 'center',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: '#6B73FF',
    borderColor: '#6B73FF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#333',
  },
  selectedFilterText: {
    color: '#fff',
  },
  classesList: {
    flex: 1,
    padding: 20,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classThumbnail: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  classInfo: {
    padding: 16,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  instructorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  classDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B73FF',
  },
  bookButton: {
    backgroundColor: '#6B73FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClassTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modalInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  scheduleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  scheduleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  selectedSchedule: {
    backgroundColor: '#6B73FF20',
    borderColor: '#6B73FF',
  },
  scheduleDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#6B73FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StudentClassBookingScreen;