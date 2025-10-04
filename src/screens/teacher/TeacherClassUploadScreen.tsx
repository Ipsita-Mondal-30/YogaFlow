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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../services/supabase';

interface ClassFormData {
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  price: string;
  classType: 'recorded' | 'live';
  scheduledDate: string;
  scheduledTime: string;
}

const TeacherClassUploadScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: '',
    videoUrl: '',
    thumbnailUrl: '',
    price: '',
    classType: 'recorded',
    scheduledDate: '',
    scheduledTime: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<any>(null);

  const handleInputChange = (field: keyof ClassFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoUpload = async () => {
    try {
      setVideoUploading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedVideo(file);
        
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `videos/${fileName}`;

        // Upload to Supabase Storage
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: file.mimeType || 'video/mp4',
          name: fileName,
        } as any);

        const { data, error } = await supabase.storage
          .from('class-videos')
          .upload(filePath, formData);

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('class-videos')
          .getPublicUrl(filePath);

        handleInputChange('videoUrl', publicUrl);
        Alert.alert('Success', 'Video uploaded successfully!');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleThumbnailUpload = async () => {
    try {
      setThumbnailUploading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedThumbnail(file);
        
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        // Upload to Supabase Storage
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: file.mimeType || 'image/jpeg',
          name: fileName,
        } as any);

        const { data, error } = await supabase.storage
          .from('class-thumbnails')
          .upload(filePath, formData);

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('class-thumbnails')
          .getPublicUrl(filePath);

        handleInputChange('thumbnailUrl', publicUrl);
        Alert.alert('Success', 'Thumbnail uploaded successfully!');
      }
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      Alert.alert('Error', 'Failed to upload thumbnail. Please try again.');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleUploadClass = async () => {
    // Validate form
    if (!formData.title || !formData.description || !formData.duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.classType === 'recorded' && !formData.videoUrl) {
      Alert.alert('Error', 'Please upload a video for recorded classes');
      return;
    }

    if (formData.classType === 'live' && (!formData.scheduledDate || !formData.scheduledTime)) {
      Alert.alert('Error', 'Please select date and time for live classes');
      return;
    }

    setIsUploading(true);
    try {
      // Get teacher's user data from Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user?.id)
        .single();

      if (userError || !userData) {
        throw new Error('Failed to get user data');
      }

      // Prepare class data
      const isLive = formData.classType === 'live';
      let startAt = null;
      
      if (isLive && formData.scheduledDate && formData.scheduledTime) {
        startAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`).toISOString();
      }

      // Insert class into database
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .insert({
          title: formData.title,
          description: formData.description,
          duration: parseInt(formData.duration),
          difficulty: formData.difficulty.toLowerCase(),
          category: formData.category,
          video_url: formData.videoUrl || null,
          thumbnail_url: formData.thumbnailUrl || null,
          price: parseFloat(formData.price) || 0,
          teacher_id: userData.id,
          is_live: isLive,
          start_at: startAt,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (classError) {
        throw classError;
      }

      const successMessage = formData.classType === 'live' 
        ? 'Live class scheduled successfully!' 
        : 'Recorded class uploaded successfully!';
      
      Alert.alert('Success', successMessage, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Class upload error:', error);
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

        {/* Class Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Class Type</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                formData.classType === 'recorded' && styles.selectedOption
              ]}
              onPress={() => handleInputChange('classType', 'recorded')}
            >
              <Text style={[
                styles.optionText,
                formData.classType === 'recorded' && styles.selectedOptionText
              ]}>
                📹 Recorded
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                formData.classType === 'live' && styles.selectedOption
              ]}
              onPress={() => handleInputChange('classType', 'live')}
            >
              <Text style={[
                styles.optionText,
                formData.classType === 'live' && styles.selectedOptionText
              ]}>
                🔴 Live
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Class Scheduling */}
        {formData.classType === 'live' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Scheduled Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.scheduledDate}
                onChangeText={(value) => handleInputChange('scheduledDate', value)}
                placeholder="YYYY-MM-DD (e.g., 2024-12-25)"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Scheduled Time *</Text>
              <TextInput
                style={styles.input}
                value={formData.scheduledTime}
                onChangeText={(value) => handleInputChange('scheduledTime', value)}
                placeholder="HH:MM (e.g., 14:30)"
                placeholderTextColor="#999"
              />
            </View>
          </>
        )}

        {/* Video Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Video {formData.classType === 'recorded' ? '*' : '(Optional for live classes)'}
          </Text>
          {selectedVideo ? (
            <View style={styles.fileInfo}>
              <Ionicons name="videocam" size={20} color="#10b981" />
              <Text style={styles.fileName}>{selectedVideo.name}</Text>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={formData.videoUrl}
              onChangeText={(value) => handleInputChange('videoUrl', value)}
              placeholder="Enter video URL or upload video file"
              placeholderTextColor="#999"
            />
          )}
          <TouchableOpacity 
            style={[styles.uploadButton, videoUploading && styles.disabledButton]} 
            onPress={handleVideoUpload}
            disabled={videoUploading}
          >
            {videoUploading ? (
              <ActivityIndicator size="small" color="#6B73FF" />
            ) : (
              <Ionicons name="cloud-upload-outline" size={20} color="#6B73FF" />
            )}
            <Text style={styles.uploadButtonText}>
              {videoUploading ? 'Uploading...' : 'Upload Video'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnail */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Thumbnail</Text>
          {selectedThumbnail ? (
            <View style={styles.thumbnailPreview}>
              <Image source={{ uri: selectedThumbnail.uri }} style={styles.previewImage} />
              <View style={styles.fileInfo}>
                <Ionicons name="image" size={20} color="#10b981" />
                <Text style={styles.fileName}>{selectedThumbnail.name}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.thumbnailUpload, thumbnailUploading && styles.disabledButton]} 
              onPress={handleThumbnailUpload}
              disabled={thumbnailUploading}
            >
              {thumbnailUploading ? (
                <ActivityIndicator size="large" color="#6B73FF" />
              ) : (
                <Ionicons name="image-outline" size={40} color="#999" />
              )}
              <Text style={styles.uploadText}>
                {thumbnailUploading ? 'Uploading...' : 'Upload Thumbnail'}
              </Text>
            </TouchableOpacity>
          )}
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
            <Text style={styles.uploadClassButtonText}>
              {formData.classType === 'live' ? 'Scheduling...' : 'Uploading...'}
            </Text>
          ) : (
            <Text style={styles.uploadClassButtonText}>
              {formData.classType === 'live' ? 'Schedule Live Class' : 'Upload Recorded Class'}
            </Text>
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
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
    marginBottom: 10,
  },
  fileName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  thumbnailPreview: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
});

export default TeacherClassUploadScreen;