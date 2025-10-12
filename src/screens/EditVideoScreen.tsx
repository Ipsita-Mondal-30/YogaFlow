import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../utils/colors';
import { updateVideo, SavedVideo } from '../services/videoStorage';
import GlassCard from '../components/GlassCard';
import CustomNotification from '../components/CustomNotification';

interface EditVideoScreenProps {
  route: {
    params: {
      video: SavedVideo;
    };
  };
}

export default function EditVideoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { video } = (route.params as any) || {};

  const [videoData, setVideoData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    category: video?.category || '',
    duration: video?.duration || '',
    difficulty: video?.difficulty || 'Beginner',
    tags: video?.tags?.join(', ') || '',
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setVideoData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!video?.id) {
      setNotification({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Video ID not found. Cannot save changes.',
      });
      return;
    }

    if (!videoData.title.trim()) {
      setNotification({
        visible: true,
        type: 'warning',
        title: 'Missing Title',
        message: 'Please enter a video title.',
      });
      return;
    }

    if (!videoData.description.trim()) {
      setNotification({
        visible: true,
        type: 'warning',
        title: 'Missing Description',
        message: 'Please enter a video description.',
      });
      return;
    }

    try {
      setLoading(true);

      const updates = {
        title: videoData.title.trim(),
        description: videoData.description.trim(),
        category: videoData.category.trim() || 'General',
        duration: videoData.duration.trim(),
        difficulty: videoData.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        tags: videoData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      await updateVideo(video.id, updates);

      setNotification({
        visible: true,
        type: 'success',
        title: 'Video Updated!',
        message: 'Your video has been updated successfully.',
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error updating video:', error);
      setNotification({
        visible: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update video. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!video) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={styles.errorText}>Video not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Video</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Video Preview */}
        <GlassCard intensity="light" style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Video Preview</Text>
          </View>
          
          <View style={styles.videoPreview}>
            {video.thumbnailUrl ? (
              <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Ionicons name="videocam" size={40} color={colors.textSecondary} />
              </View>
            )}
            <View style={styles.videoInfo}>
              <Text style={styles.videoFileName}>{video.videoFileName}</Text>
              <Text style={styles.uploadDate}>
                Uploaded {new Date(video.uploadedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Edit Form */}
        <GlassCard intensity="medium" style={styles.formCard}>
          <Text style={styles.formTitle}>Video Information</Text>

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
        </GlassCard>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.saveGradient}
            >
              {loading ? (
                <Text style={styles.saveButtonText}>Saving...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={colors.textWhite} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomNotification
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginTop: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textWhite,
    textAlign: 'center',
    marginRight: 40, // Compensate for back button
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 120,
  },
  previewCard: {
    marginBottom: 20,
  },
  previewHeader: {
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  videoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  videoInfo: {
    flex: 1,
  },
  videoFileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  uploadDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  formCard: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.white,
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
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
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
    color: colors.textWhite,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.lightGray,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginLeft: 8,
  },
});