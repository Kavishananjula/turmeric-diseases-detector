import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const HelpScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.circle} />
            <Text style={styles.headerTitle}>Help & Guide</Text>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()} 
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Getting Started</Text>
            <Text style={styles.sectionText}>
              1. **Register/Login:** Create an account or log in using your email and password.{'\n'}
              2. **Dashboard:** Access all features like Image Scanner, Community, and Profile from the dashboard.{'\n'}
              3. **Settings:** Customize your app experience by changing the language or managing your account.
            </Text>
            <Text style={styles.sectionTitle}>Using the Image Scanner</Text>
            <Text style={styles.sectionText}>
              1. Go to the Image Scanner section from the dashboard.{'\n'}
              2. Upload an image of your turmeric plant or use the camera to take a picture.{'\n'}
              3. Wait for the analysis to complete. The app will identify any diseases and provide solutions.{'\n'}
              4. Share your results with the community if needed.
            </Text>
            <Text style={styles.sectionTitle}>Community Features</Text>
            <Text style={styles.sectionText}>
              1. Navigate to the Community section.{'\n'}
              2. Create a post by adding text and an optional image.{'\n'}
              3. View posts from other farmers and share your knowledge.{'\n'}
              4. Engage with the community to learn more about turmeric cultivation.
            </Text>
            <Text style={styles.sectionTitle}>Need More Help?</Text>
            <Text style={styles.sectionText}>
              If you have any questions or need further assistance, contact us at support@turmericprotector.com.
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

export default HelpScreen;