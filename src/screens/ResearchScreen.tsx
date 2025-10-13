import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground';
import GlassCard from '../components/GlassCard';

export default function ResearchScreen({ navigation }: any) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const researchData = [
    {
      id: 'anxiety',
      title: 'Anxiety Reduction',
      metric: '40%',
      icon: 'heart',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      summary: '40% reduction in anxiety symptoms in clinical populations',
      details: [
        'Standardized Mean Difference (SMD) = -0.43 (small-medium effect) vs. no treatment controls',
        'Cohen\'s d = -0.86 (large effect) vs. active comparators',
        'Effect maintained at 6+ months follow-up in multiple studies'
      ],
      links: [
        'https://pubmed.ncbi.nlm.nih.gov/29697885/',
        'https://pubmed.ncbi.nlm.nih.gov/37369553/'
      ]
    },
    {
      id: 'blood-pressure',
      title: 'Blood Pressure Reduction',
      metric: '4-8 mmHg',
      icon: 'fitness',
      color: '#ef4444',
      bgColor: '#fecaca',
      summary: '4-8 mmHg systolic BP reduction consistently across studies',
      details: [
        '3.6-6.1 mmHg diastolic BP reduction',
        'Larger effects (8+ mmHg reduction) with comprehensive yoga (asanas + pranayama + meditation)',
        '24-hour ambulatory BP monitoring showed sustained effects'
      ],
      links: [
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC3948002/',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC3679769/',
        'https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0323268'
      ]
    },
    {
      id: 'back-pain',
      title: 'Chronic Back Pain Improvement',
      metric: '60%',
      icon: 'body',
      color: '#8b5cf6',
      bgColor: '#ddd6fe',
      summary: '40-60% improvement in back pain within 3 weeks',
      details: [
        'Medium-to-large effect (d=0.645) on functional disability',
        '62.3% effect size for pain reduction',
        '1.5-point reduction in pain intensity (0-10 scale) at 12 weeks',
        'Sustained improvements at 24-week follow-up'
      ],
      links: [
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC3805350/',
        'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825746'
      ]
    },
    {
      id: 'sleep',
      title: 'Sleep Quality Improvement',
      metric: '40%',
      icon: 'moon',
      color: '#10b981',
      bgColor: '#bbf7d0',
      summary: '40% improvement in sleep quality scores at 4 weeks',
      details: [
        'Significant reduction in sleep latency (time to fall asleep)',
        'Increased N3 (deep sleep) percentage',
        '13.19% improvement in insomnia severity',
        'Enhanced sleep efficiency and reduced awakenings'
      ],
      links: [
        'https://jhrlmc.com/index.php/home/article/view/897',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC9012014/',
        'https://www.frontiersin.org/journals/neurology/articles/10.3389/fneur.2025.1566445/full'
      ]
    },
    {
      id: 'depression',
      title: 'Depression Symptom Reduction',
      metric: '45%',
      icon: 'happy',
      color: '#f56565',
      bgColor: '#fed7d7',
      summary: '45% improvement in depression scores (HAM-D scale)',
      details: [
        'Cohen\'s d = -0.60 to -0.64 (moderate-to-large effect)',
        'Higher remission rates compared to controls (OR = 3.20)',
        'Sustained improvements at 6-month follow-up'
      ],
      links: [
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC11919030/',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC10077871/'
      ]
    },
    {
      id: 'stress',
      title: 'Stress & Cortisol Reduction',
      metric: 'Significant',
      icon: 'leaf',
      color: '#06b6d4',
      bgColor: '#cffafe',
      summary: 'Significant cortisol reduction in yoga practitioners vs. controls',
      details: [
        'High correlation (r=0.59, p=0.008) between cortisol drop and depression improvement',
        'Enhanced parasympathetic activity and reduced stress markers',
        'Lower baseline cortisol levels in regular yoga practitioners'
      ],
      links: [
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC3768222/',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC4784068/'
      ]
    },
    {
      id: 'weight',
      title: 'Weight & Metabolic Improvement',
      metric: '1.2-1.4 kg/m²',
      icon: 'scale',
      color: '#f97316',
      bgColor: '#fed7aa',
      summary: '1.2-1.4 kg/m² BMI reduction in overweight populations',
      details: [
        'Significant decrease in body fat mass at 8-12 weeks',
        'Muscle mass improvement rate of 0.515 per week',
        '15% increase in metabolism with regular practice',
        'Waist circumference reduction of 4-6 cm in centrally obese individuals'
      ],
      links: [
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC8410386/',
        'https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2018.00466/full'
      ]
    },
    {
      id: 'cardiovascular',
      title: 'Cardiovascular Health',
      metric: '6.2 bpm',
      icon: 'pulse',
      color: '#dc2626',
      bgColor: '#fecaca',
      summary: '6.2 bpm resting heart rate reduction (Cohen\'s d = 1.42)',
      details: [
        'Improved Heart Rate Variability (HRV) - enhanced parasympathetic activity',
        '17% lower cardiovascular mortality risk associated with 5+ bpm HR reduction',
        'Enhanced cardiac autonomic regulation with regular practice'
      ],
      links: [
        'https://journals.acspublisher.com/index.php/irjay/article/view/20827',
        'https://healthcare-bulletin.co.uk/article/effect-of-yoga-on-resting-heart-rate-and-blood-pressure-a-controlled-physiological-study-3832/'
      ]
    },
    {
      id: 'inflammation',
      title: 'Inflammation Reduction',
      metric: 'Significant',
      icon: 'shield',
      color: '#7c3aed',
      bgColor: '#e9d5ff',
      summary: 'Reduced TNF-α levels (significant p<0.05)',
      details: [
        'Lower IL-6 and CRP levels in yoga practitioners',
        'Decreased inflammatory response to physical stress',
        'DNA methylation changes in inflammatory gene regions'
      ],
      links: [
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC8842003/',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC4525504/'
      ]
    }
  ];

  const optimalPractice = {
    duration: '8-12 weeks minimum for sustained effects',
    frequency: '3-5 sessions per week',
    sessionLength: '45-60 minutes',
    components: 'Asanas + Pranayama + Meditation (most effective)'
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <TexturedBackground variant="subtle">
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
          </TouchableOpacity>
          <Text style={styles.title}>Scientific Research</Text>
          <Text style={styles.subtitle}>
            Evidence-based benefits of yoga practice
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          <GlassCard intensity="light" style={styles.introCard}>
            <Text style={styles.introTitle}>🔬 Clinical Evidence</Text>
            <Text style={styles.introText}>
              Yoga's benefits are backed by rigorous scientific research. Here are the key findings from peer-reviewed studies and clinical trials.
            </Text>
          </GlassCard>

          {researchData.map((item) => (
            <GlassCard key={item.id} intensity="medium" style={styles.researchCard}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <View style={styles.headerContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMetric}>{item.metric}</Text>
                </View>
                <Ionicons 
                  name={expandedCard === item.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              <Text style={styles.cardSummary}>{item.summary}</Text>

              {expandedCard === item.id && (
                <View style={styles.expandedContent}>
                  <Text style={styles.detailsTitle}>Key Findings:</Text>
                  {item.details.map((detail, index) => (
                    <View key={index} style={styles.detailItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.detailText}>{detail}</Text>
                    </View>
                  ))}

                  <Text style={styles.linksTitle}>Research Links:</Text>
                  {item.links.map((link, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.linkButton}
                      onPress={() => openLink(link)}
                    >
                      <Ionicons name="link" size={16} color={colors.primary} />
                      <Text style={styles.linkText} numberOfLines={1}>
                        Study {index + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </GlassCard>
          ))}

          <GlassCard intensity="strong" style={styles.practiceCard}>
            <Text style={styles.practiceTitle}>🎯 Optimal Practice Parameters</Text>
            <Text style={styles.practiceSubtitle}>
              Based on research findings for maximum benefits:
            </Text>

            <View style={styles.practiceItem}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <View style={styles.practiceContent}>
                <Text style={styles.practiceLabel}>Duration</Text>
                <Text style={styles.practiceValue}>{optimalPractice.duration}</Text>
              </View>
            </View>

            <View style={styles.practiceItem}>
              <Ionicons name="repeat" size={20} color={colors.primary} />
              <View style={styles.practiceContent}>
                <Text style={styles.practiceLabel}>Frequency</Text>
                <Text style={styles.practiceValue}>{optimalPractice.frequency}</Text>
              </View>
            </View>

            <View style={styles.practiceItem}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <View style={styles.practiceContent}>
                <Text style={styles.practiceLabel}>Session Length</Text>
                <Text style={styles.practiceValue}>{optimalPractice.sessionLength}</Text>
              </View>
            </View>

            <View style={styles.practiceItem}>
              <Ionicons name="layers" size={20} color={colors.primary} />
              <View style={styles.practiceContent}>
                <Text style={styles.practiceLabel}>Components</Text>
                <Text style={styles.practiceValue}>{optimalPractice.components}</Text>
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </TexturedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    position: 'absolute',
    bottom: 20,
    left: 75,
  },
  content: {
    padding: 20,
  },
  introCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 10,
  },
  introText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  researchCard: {
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  cardMetric: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cardSummary: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 10,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 15,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  linksTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
    marginTop: 15,
    marginBottom: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.accentLight,
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  practiceCard: {
    marginTop: 10,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 5,
    textAlign: 'center',
  },
  practiceSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  practiceContent: {
    marginLeft: 15,
    flex: 1,
  },
  practiceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  practiceValue: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});