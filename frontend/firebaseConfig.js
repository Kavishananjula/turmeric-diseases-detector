import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoi3kf4Jdm0J8sV6sIwwQxrF9k2_el29A",
  authDomain: "turmericprotector.firebaseapp.com",
  projectId: "turmericprotector",
  storageBucket: "turmericprotector.firebasestorage.app",
  messagingSenderId: "834448934143",
  appId: "1:834448934143:web:57dad5cfd821d75d28f8ca",
  measurementId: "G-1E8TR30ZDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage(app);

// Log to confirm initialization
console.log("Firebase App Initialized:", app);
console.log("Firestore Initialized:", db);
console.log("Auth Initialized:", auth);
console.log("Storage Initialized:", storage);

// Export services
export { db, auth, storage };