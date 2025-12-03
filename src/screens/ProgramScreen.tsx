import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import ProfileButton from '../components/ProfileButton';
import PlansScreen from './PlansScreen';
import CurriculumScreen from './CurriculumScreen';

export default function ProgramScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'plans' | 'curriculum'>('plans');

  return (
    <SafeAreaView style={styles.container}>
      <ProfileButton />
      <LinearGradient
        colors={[colors.primary, colors.secondaryLight]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Program</Text>
        <Text style={styles.headerSubtitle}>Your yoga journey</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'plans' && styles.activeTab]}
          onPress={() => setActiveTab('plans')}
        >
          <Ionicons
            name="diamond"
            size={20}
            color={activeTab === 'plans' ? colors.white : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'plans' && styles.activeTabText]}>
            Plans
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'curriculum' && styles.activeTab]}
          onPress={() => setActiveTab('curriculum')}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={activeTab === 'curriculum' ? colors.white : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'curriculum' && styles.activeTabText]}>
            Curriculum
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'plans' ? (
          <PlansScreen />
        ) : (
          <CurriculumScreen />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textOnTeal,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textOnTeal,
    opacity: 0.95,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.white,
  },
  content: {
    flex: 1,
  },
});
