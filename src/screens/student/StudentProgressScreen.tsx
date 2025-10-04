import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, ProgressChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

interface ProgressData {
  totalClasses: number;
  completedClasses: number;
  currentStreak: number;
  totalMinutes: number;
  favoriteStyle: string;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  unlocked: boolean;
  unlockedDate?: string;
}

const StudentProgressScreen = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements'>('overview');

  // Real progress data - starting values for new user
  const progressData: ProgressData = {
    totalClasses: 0,
    completedClasses: 0,
    currentStreak: 0,
    totalMinutes: 0,
    favoriteStyle: 'Not determined yet',
    weeklyGoal: 3, // Default goal
    weeklyProgress: 0,
  };

  // Real achievements data - all locked for new user
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first yoga class',
      icon: 'footsteps',
      unlocked: false,
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Practice for 7 consecutive days',
      icon: 'flame',
      unlocked: false,
    },
    {
      id: '3',
      title: 'Flexibility Master',
      description: 'Complete 20 flexibility-focused classes',
      icon: 'body',
      unlocked: false,
    },
    {
      id: '4',
      title: 'Mindful Meditator',
      description: 'Complete 10 meditation sessions',
      icon: 'leaf',
      unlocked: false,
    },
    {
      id: '5',
      title: 'Century Club',
      description: 'Complete 100 yoga classes',
      icon: 'trophy',
      unlocked: false,
    },
  ];

  // Real weekly activity data - no activity for new user
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#10b981',
    },
  };

  const progressRingData = {
    data: [progressData.weeklyProgress / progressData.weeklyGoal],
  };

  const progressRingConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    strokeWidth: 8,
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="play-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{progressData.completedClasses}</Text>
          <Text style={styles.statLabel}>Classes Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{progressData.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#8b5cf6" />
          <Text style={styles.statNumber}>{Math.floor(progressData.totalMinutes / 60)}h</Text>
          <Text style={styles.statLabel}>Total Practice</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="heart" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{progressData.favoriteStyle.split(' ')[0]}</Text>
          <Text style={styles.statLabel}>Favorite Style</Text>
        </View>
      </View>

      {/* Weekly Goal Progress */}
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>Weekly Goal</Text>
          <Text style={styles.goalSubtitle}>
            {progressData.weeklyProgress} of {progressData.weeklyGoal} classes
          </Text>
        </View>
        <View style={styles.progressRingContainer}>
          <ProgressChart
            data={progressRingData}
            width={120}
            height={120}
            strokeWidth={8}
            radius={32}
            chartConfig={progressRingConfig}
            hideLegend
          />
          <View style={styles.progressRingCenter}>
            <Text style={styles.progressPercentage}>
              {Math.round((progressData.weeklyProgress / progressData.weeklyGoal) * 100)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Weekly Activity Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>This Week's Activity</Text>
        <Text style={styles.chartSubtitle}>Minutes practiced per day</Text>
        <LineChart
          data={weeklyData}
          width={screenWidth - 60}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Recent Achievements */}
      <View style={styles.recentAchievements}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <TouchableOpacity onPress={() => setActiveTab('achievements')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {achievements
          .filter(a => a.unlocked)
          .slice(0, 2)
          .map(achievement => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#10b98120' }]}>
                <Ionicons name={achievement.icon} size={20} color="#10b981" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
              <Text style={styles.achievementDate}>
                {achievement.unlockedDate && new Date(achievement.unlockedDate).toLocaleDateString()}
              </Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );

  const renderAchievements = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.achievementsHeader}>Your Yoga Journey</Text>
      <Text style={styles.achievementsSubheader}>
        Unlock achievements as you progress in your practice
      </Text>
      
      {achievements.map(achievement => (
        <View 
          key={achievement.id} 
          style={[
            styles.achievementCard,
            !achievement.unlocked && styles.lockedAchievement
          ]}
        >
          <View style={[
            styles.achievementIcon,
            { backgroundColor: achievement.unlocked ? '#10b98120' : '#f3f4f620' }
          ]}>
            <Ionicons 
              name={achievement.icon} 
              size={24} 
              color={achievement.unlocked ? '#10b981' : '#9ca3af'} 
            />
          </View>
          <View style={styles.achievementContent}>
            <Text style={[
              styles.achievementTitle,
              !achievement.unlocked && styles.lockedText
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.achievementDescription,
              !achievement.unlocked && styles.lockedText
            ]}>
              {achievement.description}
            </Text>
            {achievement.unlocked && achievement.unlockedDate && (
              <Text style={styles.unlockedDate}>
                Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
              </Text>
            )}
          </View>
          {achievement.unlocked && (
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Progress</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' ? renderOverview() : renderAchievements()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  settingsButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10b981',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#10b981',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goalHeader: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressRingContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recentAchievements: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  achievementItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  achievementDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  achievementsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  achievementsSubheader: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  lockedText: {
    color: '#9ca3af',
  },
  unlockedDate: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default StudentProgressScreen;