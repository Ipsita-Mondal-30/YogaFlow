import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface VideoPlayerScreenProps {
  route: {
    params: {
      videoUrl: string;
      title: string;
      description?: string;
      teacherName?: string;
    };
  };
}

export default function VideoPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoUrl, title, description, teacherName } = route.params as any;
  
  const [status, setStatus] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const video = useRef<Video>(null);

  const handlePlaybackStatusUpdate = (playbackStatus: any) => {
    setStatus(playbackStatus);
    if (playbackStatus.isLoaded) {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (status.isPlaying) {
      video.current?.pauseAsync();
    } else {
      video.current?.playAsync();
    }
  };

  const handleRewind = () => {
    if (status.positionMillis) {
      const newPosition = Math.max(0, status.positionMillis - 10000); // 10 seconds back
      video.current?.setPositionAsync(newPosition);
    }
  };

  const handleFastForward = () => {
    if (status.positionMillis && status.durationMillis) {
      const newPosition = Math.min(
        status.durationMillis,
        status.positionMillis + 10000
      ); // 10 seconds forward
      video.current?.setPositionAsync(newPosition);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          {teacherName && (
            <Text style={styles.headerSubtitle}>with {teacherName}</Text>
          )}
        </View>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: videoUrl }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          shouldPlay={false}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
        
        {/* Custom Controls */}
        {!isLoading && (
          <View style={styles.controlsOverlay}>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleRewind}
              >
                <Ionicons name="play-back" size={30} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, styles.playButton]}
                onPress={handlePlayPause}
              >
                <Ionicons
                  name={status.isPlaying ? 'pause' : 'play'}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleFastForward}
              >
                <Ionicons name="play-forward" size={30} color="white" />
              </TouchableOpacity>
            </View>
            
            {/* Progress Bar */}
            {status.durationMillis && (
              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>
                  {formatTime(status.positionMillis || 0)}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(
                          ((status.positionMillis || 0) / status.durationMillis) *
                          100
                        ).toFixed(1)}%` as any,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.timeText}>
                  {formatTime(status.durationMillis)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Description */}
      {description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About this class</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 15,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 35,
    padding: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  descriptionContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  descriptionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
  },
});