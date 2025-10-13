import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Asana } from '../services/supabase';
import { colors } from '../utils/colors';

export default function AsanasScreen() {
  const [asanas, setAsanas] = useState<Asana[]>([]);
  const [filteredAsanas, setFilteredAsanas] = useState<Asana[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAsana, setSelectedAsana] = useState<Asana | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    fetchAsanas();
  }, []);

  useEffect(() => {
    filterAsanas();
  }, [asanas, searchQuery, selectedDifficulty]);

  const fetchAsanas = async () => {
    try {
      const { data, error } = await supabase
        .from('asanas')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setAsanas(data || []);
    } catch (error) {
      console.error('Error fetching asanas:', error);
      Alert.alert('Error', 'Failed to load asanas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAsanas = () => {
    let filtered = asanas;

    if (searchQuery) {
      filtered = filtered.filter(asana =>
        asana.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asana.sanskrit_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(asana => asana.difficulty === selectedDifficulty);
    }

    setFilteredAsanas(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAsanas();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return colors.teal;
      case 'intermediate':
        return colors.primary;
      case 'advanced':
        return colors.purple;
      default:
        return colors.textSecondary;
    }
  };

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  if (selectedAsana) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.asanaHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedAsana(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={styles.backText}>Back to Asanas</Text>
        </View>

        {selectedAsana.image_url && (
          <Image
            source={{ uri: selectedAsana.image_url }}
            style={styles.asanaImage}
          />
        )}

        <View style={styles.asanaContent}>
          <View style={styles.asanaTitleContainer}>
            <Text style={styles.asanaTitle}>{selectedAsana.name}</Text>
            <Text style={styles.sanskritName}>{selectedAsana.sanskrit_name}</Text>
            <View style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(selectedAsana.difficulty) }
            ]}>
              <Text style={styles.difficultyText}>
                {selectedAsana.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Steps</Text>
            <Text style={styles.sectionContent}>{selectedAsana.steps}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <Text style={styles.sectionContent}>{selectedAsana.benefits}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precautions</Text>
            <Text style={styles.sectionContent}>{selectedAsana.precautions}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading asanas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <Text style={styles.title}>Free Asanas</Text>
        <Text style={styles.subtitle}>
          Learn yoga poses with detailed guides and instructions
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search poses..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.difficultySelector}
        >
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty.id}
              style={[
                styles.difficultyButton,
                selectedDifficulty === difficulty.id && styles.activeDifficultyButton
              ]}
              onPress={() => setSelectedDifficulty(difficulty.id)}
            >
              <Text style={[
                styles.difficultyButtonText,
                selectedDifficulty === difficulty.id && styles.activeDifficultyButtonText
              ]}>
                {difficulty.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView
        style={styles.asanasContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAsanas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="body-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Asanas Found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or difficulty filter
            </Text>
          </View>
        ) : (
          <View style={styles.asanasGrid}>
            {filteredAsanas.map((asana) => (
              <TouchableOpacity
                key={asana.id}
                style={styles.asanaCard}
                onPress={() => setSelectedAsana(asana)}
              >
                {asana.image_url ? (
                  <Image
                    source={{ uri: asana.image_url }}
                    style={styles.asanaCardImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons name="body" size={40} color="#d1d5db" />
                  </View>
                )}
                
                <View style={styles.asanaCardContent}>
                  <Text style={styles.asanaCardTitle} numberOfLines={2}>
                    {asana.name}
                  </Text>
                  <Text style={styles.asanaCardSanskrit} numberOfLines={1}>
                    {asana.sanskrit_name}
                  </Text>
                  
                  <View style={[
                    styles.asanaCardDifficulty,
                    { backgroundColor: getDifficultyColor(asana.difficulty) }
                  ]}>
                    <Text style={styles.asanaCardDifficultyText}>
                      {asana.difficulty}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textWhite,
    marginBottom: 20,
    lineHeight: 24,
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  difficultySelector: {
    flexDirection: 'row',
  },
  difficultyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 10,
  },
  activeDifficultyButton: {
    backgroundColor: colors.primary,
  },
  difficultyButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  activeDifficultyButtonText: {
    color: 'white',
  },
  asanasContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  asanasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  asanaCard: {
    backgroundColor: colors.white,
    width: '48%',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  asanaCardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  asanaCardContent: {
    padding: 15,
    backgroundColor: colors.white,
  },
  asanaCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 6,
    lineHeight: 22,
  },
  asanaCardSanskrit: {
    fontSize: 14,
    color: colors.textPrimary,
    fontStyle: 'italic',
    marginBottom: 10,
    fontWeight: '600',
  },
  asanaCardDifficulty: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  asanaCardDifficultyText: {
    fontSize: 12,
    color: colors.textWhite,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  // Asana detail styles
  asanaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 16,
    color: '#065f46',
    fontWeight: '600',
  },
  asanaImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  asanaContent: {
    padding: 20,
  },
  asanaTitleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  asanaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 5,
    textAlign: 'center',
  },
  sanskritName: {
    fontSize: 18,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  difficultyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
});