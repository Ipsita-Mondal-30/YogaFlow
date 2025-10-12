import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground';
import GlassCard from '../components/GlassCard';
import { getVideos, deleteVideo, SavedVideo } from '../services/videoStorage';

// SavedVideo interface is now imported from videoStorage service

export default function AdminVideosScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [videos, setVideos] = useState<SavedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  // Refresh videos when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadVideos();
    }, [user?.id])
  );

  const loadVideos = async () => {
    try {
      console.log('Loading videos from storage...');
      const allVideos = await getVideos();

      // Filter videos by current user if needed
      const userVideos = user?.id
        ? allVideos.filter(video => video.uploadedBy === user.id)
        : allVideos;

      console.log('Loaded videos:', userVideos.length);
      setVideos(userVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
      Alert.alert('Error', 'Failed to load videos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVideos();
  };

  const handleDeleteVideo = (videoId: string) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVideo(videoId);
              setVideos(prev => prev.filter(video => video.id !== videoId));
              Alert.alert('Success', 'Video deleted successfully');
            } catch (error) {
              console.error('Error deleting video:', error);
              Alert.alert('Error', 'Failed to delete video. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEditVideo = (video: SavedVideo) => {
    (navigation as any).navigate('EditVideo', { video });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return colors.teal;
      case 'Intermediate':
        return colors.primary;
      case 'Advanced':
        return colors.purple;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <TexturedBackground variant="subtle">
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.header}
        >
          <Text style={styles.title}>My Videos</Text>
          <Text style={styles.subtitle}>
            Manage your uploaded yoga videos
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {videos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="videocam-outline" size={64} color={colors.lightGray} />
              <Text style={styles.emptyTitle}>No Videos Yet</Text>
              <Text style={styles.emptyText}>
                Upload your first yoga video to get started
              </Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => (navigation as any).navigate('Upload')}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.uploadGradient}
                >
                  <Ionicons name="add" size={20} color={colors.textWhite} />
                  <Text style={styles.uploadButtonText}>Upload Video</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.videosContainer}>
              {videos.map((video) => (
                <GlassCard key={video.id} intensity="medium" style={styles.videoCard}>
                  <View style={styles.videoHeader}>
                    {video.thumbnailUrl ? (
                      <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
                    ) : (
                      <View style={styles.thumbnailPlaceholder}>
                        <Ionicons name="videocam" size={32} color={colors.textSecondary} />
                      </View>
                    )}

                    <View style={styles.videoInfo}>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {video.title}
                      </Text>
                      <Text style={styles.videoCategory}>{video.category}</Text>

                      <View style={styles.videoMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="time" size={14} color={colors.textSecondary} />
                          <Text style={styles.metaText}>{video.duration}</Text>
                        </View>
                        <View style={[
                          styles.difficultyBadge,
                          { backgroundColor: getDifficultyColor(video.difficulty) }
                        ]}>
                          <Text style={styles.difficultyText}>{video.difficulty}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.videoDescription} numberOfLines={3}>
                    {video.description}
                  </Text>

                  <View style={styles.tagsContainer}>
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.videoFooter}>
                    <Text style={styles.uploadDate}>
                      Uploaded {formatDate(video.uploadedAt)}
                    </Text>

                    <View style={styles.videoActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditVideo(video)}
                      >
                        <Ionicons name="create" size={16} color={colors.primary} />
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteActionButton]}
                        onPress={() => handleDeleteVideo(video.id)}
                      >
                        <Ionicons name="trash" size={16} color={colors.error} />
                        <Text style={[styles.actionButtonText, styles.deleteActionText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </TexturedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingBottom: 120, // Space for tab navigator
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  uploadButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  videosContainer: {
    padding: 20,
    gap: 20,
  },
  videoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  videoHeader: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 4,
    lineHeight: 24,
  },
  videoCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  videoDescription: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  videoFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  uploadDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  videoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  deleteActionButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  deleteActionText: {
    color: colors.error,
  },
});