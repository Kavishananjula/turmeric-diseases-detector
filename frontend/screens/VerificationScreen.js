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
import { auth, db } from "../firebaseConfig"; // Firebase auth and firestore import
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";

const VerificationScreen = ({ navigation, route }) => {
  const { email } = route.params; // Get email from navigation params
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    // Validate code
    if (!code) {
      Alert.alert("Validation Error", "Please enter the verification code!");
      return;
    }

    try {
      // Retrieve OTP, current password, and new password from Firestore
      const docRef = doc(db, "passwordResets", email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Alert.alert("Error", "No OTP found for this email!");
        return;
      }

      const { otp, currentPassword, newPassword } = docSnap.data();

      // Verify OTP
      if (code !== otp) {
        Alert.alert("Validation Error", "Invalid OTP code!");
        return;
      }

      // Sign in user with current password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        currentPassword
      );
      const user = userCredential.user;

      // Update password to new password
      await updatePassword(user, newPassword);
      console.log("Password Reset Successful for:", email);

      Alert.alert("Success", "Password has been successfully reset!");
      navigation.navigate("Success");
    } catch (error) {
      console.error("Verification Error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Light green circle in the top left */}
      <View style={styles.circleTop} />

      {/* Light green circle in the bottom right */}
      <View style={styles.circleBottom} />

      {/* Phone Illustration */}
      <Image
        source={require("../assets/verification.png")}
        style={styles.phoneImage}
      />

      {/* Title */}
      <Text style={styles.title}>OTP Verification</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Enter the code sent to your email: {email}
      </Text>

      {/* Code Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter Verification Code"
        placeholderTextColor={theme.colors.textLight}
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Continue</Text>
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
  circleTop: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: "#E8F5E9", // Light green color
    borderRadius: 150,
  },
  circleBottom: {
    position: "absolute",
    bottom: -100,
    right: -100,
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
  title: {
    fontSize: theme.fontSizes.extraLarge,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textLight,
    textAlign: "center",
    marginBottom: theme.spacing.large,
  },
  input: {
    backgroundColor: "#F5F5F5", // Light gray background for inputs
    borderRadius: 25,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.large,
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

export default VerificationScreen;
