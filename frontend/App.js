// import * as React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// // Import Screens
// import SplashScreen from "./screens/SplashScreen";
// import RegistrationScreen from "./screens/RegistrationScreen";
// import LoginScreen from "./screens/LoginScreen";
// import VerificationScreen from "./screens/VerificationScreen";
// import PasswordChangeScreen from "./screens/PasswordChangeScreen";
// import SuccessScreen from "./screens/SuccessScreen";
// import DashboardScreen from "./screens/DashboardScreen";
// import ProfileScreen from "./screens/ProfileScreen";
// import ImageScreen from "./screens/ImageScreen";
// import SettingsScreen from "./screens/SettingsScreen";
// import AboutScreen from "./screens/AboutScreen";
// import HelpScreen from "./screens/HelpScreen";

// import { db, auth, storage } from "./firebaseConfig";

// console.log("Firestore:", db);
// console.log("Auth:", auth);
// console.log("Storage:", storage);

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// // Bottom Tabs for Dashboard, Profile, Image, Settings
// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === "Dashboard") {
//             iconName = focused ? "view-dashboard" : "view-dashboard-outline";
//           } else if (route.name === "Profile") {
//             iconName = focused ? "account" : "account-outline";
//           } else if (route.name === "Image") {
//             iconName = focused ? "image" : "image-outline";
//           } else if (route.name === "Settings") {
//             iconName = focused ? "cog" : "cog-outline";
//           }

//           return (
//             <MaterialCommunityIcons name={iconName} size={size} color={color} />
//           );
//         },
//         tabBarActiveTintColor: "#4CAF50",
//         tabBarInactiveTintColor: "gray",
//         tabBarStyle: {
//           backgroundColor: "#fff",
//           borderTopWidth: 1,
//           borderTopColor: "#e0e0e0",
//           paddingBottom: 5,
//           height: 60,
//         },
//       })}
//     >
//       <Tab.Screen
//         name="Dashboard"
//         component={DashboardScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Image"
//         component={ImageScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{ headerShown: false }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Main Stack Navigator
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Splash">
//         <Stack.Screen
//           name="Splash"
//           component={SplashScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Registration"
//           component={RegistrationScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Verification"
//           component={VerificationScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="PasswordChange"
//           component={PasswordChangeScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Success"
//           component={SuccessScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Main"
//           component={MainTabs}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="About"
//           component={AboutScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Help"
//           component={HelpScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Import Screens
import SplashScreen from "./screens/SplashScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import LoginScreen from "./screens/LoginScreen";
import PasswordChangeScreen from "./screens/PasswordChangeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ImageScreen from "./screens/ImageScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AboutScreen from "./screens/AboutScreen";
import HelpScreen from "./screens/HelpScreen";

import { db, auth, storage } from "./firebaseConfig";

console.log("Firestore:", db);
console.log("Auth:", auth);
console.log("Storage:", storage);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs for Dashboard, Profile, Image, Settings
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "view-dashboard" : "view-dashboard-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          } else if (route.name === "Image") {
            iconName = focused ? "image" : "image-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "cog" : "cog-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Image"
        component={ImageScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PasswordChange"
          component={PasswordChangeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
