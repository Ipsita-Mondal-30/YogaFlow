import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' }}
        style={styles.hero}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
          style={styles.heroOverlay}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Yoga Flow</Text>
            <Text style={styles.heroSubtitle}>
              Train with Rishikesh's best yoga teachers — online
            </Text>
            <Text style={styles.heroDescription}>
              Experience authentic yoga with modern convenience
            </Text>
            
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Classes')}
            >
              <Text style={styles.ctaButtonText}>Start Your Journey</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Yoga Flow</Text>
        
        <View style={styles.missionCard}>
          <Ionicons name="heart" size={24} color="#10b981" />
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            To bring the ancient wisdom of yoga from the spiritual capital of Rishikesh 
            to practitioners worldwide through authentic, accessible online classes.
          </Text>
        </View>

        <View style={styles.missionCard}>
          <Ionicons name="eye" size={24} color="#10b981" />
          <Text style={styles.cardTitle}>Our Vision</Text>
          <Text style={styles.cardText}>
            Creating a global community where traditional yoga meets modern technology, 
            fostering inner peace, physical wellness, and spiritual growth.
          </Text>
        </View>

        <View style={styles.missionCard}>
          <Ionicons name="leaf" size={24} color="#10b981" />
          <Text style={styles.cardTitle}>Our Values</Text>
          <Text style={styles.cardText}>
            Authenticity, mindfulness, community, and the transformative power of 
            yoga as taught by masters in the birthplace of this ancient practice.
          </Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        
        <View style={styles.featuresGrid}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('Classes')}
          >
            <Ionicons name="play-circle" size={40} color="#10b981" />
            <Text style={styles.featureTitle}>Live Classes</Text>
            <Text style={styles.featureText}>Join real-time sessions with expert teachers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('Community')}
          >
            <Ionicons name="people" size={40} color="#10b981" />
            <Text style={styles.featureTitle}>Community</Text>
            <Text style={styles.featureText}>Connect with fellow practitioners</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('Asanas')}
          >
            <Ionicons name="body" size={40} color="#10b981" />
            <Text style={styles.featureTitle}>Free Asanas</Text>
            <Text style={styles.featureText}>Learn poses with detailed guides</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('Blog')}
          >
            <Ionicons name="library" size={40} color="#10b981" />
            <Text style={styles.featureTitle}>Yoga Wisdom</Text>
            <Text style={styles.featureText}>Read insights and research</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact CTA */}
      <View style={styles.section}>
        <View style={styles.contactCta}>
          <Text style={styles.contactTitle}>Ready to Begin?</Text>
          <Text style={styles.contactText}>
            Have questions? We're here to guide you on your yoga journey.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.contactButtonText}>Get in Touch</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  hero: {
    height: 400,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  heroDescription: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 20,
    textAlign: 'center',
  },
  missionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065f46',
    marginTop: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: 'white',
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  contactCta: {
    backgroundColor: '#ecfdf5',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});