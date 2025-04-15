import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../theme";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const SettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);

  // Use useFocusEffect instead of useEffect to run only when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          console.log("Logged-in user email:", currentUser.email); // Keep this for now
        } else {
          setUser(null);
          Alert.alert("Error", "You need to be logged in to access settings!");
          navigation.navigate("Login");
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }, [])
  );

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              setSignOutLoading(true);
              await signOut(auth);
              navigation.navigate("Login");
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Failed to sign out: " + error.message);
            } finally {
              setSignOutLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditAccount = () => {
    console.log("Navigating to ProfileScreen...");
    navigation.navigate("Main", { screen: "Profile" });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.circle} />
            <Text style={styles.headerTitle}>SETTINGS</Text>
          </View>

          {/* General Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GENERAL</Text>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Language</Text>
              <View style={styles.optionRight}>
                <Text style={styles.optionValue}>English</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.textLight}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <TouchableOpacity style={styles.option} onPress={handleEditAccount}>
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons
                  name="account"
                  size={24}
                  color={theme.colors.textLight}
                />
                <Text style={[styles.optionText, { marginLeft: 10 }]}>
                  Edit Account
                </Text>
              </View>
              <View style={styles.optionRight}>
                <Text style={styles.optionValue}>{user.email}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.textLight}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, signOutLoading && styles.disabledOption]}
              onPress={handleSignOut}
              disabled={signOutLoading}
            >
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color={theme.colors.textLight}
                />
                <Text style={[styles.optionText, { marginLeft: 10 }]}>
                  {signOutLoading ? "Signing Out..." : "Sign Out"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFO</Text>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate("About")}
            >
              <Text style={styles.optionText}>About</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textLight}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate("Help")}
            >
              <Text style={styles.optionText}>Help</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textLight}
              />
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
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingTop: theme.spacing.extraLarge,
    paddingHorizontal: theme.spacing.large,
    position: "relative",
    alignItems: "center",
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
  headerTitle: {
    fontSize: theme.fontSizes.extraLarge,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  section: {
    bottom: -30,
    paddingHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.textLight,
    marginBottom: theme.spacing.medium,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  optionValue: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textLight,
    marginRight: theme.spacing.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsScreen;
