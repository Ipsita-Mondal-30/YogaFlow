import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

interface ActiveUser {
  id: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
}

export default function WorldMap() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: ActiveUser[] = [
      { id: '1', country: 'USA', city: 'New York', latitude: 40.7128, longitude: -74.0060, isOnline: true },
      { id: '2', country: 'India', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777, isOnline: true },
      { id: '3', country: 'UK', city: 'London', latitude: 51.5074, longitude: -0.1278, isOnline: true },
      { id: '4', country: 'Australia', city: 'Sydney', latitude: -33.8688, longitude: 151.2093, isOnline: true },
      { id: '5', country: 'Canada', city: 'Toronto', latitude: 43.6532, longitude: -79.3832, isOnline: true },
      { id: '6', country: 'Germany', city: 'Berlin', latitude: 52.5200, longitude: 13.4050, isOnline: true },
      { id: '7', country: 'Japan', city: 'Tokyo', latitude: 35.6762, longitude: 139.6503, isOnline: true },
      { id: '8', country: 'Brazil', city: 'São Paulo', latitude: -23.5505, longitude: -46.6333, isOnline: true },
    ];
    setActiveUsers(mockUsers);
  }, []);

  const getRegionUsers = (region: string) => {
    switch (region) {
      case 'North America':
        return activeUsers.filter(user => ['USA', 'Canada'].includes(user.country));
      case 'Europe':
        return activeUsers.filter(user => ['UK', 'Germany'].includes(user.country));
      case 'Asia':
        return activeUsers.filter(user => ['India', 'Japan'].includes(user.country));
      case 'Oceania':
        return activeUsers.filter(user => ['Australia'].includes(user.country));
      case 'South America':
        return activeUsers.filter(user => ['Brazil'].includes(user.country));
      default:
        return [];
    }
  };

  const regions = [
    { name: 'North America', icon: '🇺🇸', color: colors.primary },
    { name: 'Europe', icon: '🇪🇺', color: colors.teal },
    { name: 'Asia', icon: '🇮🇳', color: colors.purple },
    { name: 'Oceania', icon: '🇦🇺', color: colors.mint },
    { name: 'South America', icon: '🇧🇷', color: colors.orange },
  ];

  return (
    <GlassCard intensity="light" style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="globe" size={24} color={colors.primary} />
        <Text style={styles.title}>Global Yoga Community</Text>
      </View>
      
      <Text style={styles.subtitle}>
        {activeUsers.length} practitioners online now
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.regionsScroll}>
        {regions.map((region) => {
          const regionUsers = getRegionUsers(region.name);
          return (
            <View key={region.name} style={[styles.regionCard, { borderColor: region.color }]}>
              <Text style={styles.regionIcon}>{region.icon}</Text>
              <Text style={styles.regionName}>{region.name}</Text>
              <View style={styles.userCount}>
                <View style={[styles.onlineDot, { backgroundColor: region.color }]} />
                <Text style={styles.countText}>{regionUsers.length}</Text>
              </View>
              
              {regionUsers.slice(0, 2).map((user) => (
                <View key={user.id} style={styles.userItem}>
                  <View style={[styles.statusDot, { backgroundColor: colors.teal }]} />
                  <Text style={styles.userCity}>{user.city}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Join practitioners from around the world in live sessions
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  regionsScroll: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  regionCard: {
    width: 120,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 15,
    alignItems: 'center',
  },
  regionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  regionName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  userCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  userCity: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});