import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { theme } from "../theme";

const { width } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.replace("Registration");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* StatusBar for Android */}
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="dark-content"
      />
      <View style={styles.container}>
        {/* Light green circle in the top left */}
        <View style={styles.circle} />

        {/* Image */}
        <Image
          source={require("../assets/turmeric.png")}
          style={styles.image}
        />

        {/* Title */}
        <Text style={styles.title}>
          Gets things done with Turmeric Protector
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Turmeric Protector is an app for farmers, enabling real-time disease
          detection, crop management, and weather updates. It provides disease
          information, alerts, reporting tools, and multilingual support for
          optimal turmeric crop health and protection.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity onPress={handleGetStarted}>
          <View style={styles.button}>
            <Text
              style={styles.buttonText}
              numberOfLines={1}
              allowFontScaling={false}
            >
              Get Started
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.large,
    paddingTop: StatusBar.currentHeight || 0,
  },
  circle: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: "#E8F5E9",
    borderRadius: 150,
  },
  image: {
    width: 150,
    height: 250,
    marginBottom: theme.spacing.large,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  subtitle: {
    fontSize: 18,
    // fontSize: theme.fontSizes.medium,
    color: theme.colors.textLight,
    textAlign: "center",
    marginBottom: theme.spacing.extraLarge,
    paddingHorizontal: theme.spacing.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: 80, // Increase padding to give more space for text
    borderRadius: theme.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    width: 350, // Increase width to ensure text fits
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 17, // Reduce font size to ensure text fits
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 0, // Prevent text from shrinking
    minWidth: 150, // Reserve space for the text
  },
});

export default SplashScreen;
