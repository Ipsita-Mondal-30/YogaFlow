import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const [currentScene, setCurrentScene] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateXAnim = useRef(new Animated.Value(-width)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const lightAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  const scenes = [
    {
      id: 0,
      title: "The Journey Begins",
      description: "A seeker approaches the bridge of transformation",
      duration: 1200,
    },
    {
      id: 1,
      title: "Crossing the Bridge",
      description: "Over the flowing river of consciousness",
      duration: 1200,
    },
    {
      id: 2,
      title: "Into the Sacred Forest",
      description: "Where ancient wisdom whispers through the trees",
      duration: 1200,
    },
    {
      id: 3,
      title: "The Buddha's Blessing",
      description: "Finding enlightenment under the Bodhi tree",
      duration: 1200,
    },
    {
      id: 4,
      title: "The Sacred Cave",
      description: "Yoga Flow - Gateway to inner transformation",
      duration: 1200,
    },
    {
      id: 5,
      title: "Inner Practice",
      description: "Joining souls in meditation and sacred asanas",
      duration: 1200,
    },
    {
      id: 6,
      title: "Transformation Complete",
      description: "Emerging as your highest, most peaceful self",
      duration: 1500,
    },
  ];

  useEffect(() => {
    startAnimation();
  }, []);

  useEffect(() => {
    if (currentScene < scenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScene(prev => prev + 1);
        startSceneAnimation();
      }, scenes[currentScene].duration);
      return () => clearTimeout(timer);
    } else {
      // Final scene - trigger finish after a delay
      const finishTimer = setTimeout(() => {
        onFinish();
      }, 2000);
      return () => clearTimeout(finishTimer);
    }
  }, [currentScene]);

  const startAnimation = () => {
    // Initial fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startSceneAnimation = () => {
    // Reset and animate for each scene
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Scene-specific animations
    switch (currentScene) {
      case 1: // Crossing bridge
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        break;
      case 2: // Forest
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }).start();
        break;
      case 3: // Buddha
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        break;
      case 6: // Transformation light
        Animated.parallel([
          Animated.timing(lightAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(particleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.2,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
        break;
    }
  };

  const getSceneBackground = (): readonly [string, string, string] => {
    switch (currentScene) {
      case 0:
      case 1:
        return ['#87CEEB', '#4682B4', '#2F4F4F'] as const; // River/Bridge
      case 2:
        return ['#228B22', '#006400', '#2F4F2F'] as const; // Forest
      case 3:
        return ['#DAA520', '#B8860B', '#8B7355'] as const; // Buddha/Temple
      case 4:
        return ['#696969', '#2F2F2F', '#000000'] as const; // Cave entrance
      case 5:
        return ['#4B0082', '#301934', '#1a0d1a'] as const; // Inside cave
      case 6:
        return ['#FFD700', '#FFA500', '#FF6347'] as const; // Transformation light
      default:
        return [colors.primary, colors.primaryLight, colors.secondary] as const;
    }
  };

  const getSceneIcon = () => {
    switch (currentScene) {
      case 0:
        return 'walk';
      case 1:
        return 'bridge';
      case 2:
        return 'leaf';
      case 3:
        return 'flower';
      case 4:
        return 'cave';
      case 5:
        return 'people';
      case 6:
        return 'sunny';
      default:
        return 'heart';
    }
  };

  const renderCharacter = () => {
    const isTransformed = currentScene === 6;
    const isMeditating = currentScene === 5;
    
    return (
      <Animated.View
        style={[
          styles.character,
          {
            transform: [
              { translateX: translateXAnim },
              { scale: scaleAnim },
              { 
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              },
            ],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={[
          styles.characterBody,
          isTransformed && styles.transformedCharacter,
          isMeditating && styles.meditatingCharacter,
        ]}>
          {isMeditating ? (
            <Text style={styles.meditatingEmoji}>🧘‍♂️</Text>
          ) : (
            <Ionicons 
              name={isTransformed ? "happy" : "person"} 
              size={isTransformed ? 70 : 60} 
              color={isTransformed ? "#FFD700" : colors.textWhite} 
            />
          )}
          
          {isTransformed && (
            <>
              <Animated.View
                style={[
                  styles.aura,
                  {
                    opacity: lightAnim,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.innerAura,
                  {
                    opacity: lightAnim,
                    transform: [{ scale: lightAnim }],
                  },
                ]}
              />
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderSceneElements = () => {
    switch (currentScene) {
      case 1: // Bridge
        return (
          <View style={styles.bridge}>
            <View style={styles.bridgeRail} />
            <View style={styles.river} />
          </View>
        );
      case 2: // Forest
        return (
          <View style={styles.forest}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name="leaf"
                size={30 + i * 5}
                color="#228B22"
                style={[styles.tree, { left: 50 + i * 60, top: 200 + i * 20 }]}
              />
            ))}
          </View>
        );
      case 3: // Buddha
        return (
          <View style={styles.buddhaScene}>
            <Animated.View
              style={[
                styles.buddha,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                },
              ]}
            >
              <Ionicons name="flower" size={80} color="#DAA520" />
              <Text style={styles.buddhaText}>🧘‍♂️</Text>
            </Animated.View>
          </View>
        );
      case 4: // Cave entrance
        return (
          <View style={styles.caveEntrance}>
            <View style={styles.cave}>
              <Text style={styles.caveText}>YOGA FLOW</Text>
              <View style={styles.logo}>
                <Ionicons name="leaf" size={40} color={colors.primary} />
              </View>
            </View>
          </View>
        );
      case 5: // Inside cave
        return (
          <View style={styles.insideCave}>
            {[...Array(4)].map((_, i) => (
              <View key={i} style={[styles.meditator, { left: 80 + i * 50, top: 300 + (i % 2) * 40 }]}>
                <Text style={styles.meditatorEmoji}>🧘‍♀️</Text>
              </View>
            ))}
          </View>
        );
      case 6: // Transformation
        return (
          <View style={styles.transformationScene}>
            <Animated.View
              style={[
                styles.transformationLight,
                {
                  opacity: lightAnim,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Ionicons name="sunny" size={120} color="#FFD700" />
            </Animated.View>
            
            {/* Particle effects */}
            {[...Array(8)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    left: 50 + i * 40,
                    top: 200 + (i % 3) * 100,
                    opacity: particleAnim,
                    transform: [
                      {
                        translateY: particleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -50],
                        }),
                      },
                      { scale: particleAnim },
                    ],
                  },
                ]}
              >
                <Ionicons name="sparkles" size={20} color="#FFD700" />
              </Animated.View>
            ))}
            
            {/* Lotus petals */}
            {[...Array(6)].map((_, i) => (
              <Animated.View
                key={`lotus-${i}`}
                style={[
                  styles.lotusPetal,
                  {
                    transform: [
                      { rotate: `${i * 60}deg` },
                      { scale: lightAnim },
                    ],
                    opacity: lightAnim,
                  },
                ]}
              >
                <Ionicons name="leaf" size={30} color="#FF69B4" />
              </Animated.View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <LinearGradient
        colors={getSceneBackground() as [string, string, string]}
        style={styles.background}
      >
        {/* Scene Elements */}
        {renderSceneElements()}
        
        {/* Character */}
        {renderCharacter()}
        
        {/* Scene Info */}
        <Animated.View
          style={[
            styles.sceneInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <View style={styles.sceneIconContainer}>
            <Ionicons name={getSceneIcon() as any} size={40} color={colors.textWhite} />
          </View>
          <Text style={styles.sceneTitle}>{scenes[currentScene]?.title}</Text>
          <Text style={styles.sceneDescription}>{scenes[currentScene]?.description}</Text>
        </Animated.View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {scenes.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentScene && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Yoga Flow Branding (appears in final scenes) */}
        {currentScene >= 4 && (
          <Animated.View
            style={[
              styles.branding,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.brandTitle}>YOGA FLOW</Text>
            <Text style={styles.brandSubtitle}>Transform Your Journey</Text>
          </Animated.View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    position: 'absolute',
    bottom: height * 0.4,
    left: width * 0.1,
  },
  characterBody: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  meditatingCharacter: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
  },
  meditatingEmoji: {
    fontSize: 60,
  },
  transformedCharacter: {
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  aura: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    top: -30,
    left: -30,
  },
  innerAura: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: -10,
    left: -10,
  },
  bridge: {
    position: 'absolute',
    bottom: height * 0.3,
    width: width * 0.8,
    height: 20,
  },
  bridgeRail: {
    width: '100%',
    height: 10,
    backgroundColor: '#8B4513',
    borderRadius: 5,
  },
  river: {
    position: 'absolute',
    bottom: -30,
    width: '120%',
    height: 40,
    backgroundColor: '#4682B4',
    opacity: 0.7,
  },
  forest: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  tree: {
    position: 'absolute',
  },
  buddhaScene: {
    position: 'absolute',
    top: height * 0.3,
    alignItems: 'center',
  },
  buddha: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  buddhaText: {
    fontSize: 60,
    marginTop: 10,
  },
  caveEntrance: {
    position: 'absolute',
    top: height * 0.2,
    alignItems: 'center',
  },
  cave: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 100,
    width: 200,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  caveText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insideCave: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  meditator: {
    position: 'absolute',
  },
  meditatorEmoji: {
    fontSize: 30,
  },
  transformationScene: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transformationLight: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
  },
  particle: {
    position: 'absolute',
  },
  lotusPetal: {
    position: 'absolute',
    top: height * 0.5 - 15,
    left: width * 0.5 - 15,
  },
  sceneInfo: {
    position: 'absolute',
    top: height * 0.15,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  sceneIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  sceneTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sceneDescription: {
    fontSize: 16,
    color: colors.textWhite,
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: colors.textWhite,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  branding: {
    position: 'absolute',
    bottom: 200,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textWhite,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});