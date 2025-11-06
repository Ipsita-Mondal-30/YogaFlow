import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground';
import CurriculumSection from '../components/CurriculumSection';

export default function CurriculumScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TexturedBackground variant="subtle">
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <CurriculumSection />
        </ScrollView>
      </TexturedBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 140,
    paddingTop: 20,
  },
});
