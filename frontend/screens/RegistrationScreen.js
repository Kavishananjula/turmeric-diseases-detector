import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../theme";
import { auth, db, storage } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Storage functions

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState(null); // Profile image state

  // Image picker function
  const pickImage = async () => {
    try {
      // Request permission to access gallery
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Media Library Permission Status:", status);
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Sorry, we need camera roll permissions to make this work!"
          );
          return;
        }
      }

      // Open image picker
      console.log("Opening Image Picker...");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 1,
      });

      console.log("Image Picker Result:", result);
      if (!result.canceled) {
        setProfileImage({ uri: result.assets[0].uri }); // Update profile image
        console.log("Profile Image Selected:", result.assets[0].uri);
      } else {
        console.log("Image Picker Canceled");
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const handleRegister = async () => {
    // Validate all fields
    if (!name || !email || !mobile || !city || !password || !gender) {
      Alert.alert("Validation Error", "Please fill all fields!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password should be at least 6 characters long!"
      );
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User Created:", user);

      // Upload profile image to Firebase Storage if selected
      let profileImageUrl = null;
      if (profileImage) {
        const response = await fetch(profileImage.uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(imageRef, blob);
        profileImageUrl = await getDownloadURL(imageRef);
        console.log("Profile Image Uploaded:", profileImageUrl);
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        mobile,
        city,
        gender,
        profileImageUrl: profileImageUrl || null, // Save image URL or null if no image
        createdAt: new Date().toISOString(),
      });
      console.log("User Data Saved to Firestore");

      Alert.alert("Success", "Registration successful! Please login.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Light green circle in the top left */}
        <View style={styles.circle} />

        {/* Title */}
        <Text style={styles.title}>Welcome Turmeric Protector</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Let's help you meet up your tasks.</Text>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              profileImage || require("../assets/profile.jpeg") // Default image if no image is selected
            }
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
            <Text style={styles.changeImageText}>Select Image</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Enter Your Name"
          placeholderTextColor={theme.colors.textLight}
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Enter Your Mobile"
          placeholderTextColor={theme.colors.textLight}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Your City"
          placeholderTextColor={theme.colors.textLight}
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Your Password"
          placeholderTextColor={theme.colors.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Gender Selection */}
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setGender("Male")}
          >
            <View
              style={
                gender === "Male" ? styles.radioSelected : styles.radioUnselected
              }
            />
            <Text style={styles.radioText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setGender("Female")}
          >
            <View
              style={
                gender === "Female"
                  ? styles.radioSelected
                  : styles.radioUnselected
              }
            />
            <Text style={styles.radioText}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Registration Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTRATION</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>ALREADY HAVE AN ACCOUNT? SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the content takes up the full height
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.extraLarge,
    paddingBottom: theme.spacing.extraLarge, // Add padding to the bottom
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
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textLight,
    textAlign: "center",
    marginBottom: theme.spacing.large,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.large,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.medium,
  },
  changeImageButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  changeImageText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#F5F5F5", // Light gray background for inputs
    borderRadius: 25,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.large,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: theme.spacing.medium,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.textLight,
  },
  radioText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.small,
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
    fontSize: theme.fontSizes.medium,
    color: theme.colors.secondary,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

export default RegistrationScreen;