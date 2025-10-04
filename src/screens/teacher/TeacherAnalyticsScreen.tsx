import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

interface AnalyticsData {
  totalStudents: number;
  totalClasses: number;
  totalRevenue: number;
  avgRating: number;
  monthlyStudents: number[];
  classPopularity: { name: string; population: number; color: string; legendFontColor: string; legendFontSize: number }[];
  weeklyRevenue: number[];
}

const TeacherAnalyticsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalStudents: 245,
    totalClasses: 18,
    totalRevenue: 3420,
    avgRating: 4.8,
    monthlyStudents: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 78, 85],
    classPopularity: [
      { name: 'Vinyasa', population: 35, color: '#6B73FF', legendFontColor: '#333', legendFontSize: 12 },
      { name: 'Hatha', population: 25, color: '#FF6B9D', legendFontColor: '#333', legendFontSize: 12 },
      { name: 'Yin', population: 20, color: '#4ECDC4', legendFontColor: '#333', legendFontSize: 12 },
      { name: 'Power', population: 15, color: '#FFE66D', legendFontColor: '#333', legendFontSize: 12 },
      { name: 'Restorative', population: 5, color: '#FF8B94', legendFontColor: '#333', legendFontSize: 12 },
    ],
    weeklyRevenue: [280, 320, 450, 380, 520, 480, 420],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(107, 115, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#6B73FF',
    },
  };

  const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({
    title,
    value,
    icon,
    color,
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
      </View>
    </View>
  );

  const PeriodSelector: React.FC = () => (
    <View style={styles.periodSelector}>
      {(['week', 'month', 'year'] as const).map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.selectedPeriodButton,
          ]}
          onPress={() => setSelectedPeriod(period)}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.selectedPeriodButtonText,
            ]}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download-outline" size={20} color="#6B73FF" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Overview Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Students"
          value={analyticsData.totalStudents.toString()}
          icon="people"
          color="#6B73FF"
        />
        <StatCard
          title="Active Classes"
          value={analyticsData.totalClasses.toString()}
          icon="play-circle"
          color="#4ECDC4"
        />
        <StatCard
          title="Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon="card"
          color="#FFE66D"
        />
        <StatCard
          title="Avg Rating"
          value={analyticsData.avgRating.toString()}
          icon="star"
          color="#FF6B9D"
        />
      </View>

      {/* Period Selector */}
      <PeriodSelector />

      {/* Student Growth Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Student Growth</Text>
        <LineChart
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                data: analyticsData.monthlyStudents.slice(0, 6),
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Class Popularity */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Class Popularity</Text>
        <PieChart
          data={analyticsData.classPopularity}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 50]}
          absolute
        />
      </View>

      {/* Weekly Revenue */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Revenue</Text>
        <BarChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: analyticsData.weeklyRevenue,
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          yAxisLabel="$"
          yAxisSuffix=""
        />
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#6B73FF20' }]}>
              <Ionicons name="person-add" size={16} color="#6B73FF" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>5 new students joined your classes</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#4ECDC420' }]}>
              <Ionicons name="star" size={16} color="#4ECDC4" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New 5-star review on "Morning Flow"</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#FFE66D20' }]}>
              <Ionicons name="trending-up" size={16} color="#FFE66D" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Revenue increased by 15% this week</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6B73FF',
  },
  exportButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B73FF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedPeriodButton: {
    backgroundColor: '#6B73FF',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedPeriodButtonText: {
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  activityContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default TeacherAnalyticsScreen;