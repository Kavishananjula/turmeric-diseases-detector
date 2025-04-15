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
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Validate fields
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill all fields!");
      return;
    }

    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User Logged In:", user);

      Alert.alert("Success", "Login successful!");
      navigation.navigate("Main"); // Navigate to MainTabs (Dashboard)
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Light green circle in the top left */}
      <View style={styles.circle} />

      {/* Title */}
      <Text style={styles.title}>Welcome Turmeric Protector</Text>

      {/* Phone Illustration */}
      <Image
        source={require("../assets/phone.png")}
        style={styles.phoneImage}
      />

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        placeholderTextColor={theme.colors.textLight}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Your Password"
        placeholderTextColor={theme.colors.textLight}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Forget Password Link */}
      <TouchableOpacity onPress={() => navigation.navigate("PasswordChange")}>
        <Text style={styles.forgetPasswordText}>Forget Password</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  title: {
    fontSize: theme.fontSizes.extraLarge,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.large,
  },
  phoneImage: {
    width: 150,
    height: 300,
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
  forgetPasswordText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textLight,
    textAlign: "center",
    marginBottom: theme.spacing.large,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.medium,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: theme.spacing.medium,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
  linkText: {
    fontSize: 17,
    color: theme.colors.secondary,
    textAlign: "center",
  },
});

export default LoginScreen;
