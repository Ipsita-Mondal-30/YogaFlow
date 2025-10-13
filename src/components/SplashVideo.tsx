import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur'; // Uncomment when expo-blur is installed
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

interface SplashVideoProps {
  onFinish: () => void;
}

export default function SplashVideo({ onFinish }: SplashVideoProps) {
  const videoRef = useRef<Video>(null);
  const [showBlur, setShowBlur] = useState(false);
  const blurOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fallback timer - only if video doesn't finish naturally
    const fallbackTimer = setTimeout(() => {
      if (!showBlur) {
        handleVideoEnd();
      }
    }, 15000); // 15 second fallback

    return () => clearTimeout(fallbackTimer);
  }, [onFinish, showBlur]);

  const handleVideoEnd = () => {
    setShowBlur(true);
    
    // Animate blur in
    Animated.timing(blurOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Wait 1 second with blur, then finish
      setTimeout(() => {
        onFinish();
      }, 1000);
    });
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish && !showBlur) {
      handleVideoEnd();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Video Background */}
      <Video
        ref={videoRef}
        style={styles.video}
        source={require('../assets/yoga.mp4')}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* Overlay Gradient */}
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.3)',
          'rgba(255, 138, 101, 0.2)',
          'rgba(93, 78, 117, 0.4)'
        ]}
        style={styles.overlay}
      />

      {/* Blur Transition */}
      {showBlur && (
        <Animated.View
          style={[
            styles.blurContainer,
            {
              opacity: blurOpacity,
            },
          ]}
        >
          {/* Alternative blur effect using gradient */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.blurView}
          />
        </Animated.View>
      )}

      {/* Logo/Branding could go here */}
      <View style={styles.brandingContainer}>
        {/* You can add your logo or app name here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  blurView: {
    flex: 1,
  },
  brandingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});