import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.circle} />
            <Text style={styles.headerTitle}>About Turmeric Protector</Text>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()} 
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.sectionText}>
              Turmeric Protector is designed to help farmers and turmeric cultivators identify and manage diseases affecting their crops. Our app uses advanced image analysis to detect turmeric plant diseases and provides actionable solutions to ensure healthy growth and high yields.
            </Text>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <Text style={styles.sectionText}>
              - Image Scanner: Upload or capture images of turmeric plants to identify diseases instantly.{'\n'}
              - Community: Share your findings and connect with other farmers to exchange knowledge.{'\n'}
              - Profile Management: Keep track of your past scans and manage your account details.{'\n'}
              - Multi-Language Support: Use the app in English or Sinhala for a better experience.
            </Text>
            <Text style={styles.sectionTitle}>Version</Text>
            <Text style={styles.sectionText}>1.0.0</Text>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.sectionText}>
              For support or inquiries, reach out to us at support@turmericprotector.com.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: theme.spacing.extraLarge,
    paddingHorizontal: theme.spacing.large,
    position: 'relative',
    alignItems: 'center',
    
  },
  circle: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: '#E8F5E9',
    borderRadius: 150,
  },
  headerTitle: {
    fontSize: theme.fontSizes.extraLarge,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing.extraLarge,
    left: theme.spacing.large,
  },
  content: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.medium,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  sectionText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textLight,
    lineHeight: 22,
    marginBottom: theme.spacing.medium,
  },
});

export default AboutScreen;