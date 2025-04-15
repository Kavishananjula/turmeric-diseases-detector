// screens/PasswordChangeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { theme } from "../theme";
import { auth } from "../firebaseConfig"; // Firebase Auth import
import { sendPasswordResetEmail } from "firebase/auth";

const PasswordChangeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleSendResetEmail = async () => {
    // Validate email
    if (!email) {
      Alert.alert("Validation Error", "Please enter your email!");
      return;
    }

    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);
      console.log("Password Reset Email Sent to:", email);

      Alert.alert(
        "Success",
        "A password reset link has been sent to your email address. Please check your inbox (and spam/junk folder) and follow the instructions to reset your password."
      );

      // Navigate to LoginScreen (user will reset password via email link)
      navigation.navigate("Login");
    } catch (error) {
      console.error("Password Reset Error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Light green circle in the top left */}
      <View style={styles.circle} />

      {/* Phone Illustration */}
      <Image
        source={require("../assets/password_change.png")}
        style={styles.phoneImage}
      />

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        placeholderTextColor={theme.colors.textLight}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendResetEmail}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.extraLarge,
    paddingBottom: theme.spacing.extraLarge,
  },
  circle: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: "#E8F5E9", // Light green color
    borderRadius: 150,
  },
  phoneImage: {
    width: 150,
    height: 200,
    marginBottom: theme.spacing.large,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#F5F5F5", // Light gray background for inputs
    borderRadius: 25,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.medium,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
});

export default PasswordChangeScreen;
