import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const { width } = Dimensions.get('window');

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', colors.white]}
        style={styles.tabBar}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const getLabel = (routeName: string) => {
            if (routeName === 'Upload') return 'Upload';
            if (routeName === 'Videos') return 'Videos';
            if (routeName === 'Chats') return 'Chat';
            if (routeName === 'Plans') return 'Plans';
            return routeName;
          };

          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : getLabel(route.name);

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIconName = (routeName: string, focused: boolean) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            
            if (routeName === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (routeName === 'Classes') {
              iconName = focused ? 'play-circle' : 'play-circle-outline';
            } else if (routeName === 'Plans') {
              iconName = focused ? 'diamond' : 'diamond-outline';
            } else if (routeName === 'Upload') {
              iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
            } else if (routeName === 'Videos') {
              iconName = focused ? 'videocam' : 'videocam-outline';
            } else if (routeName === 'Chats' || routeName === 'Community') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (routeName === 'Blog') {
              iconName = focused ? 'library' : 'library-outline';
            } else if (routeName === 'Asanas') {
              iconName = focused ? 'body' : 'body-outline';
            } else if (routeName === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'ellipse';
            }
            
            return iconName;
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              {isFocused && (
                <LinearGradient
                  colors={[colors.primaryLight, colors.primary]}
                  style={styles.activeBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <Ionicons
                  name={getIconName(route.name, isFocused)}
                  size={22}
                  color={isFocused ? colors.textWhite : colors.gray}
                />
              </View>
              <Text style={[
                styles.label,
                isFocused ? styles.activeLabel : styles.inactiveLabel
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25, // Slightly reduced bottom margin for better positioning
    left: 15,
    right: 15,
    zIndex: 1000, // Ensure tab bar appears above all content
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    borderRadius: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 25,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 22,
    marginHorizontal: 2,
    paddingVertical: 6,
  },
  activeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
  },
  iconContainer: {
    marginBottom: 2,
  },
  activeIconContainer: {
    transform: [{ scale: 1.05 }],
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeLabel: {
    color: colors.textWhite,
  },
  inactiveLabel: {
    color: colors.gray,
  },
});