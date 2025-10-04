import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface ClassFormData {
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  price: string;
}

const TeacherClassUploadScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: '',
    videoUrl: '',
    thumbnailUrl: '',
    price: '',
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: keyof ClassFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUploadClass = async () => {
    // Validate form
    if (!formData.title || !formData.description || !formData.duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    try {
      // TODO: Implement actual class upload logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
      Alert.alert('Success', 'Class uploaded successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload class. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];
  const categoryOptions = ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin', 'Restorative', 'Power'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload New Class</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        {/* Class Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Class Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            placeholder="Enter class title"
            placeholderTextColor="#999"
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Describe your class..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration (minutes) *</Text>
          <TextInput
            style={styles.input}
            value={formData.duration}
            onChangeText={(value) => handleInputChange('duration', value)}
            placeholder="e.g., 60"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Difficulty */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Difficulty Level</Text>
          <View style={styles.optionsContainer}>
            {difficultyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  formData.difficulty === option && styles.selectedOption
                ]}
                onPress={() => handleInputChange('difficulty', option as any)}
              >
                <Text style={[
                  styles.optionText,
                  formData.difficulty === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.optionsContainer}>
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.categoryButton,
                  formData.category === option && styles.selectedOption
                ]}
                onPress={() => handleInputChange('category', option)}
              >
                <Text style={[
                  styles.optionText,
                  formData.category === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Video Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Video URL</Text>
          <TextInput
            style={styles.input}
            value={formData.videoUrl}
            onChangeText={(value) => handleInputChange('videoUrl', value)}
            placeholder="Enter video URL or upload video"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="cloud-upload-outline" size={20} color="#6B73FF" />
            <Text style={styles.uploadButtonText}>Upload Video</Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnail */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Thumbnail</Text>
          <TouchableOpacity style={styles.thumbnailUpload}>
            <Ionicons name="image-outline" size={40} color="#999" />
            <Text style={styles.uploadText}>Upload Thumbnail</Text>
          </TouchableOpacity>
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[styles.uploadClassButton, isUploading && styles.disabledButton]}
          onPress={handleUploadClass}
          disabled={isUploading}
        >
          {isUploading ? (
            <Text style={styles.uploadClassButtonText}>Uploading...</Text>
          ) : (
            <Text style={styles.uploadClassButtonText}>Upload Class</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#6B73FF',
    borderColor: '#6B73FF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B73FF',
    backgroundColor: '#f8f9ff',
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B73FF',
    fontWeight: '500',
  },
  thumbnailUpload: {
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  uploadClassButton: {
    backgroundColor: '#6B73FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  uploadClassButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TeacherClassUploadScreen;