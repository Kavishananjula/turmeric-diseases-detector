import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../theme";
import { db, auth, storage } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

const ProfileScreen = () => {
  const [user, setUser] = useState(null); // Logged-in user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // For mobile number
  const [city, setCity] = useState(""); // Renamed from address to city
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState(null); // Profile image URI
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch logged-in user and profile data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email); // Set email from Firebase Auth
        // Fetch user profile from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Fetched user data:", userData); // Debug log
          setName(userData.name || "");
          setPhone(userData.mobile || userData.phone || "");
          setCity(userData.city || userData.address || "");
          setGender(userData.gender || "");
          setProfileImage(
            userData.profileImageUrl ? { uri: userData.profileImageUrl } : null
          );
        } else {
          // If no profile exists, create a default one
          await setDoc(userDocRef, {
            name: currentUser.email.split("@")[0], // Default name from email
            email: currentUser.email,
            mobile: "", // Use mobile instead of phone
            city: "", // Use city instead of address
            gender: "",
            profileImageUrl: "",
          });
          setName(currentUser.email.split("@")[0]);
        }
      } else {
        Alert.alert("Error", "You need to be logged in to access the profile!");
        // Navigate to login screen if not logged in
      }
    });
    return () => unsubscribe();
  }, []);

  // Image picker function
  const pickImage = async () => {
    try {
      console.log("Attempting to pick image...");

      // Request permission to access media library
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Permission status:", status);
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Permission to access gallery is required!"
          );
          return;
        }
      }

      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use correct enum
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 1,
      });

      console.log("Image picker result:", result);

      if (!result.canceled) {
        setProfileImage({ uri: result.assets[0].uri });
        console.log("Selected image URI:", result.assets[0].uri);
      } else {
        console.log("Image picking canceled by user");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image: " + error.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  const handleUpdate = async () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to update the profile!");
      return;
    }

    try {
      setLoading(true);
      let profileImageUrl = profileImage?.uri || "";

      // Upload profile image to Firebase Storage if changed
      if (profileImage && profileImage.uri.startsWith("file://")) {
        const response = await fetch(profileImage.uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `profileImages/${user.uid}/profile.jpg`);
        await uploadBytes(imageRef, blob);
        profileImageUrl = await getDownloadURL(imageRef);
        setProfileImage({ uri: profileImageUrl }); // Update local state with URL
      }

      // Update user profile in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          name,
          email,
          mobile: phone, // Save as mobile instead of phone
          city, // Save as city instead of address
          gender,
          profileImageUrl,
        },
        { merge: true }
      );

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.circle} />
            <View style={styles.imageContainer}>
              <Image
                source={
                  profileImage
                    ? profileImage
                    : require("../assets/profile.jpeg") // Fallback image
                }
                style={styles.profileImage}
              />
              {isEditing && (
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.headerTitle}>Welcome {name}!</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Believe, embrace, focus, stay positive, resilient, act, progress,
            achieve, succeed, closer.
          </Text>

          {/* Profile Details */}
          <View style={styles.detailsContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={theme.colors.textLight}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={theme.colors.textLight}
              keyboardType="email-address"
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              placeholderTextColor={theme.colors.textLight}
              keyboardType="phone-pad"
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={theme.colors.textLight}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              value={gender}
              onChangeText={setGender}
              placeholder="Gender"
              placeholderTextColor={theme.colors.textLight}
              editable={isEditing}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.editButton,
                !isEditing ? {} : styles.disabledButton,
              ]}
              onPress={handleEdit}
              disabled={isEditing || loading}
            >
              <Text style={styles.buttonText}>EDIT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.updateButton,
                isEditing ? {} : styles.disabledButton,
              ]}
              onPress={handleUpdate}
              disabled={!isEditing || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "UPDATING..." : "UPDATE"}
              </Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingTop: theme.spacing.extraLarge,
    paddingHorizontal: theme.spacing.large,
    position: "relative",
    alignItems: "center", // Fixed: Added missing quotation mark
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
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.medium,
  },
  changeImageButton: {
    position: "absolute",
    bottom: theme.spacing.medium,
    backgroundColor: theme.colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  changeImageText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.small,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  description: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textLight,
    textAlign: "center",
    paddingHorizontal: theme.spacing.large,
    marginVertical: theme.spacing.medium,
  },
  detailsContainer: {
    paddingHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.large,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: theme.spacing.medium,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.large,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    marginRight: theme.spacing.medium,
  },
  updateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    marginLeft: theme.spacing.medium,
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
