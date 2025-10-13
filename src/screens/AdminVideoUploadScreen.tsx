import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { colors } from '../utils/colors';
import { useUserRole } from '../hooks/useUserRole';
// Cloudinary imports removed - using local file handling for now
import GlassCard from '../components/GlassCard';
import { saveVideo } from '../services/videoStorage';

interface VideoData {
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string;
}

interface UploadedFile {
  uri: string;
  name: string;
  cloudinaryResponse?: {
    public_id: string;
    secure_url: string;
    url: string;
    format: string;
    resource_type: string;
    bytes: number;
    duration?: number;
    width?: number;
    height?: number;
    created_at: string;
  };
}

const AdminVideoUploadScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  
  const [videoData, setVideoData] = useState<VideoData>({
    title: '',
    description: '',
    category: '',
    duration: '',
    difficulty: 'Beginner',
    tags: '',
  });
  
  const [selectedVideo, setSelectedVideo] = useState<UploadedFile | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<UploadedFile | null>(null);
  // Progress tracking removed for simplified implementation
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (!roleLoading && !isAdmin) {
      Alert.alert(
        'Access Denied',
        'You need admin privileges to access this screen.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [isAdmin, roleLoading, navigation]);

  const handleInputChange = (field: keyof VideoData, value: string) => {
    setVideoData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        // For now, just store the local file info
        // In a real implementation, you would upload to your preferred service
        setSelectedVideo({
          uri: file.uri,
          name: file.name,
          // Mock cloudinary response for now
          cloudinaryResponse: {
            public_id: `local_${Date.now()}`,
            secure_url: file.uri,
            url: file.uri,
            format: 'mp4',
            resource_type: 'video',
            bytes: file.size || 0,
            created_at: new Date().toISOString(),
          },
        });

        Alert.alert('Success', 'Video selected successfully! You can now add details and save.');
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to select video file.');
    }
  };

  const handleThumbnailUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        // For now, just store the local file info
        setSelectedThumbnail({
          uri: file.uri,
          name: `thumbnail-${Date.now()}.jpg`,
          // Mock cloudinary response for now
          cloudinaryResponse: {
            public_id: `thumbnail_${Date.now()}`,
            secure_url: file.uri,
            url: file.uri,
            format: 'jpg',
            resource_type: 'image',
            bytes: file.fileSize || 0,
            width: file.width,
            height: file.height,
            created_at: new Date().toISOString(),
          },
        });

        Alert.alert('Success', 'Thumbnail selected successfully!');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select thumbnail image.');
    }
  };

  const handleSaveVideo = async () => {
    if (!selectedVideo) {
      Alert.alert('Error', 'Please select a video first.');
      return;
    }

    if (!videoData.title.trim()) {
      Alert.alert('Error', 'Please enter a video title.');
      return;
    }

    if (!videoData.description.trim()) {
      Alert.alert('Error', 'Please enter a video description.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not found. Please sign in again.');
      return;
    }

    try {
      setIsSaving(true);

      // Prepare video data for saving
      const videoToSave = {
        title: videoData.title.trim(),
        description: videoData.description.trim(),
        category: videoData.category.trim() || 'General',
        duration: videoData.duration.trim(),
        difficulty: videoData.difficulty,
        tags: videoData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        videoUrl: selectedVideo.uri,
        videoFileName: selectedVideo.name,
        thumbnailUrl: selectedThumbnail?.uri || undefined,
        thumbnailFileName: selectedThumbnail?.name || undefined,
        uploadedBy: user.id,
      };

      // Actually save the video to local storage
      const savedVideo = await saveVideo(videoToSave);
      console.log('Video saved successfully:', savedVideo);
      
      Alert.alert(
        'Video Saved!',
        'Your video has been saved successfully and is now available in your Videos library.',
        [
          {
            text: 'Upload Another',
            onPress: () => {
              // Reset form
              setVideoData({
                title: '',
                description: '',
                category: '',
                duration: '',
                difficulty: 'Beginner',
                tags: '',
              });
              setSelectedVideo(null);
              setSelectedThumbnail(null);
            },
          },
          {
            text: 'View Videos',
            onPress: () => {
              // Navigate to Videos tab
              (navigation as any).navigate('Videos');
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Save video error:', error);
      Alert.alert('Error', 'Failed to save video. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (roleLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Ionicons name="lock-closed" size={64} color={colors.textSecondary} />
        <Text style={styles.accessDeniedText}>Access Denied</Text>
        <Text style={styles.accessDeniedSubtext}>
          You need admin privileges to upload videos.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Upload Video</Text>
        <View style={styles.placeholder} />
      </View>

      <GlassCard style={styles.formCard}>
        {/* Video Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video File</Text>
          {selectedVideo ? (
            <View style={styles.videoPreviewContainer}>
              <Video
                source={{ uri: selectedVideo.uri }}
                style={styles.videoPreview}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
              />
              <View style={styles.videoInfo}>
                <Text style={styles.fileName}>{selectedVideo.name}</Text>
                <Text style={styles.fileSize}>
                  {selectedVideo.cloudinaryResponse?.bytes 
                    ? `${(selectedVideo.cloudinaryResponse.bytes / (1024 * 1024)).toFixed(2)} MB`
                    : 'Size unknown'
                  }
                </Text>
              </View>
              <View style={styles.videoActions}>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={handleVideoUpload}
                >
                  <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
                  <Text style={styles.changeButtonText}>Change Video</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setSelectedVideo(null)}
                >
                  <Ionicons name="trash" size={16} color={colors.error} />
                  <Text style={styles.deleteButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleVideoUpload}
            >
              <Ionicons name="videocam-outline" size={24} color={colors.primary} />
              <Text style={styles.uploadButtonText}>Select Video File</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Thumbnail Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thumbnail (Optional)</Text>
          {selectedThumbnail ? (
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: selectedThumbnail.uri }} style={styles.thumbnailImage} />
              <View style={styles.thumbnailActions}>
                <TouchableOpacity
                  style={styles.changeThumbnailButton}
                  onPress={handleThumbnailUpload}
                >
                  <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
                  <Text style={styles.changeThumbnailText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteThumbnailButton}
                  onPress={() => setSelectedThumbnail(null)}
                >
                  <Ionicons name="trash" size={16} color={colors.error} />
                  <Text style={styles.deleteThumbnailText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleThumbnailUpload}
            >
              <Ionicons name="image-outline" size={24} color={colors.primary} />
              <Text style={styles.uploadButtonText}>Select Thumbnail</Text>
            </TouchableOpacity>
          )}

        </View>

        {/* Video Information Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={videoData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Enter video title"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={videoData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Enter video description"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={videoData.category}
              onChangeText={(value) => handleInputChange('category', value)}
              placeholder="e.g., Beginner Yoga, Advanced Flow"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              value={videoData.duration}
              onChangeText={(value) => handleInputChange('duration', value)}
              placeholder="e.g., 30 minutes"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Difficulty Level</Text>
            <View style={styles.difficultyContainer}>
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    videoData.difficulty === level && styles.selectedDifficulty,
                  ]}
                  onPress={() => handleInputChange('difficulty', level)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      videoData.difficulty === level && styles.selectedDifficultyText,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags (comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={videoData.tags}
              onChangeText={(value) => handleInputChange('tags', value)}
              placeholder="e.g., yoga, meditation, flexibility"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!selectedVideo || isSaving) && styles.disabledButton,
          ]}
          onPress={handleSaveVideo}
          disabled={!selectedVideo || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="save-outline" size={20} color="white" />
          )}
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Video'}
          </Text>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120, // Add bottom padding to prevent overlap with tab navigator
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundPrimary,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundPrimary,
    padding: 20,
  },
  accessDeniedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
  },
  accessDeniedSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  formCard: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.cardBackground,
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fileInfo: {
    marginLeft: 10,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  fileUrl: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  thumbnailContainer: {
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  // New styles for video preview and actions
  videoPreviewContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  videoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  videoInfo: {
    marginTop: 10,
    marginBottom: 15,
  },
  fileNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  changeButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  thumbnailActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
    justifyContent: 'center',
  },
  changeThumbnailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeThumbnailText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteThumbnailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteThumbnailText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
  },
  selectedDifficulty: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  difficultyText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  selectedDifficultyText: {
    color: 'white',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  saveButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default AdminVideoUploadScreen;