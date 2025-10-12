import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  videoUrl: string;
  videoFileName: string;
  thumbnailUrl?: string;
  thumbnailFileName?: string;
  uploadedAt: string;
  uploadedBy: string;
}

const VIDEOS_STORAGE_KEY = 'admin_uploaded_videos';

/**
 * Save a video to local storage
 */
export const saveVideo = async (video: Omit<SavedVideo, 'id' | 'uploadedAt'>): Promise<SavedVideo> => {
  try {
    const videoWithId: SavedVideo = {
      ...video,
      id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date().toISOString(),
    };

    const existingVideos = await getVideos();
    const updatedVideos = [...existingVideos, videoWithId];
    
    await AsyncStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos));
    
    console.log('Video saved successfully:', videoWithId.id);
    return videoWithId;
  } catch (error) {
    console.error('Error saving video:', error);
    throw new Error('Failed to save video');
  }
};

/**
 * Get all saved videos
 */
export const getVideos = async (): Promise<SavedVideo[]> => {
  try {
    const videosJson = await AsyncStorage.getItem(VIDEOS_STORAGE_KEY);
    if (!videosJson) {
      return [];
    }
    
    const videos = JSON.parse(videosJson);
    // Sort by upload date, newest first
    return videos.sort((a: SavedVideo, b: SavedVideo) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  } catch (error) {
    console.error('Error getting videos:', error);
    return [];
  }
};

/**
 * Delete a video by ID
 */
export const deleteVideo = async (videoId: string): Promise<void> => {
  try {
    const existingVideos = await getVideos();
    const updatedVideos = existingVideos.filter(video => video.id !== videoId);
    
    await AsyncStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos));
    console.log('Video deleted successfully:', videoId);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw new Error('Failed to delete video');
  }
};

/**
 * Update a video
 */
export const updateVideo = async (videoId: string, updates: Partial<SavedVideo>): Promise<SavedVideo> => {
  try {
    const existingVideos = await getVideos();
    const videoIndex = existingVideos.findIndex(video => video.id === videoId);
    
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }
    
    const updatedVideo = { ...existingVideos[videoIndex], ...updates };
    existingVideos[videoIndex] = updatedVideo;
    
    await AsyncStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(existingVideos));
    console.log('Video updated successfully:', videoId);
    
    return updatedVideo;
  } catch (error) {
    console.error('Error updating video:', error);
    throw new Error('Failed to update video');
  }
};

/**
 * Get a single video by ID
 */
export const getVideoById = async (videoId: string): Promise<SavedVideo | null> => {
  try {
    const videos = await getVideos();
    return videos.find(video => video.id === videoId) || null;
  } catch (error) {
    console.error('Error getting video by ID:', error);
    return null;
  }
};

/**
 * Clear all videos (for testing/debugging)
 */
export const clearAllVideos = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(VIDEOS_STORAGE_KEY);
    console.log('All videos cleared');
  } catch (error) {
    console.error('Error clearing videos:', error);
    throw new Error('Failed to clear videos');
  }
};

/**
 * Get videos by user ID
 */
export const getVideosByUser = async (userId: string): Promise<SavedVideo[]> => {
  try {
    const allVideos = await getVideos();
    return allVideos.filter(video => video.uploadedBy === userId);
  } catch (error) {
    console.error('Error getting videos by user:', error);
    return [];
  }
};