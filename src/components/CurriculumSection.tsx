import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import GlassCard from './GlassCard';

const { width, height } = Dimensions.get('window');

// Responsive font size helper
const responsiveFontSize = (size: number) => {
  const scale = width / 375; // Base width (iPhone X)
  const newSize = size * scale;
  return Math.round(newSize);
};

// Responsive spacing
const responsiveSpacing = (size: number) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

type MonthData = {
  month: number;
  title: string;
  theme: string;
  focus: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  practices: string[];
  results: string[];
  metrics: { label: string; value: string }[];
  testimonial: { text: string; author: string };
};

const curriculumData: MonthData[] = [
  {
    month: 1,
    title: 'Month 1',
    theme: 'Sleep Quality + Nervous System Reset',
    focus: 'Restore circadian rhythm, calm the mind',
    icon: 'moon',
    color: colors.purple,
    practices: [
      'Gentle evening flows',
      'Yoga Nidra for deep rest',
      'Pranayama for nervous system regulation',
      'Meditation for mental clarity'
    ],
    results: [
      'Fall asleep 15-20 min faster',
      'Reduced nighttime awakenings',
      'Improved morning energy',
      'Lower stress hormones'
    ],
    metrics: [
      { label: 'Sleep Latency', value: '↓ 40%' },
      { label: 'Deep Sleep', value: '↑ 25%' },
      { label: 'Morning Energy', value: '↑ 35%' }
    ],
    testimonial: {
      text: 'I used to toss and turn for hours. Now I fall asleep within 15 minutes and wake up refreshed.',
      author: 'Sarah M., 34'
    }
  },
  {
    month: 3,
    title: 'Month 3',
    theme: 'Foundational Strength + Joint Stability',
    focus: 'Pain-free strength for daily life',
    icon: 'fitness',
    color: colors.teal,
    practices: [
      'Core strengthening sequences',
      'Joint mobility flows',
      'Balance and stability work',
      'Functional movement patterns'
    ],
    results: [
      'Plank hold time doubled',
      '60% reduction in back pain',
      'Improved posture and alignment',
      'Enhanced daily movement quality'
    ],
    metrics: [
      { label: 'Core Strength', value: '↑ 85%' },
      { label: 'Back Pain', value: '↓ 60%' },
      { label: 'Balance Score', value: '↑ 45%' }
    ],
    testimonial: {
      text: 'My chronic back pain is gone. I can play with my kids without worrying about hurting myself.',
      author: 'Michael R., 42'
    }
  },
  {
    month: 6,
    title: 'Month 6',
    theme: 'Integration + Self-Practice Confidence',
    focus: 'Own your practice and results',
    icon: 'trophy',
    color: colors.primary,
    practices: [
      'Advanced asana sequences',
      'Personalized practice design',
      'Meditation mastery',
      'Lifestyle integration'
    ],
    results: [
      'Complete transformation achieved',
      'Self-directed practice confidence',
      'Sustainable healthy habits',
      'Holistic well-being mastery'
    ],
    metrics: [
      { label: 'Overall Well-being', value: '↑ 75%' },
      { label: 'Flexibility', value: '↑ 90%' },
      { label: 'Stress Management', value: '↑ 80%' },
      { label: 'Weight Management', value: '↓ 5-8%' }
    ],
    testimonial: {
      text: 'Yoga Flow transformed my life. I\'m stronger, calmer, and more confident than ever before.',
      author: 'Jennifer L., 38'
    }
  }
];

export default function CurriculumSection() {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  const currentData = curriculumData.find(m => m.month === selectedMonth) || curriculumData[0];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your 6-Month Transformation Journey</Text>
      <Text style={styles.sectionSubtitle}>
        Evidence-based curriculum designed for measurable results
      </Text>

      {/* Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {curriculumData.map((month) => (
          <TouchableOpacity
            key={month.month}
            style={[
              styles.tab,
              selectedMonth === month.month && styles.activeTab
            ]}
            onPress={() => setSelectedMonth(month.month)}
          >
            <LinearGradient
              colors={
                selectedMonth === month.month
                  ? [month.color, month.color]
                  : ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)']
              }
              style={styles.tabGradient}
            >
              <Ionicons
                name={month.icon}
                size={20}
                color={selectedMonth === month.month ? colors.textWhite : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedMonth === month.month && styles.activeTabText
                ]}
                numberOfLines={1}
              >
                {month.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Month Content */}
      <GlassCard intensity="medium" style={styles.contentCard}>
        <View style={styles.monthHeader}>
          <View style={[styles.monthIcon, { backgroundColor: currentData.color }]}>
            <Ionicons name={currentData.icon} size={32} color={colors.textWhite} />
          </View>
          <View style={styles.monthTitleContainer}>
            <Text style={styles.monthTitle}>{currentData.theme}</Text>
            <Text style={styles.monthFocus}>{currentData.focus}</Text>
          </View>
        </View>

        {/* Key Practices */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>🧘‍♀️ Key Practices</Text>
          <View style={styles.listContainer}>
            {currentData.practices.map((practice, index) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, { backgroundColor: currentData.color }]} />
                <Text style={styles.listText}>{practice}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Expected Results */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>✨ Expected Results</Text>
          <View style={styles.listContainer}>
            {currentData.results.map((result, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={16} color={currentData.color} />
                <Text style={styles.listText}>{result}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📊 Measurable Metrics</Text>
          <View style={styles.metricsGrid}>
            {currentData.metrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonial */}
        <View style={styles.testimonialContainer}>
          <Ionicons name="chatbox-ellipses" size={24} color={currentData.color} style={styles.quoteIcon} />
          <Text style={styles.testimonialText}>"{currentData.testimonial.text}"</Text>
          <Text style={styles.testimonialAuthor}>— {currentData.testimonial.author}</Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton}>
          <LinearGradient
            colors={[currentData.color, currentData.color + 'CC']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Start Your Transformation</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.textWhite} />
          </LinearGradient>
        </TouchableOpacity>
      </GlassCard>

      {/* Timeline Visual */}
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>Your Journey Timeline</Text>
        <View style={styles.timeline}>
          {curriculumData.map((month, index) => (
            <View key={month.month} style={styles.timelineItem}>
              <View style={styles.timelineNode}>
                <View style={[styles.timelineCircle, { backgroundColor: month.color }]}>
                  <Ionicons name={month.icon} size={16} color={colors.textWhite} />
                </View>
                {index < curriculumData.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineMonth}>{month.title}</Text>
                <Text style={styles.timelineTheme} numberOfLines={2}>{month.theme}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: responsiveSpacing(8),
    paddingHorizontal: responsiveSpacing(20),
    lineHeight: responsiveFontSize(32),
    flexWrap: 'wrap',
  },
  sectionSubtitle: {
    fontSize: responsiveFontSize(14),
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: responsiveSpacing(20),
    paddingHorizontal: responsiveSpacing(20),
    lineHeight: responsiveFontSize(20),
    flexWrap: 'wrap',
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tab: {
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: responsiveFontSize(13),
    fontWeight: '600',
    color: colors.textSecondary,
    flexWrap: 'nowrap',
  },
  activeTabText: {
    color: colors.textWhite,
  },
  contentCard: {
    marginHorizontal: responsiveSpacing(20),
    marginBottom: responsiveSpacing(20),
    maxWidth: '100%',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  monthIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  monthTitleContainer: {
    flex: 1,
  },
  monthTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 4,
    lineHeight: responsiveFontSize(22),
    flexWrap: 'wrap',
  },
  monthFocus: {
    fontSize: responsiveFontSize(13),
    color: colors.textSecondary,
    lineHeight: responsiveFontSize(18),
    flexWrap: 'wrap',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: responsiveFontSize(15),
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  listContainer: {
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  listText: {
    flex: 1,
    fontSize: responsiveFontSize(13),
    color: colors.textPrimary,
    lineHeight: responsiveFontSize(19),
    flexWrap: 'wrap',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: Math.max((width - 80) / 3, 90),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: responsiveSpacing(12),
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricValue: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: responsiveFontSize(10),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: responsiveFontSize(13),
    flexWrap: 'wrap',
  },
  testimonialContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  quoteIcon: {
    marginBottom: 8,
  },
  testimonialText: {
    fontSize: responsiveFontSize(13),
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: responsiveFontSize(20),
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  testimonialAuthor: {
    fontSize: responsiveFontSize(12),
    color: colors.textSecondary,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  ctaText: {
    fontSize: responsiveFontSize(15),
    fontWeight: 'bold',
    color: colors.textWhite,
    flexWrap: 'wrap',
  },
  timelineContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  timelineTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 15,
  },
  timelineNode: {
    alignItems: 'center',
  },
  timelineCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 25,
  },
  timelineMonth: {
    fontSize: responsiveFontSize(15),
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  timelineTheme: {
    fontSize: responsiveFontSize(13),
    color: colors.textSecondary,
    lineHeight: responsiveFontSize(18),
    flexWrap: 'wrap',
  },
});
