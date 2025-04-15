import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button,
  Modal,
} from "react-native";
import { theme } from "../theme";
import { db, auth, storage } from "../firebaseConfig"; // Firebase imports
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker"; // For image picking
import { onAuthStateChanged } from "firebase/auth";

const DashboardScreen = () => {
  const [user, setUser] = useState(null); // Logged-in user
  const [description, setDescription] = useState(""); // New post description
  const [image, setImage] = useState(null); // New post image
  const [posts, setPosts] = useState([]); // List of posts
  const [comment, setComment] = useState(""); // New comment
  const [loading, setLoading] = useState(false); // Loading state
  const [editModalVisible, setEditModalVisible] = useState(false); // Modal for editing post
  const [editPostId, setEditPostId] = useState(null); // Post ID being edited
  const [editDescription, setEditDescription] = useState(""); // Edited description

  // Check logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("Logged-in user:", currentUser.email); // Debug log
        setUser(currentUser);
      } else {
        console.log("No user logged in"); // Debug log
        Alert.alert(
          "Error",
          "You need to be logged in to access the dashboard!"
        );
        // Navigate to login screen if not logged in
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch posts when user changes
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(postsQuery);
      const postsData = [];

      for (const postDoc of querySnapshot.docs) {
        const postData = postDoc.data();
        // Fetch comments for each post
        const commentsQuery = query(
          collection(db, `posts/${postDoc.id}/comments`),
          orderBy("timestamp", "asc")
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const comments = commentsSnapshot.docs.map((commentDoc) => ({
          id: commentDoc.id,
          ...commentDoc.data(),
        }));

        postsData.push({
          id: postDoc.id,
          ...postData,
          comments,
        });
      }

      console.log("Fetched posts:", postsData); // Debug log
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
      Alert.alert("Error", "Failed to fetch posts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log(`No user profile found for userId: ${userId}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Pick image for new post
  const pickImage = async () => {
    try {
      console.log("Requesting media library permissions...");
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permission result:", permissionResult);

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          "Permission to access gallery is required!"
        );
        return;
      }

      console.log("Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("Image picker result:", result);

      if (!result.canceled) {
        console.log("Image selected, URI:", result.assets[0].uri);
        setImage(result.assets[0].uri);
      } else {
        console.log("Image selection canceled");
      }
    } catch (error) {
      console.error("Error in pickImage:", error);
      Alert.alert("Error", "Failed to pick image: " + error.message);
    }
  };

  // Share a new post
  const handleSharePost = async () => {
    if (!description.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter a description for the post!"
      );
      return;
    }

    if (!user) {
      Alert.alert("Error", "You need to be logged in to share a post!");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = null;

      // Upload image to Firebase Storage if selected
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Fetch user profile data
      const userProfile = await fetchUserProfile(user.uid);
      if (!userProfile) {
        throw new Error("Failed to fetch user profile data");
      }

      // Save post to Firestore
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        username: user.email.split("@")[0], // Use email prefix as username
        profileImageUrl: userProfile.profileImageUrl || "", // Add profile image URL
        city: userProfile.city || "Unknown", // Add city
        description,
        imageUrl,
        timestamp: new Date(),
      });

      setDescription("");
      setImage(null);
      fetchPosts(); // Refresh posts
      Alert.alert("Success", "Post shared successfully!");
    } catch (error) {
      console.error("Error sharing post:", error);
      Alert.alert("Error", "Failed to share post: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update a post
  const handleUpdatePost = async () => {
    if (!editDescription.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter a description for the post!"
      );
      return;
    }

    try {
      setLoading(true);
      const postRef = doc(db, "posts", editPostId);
      await updateDoc(postRef, {
        description: editDescription,
        timestamp: new Date(), // Update timestamp
      });

      setEditModalVisible(false);
      setEditPostId(null);
      setEditDescription("");
      fetchPosts(); // Refresh posts
      Alert.alert("Success", "Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      Alert.alert("Error", "Failed to update post: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a post
  const handleDeletePost = async (postId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const postRef = doc(db, "posts", postId);
              await deleteDoc(postRef); // This will also delete the comments subcollection

              fetchPosts(); // Refresh posts
              Alert.alert("Success", "Post deleted successfully!");
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete post: " + error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Add a comment to a post
  const handleAddComment = async (postId) => {
    if (!comment.trim()) {
      Alert.alert("Validation Error", "Please enter a comment!");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You need to be logged in to comment!");
      return;
    }

    try {
      setLoading(true);
      // Fetch user profile data for the commenter
      const userProfile = await fetchUserProfile(user.uid);
      if (!userProfile) {
        throw new Error("Failed to fetch user profile data");
      }

      await addDoc(collection(db, `posts/${postId}/comments`), {
        userId: user.uid,
        username: user.email.split("@")[0], // Use email prefix as username
        profileImageUrl: userProfile.profileImageUrl || "", // Add profile image URL for commenter
        text: comment,
        timestamp: new Date(),
      });

      setComment("");
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (postId, currentDescription) => {
    setEditPostId(postId);
    setEditDescription(currentDescription);
    setEditModalVisible(true);
  };

  // Render each post
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image
          source={
            item.profileImageUrl
              ? { uri: item.profileImageUrl }
              : require("../assets/profile.jpeg") // Fallback to default image
          }
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.username}>{item.username}</Text>
          {/* Removed city display */}
        </View>
        {/* Show Edit/Delete buttons if the post belongs to the logged-in user */}
        {user && item.userId === user.uid && (
          <View style={styles.postActions}>
            <TouchableOpacity
              onPress={() => openEditModal(item.id, item.description)}
            >
              <Text style={styles.actionButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
              <Text
                style={[styles.actionButton, { color: theme.colors.error }]}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Post Description */}
      <Text style={styles.description}>{item.description}</Text>

      {/* Post Image */}
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      )}

      {/* Comment Section */}
      <View style={styles.commentSection}>
        {item.comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <Image
              source={
                comment.profileImageUrl
                  ? { uri: comment.profileImageUrl }
                  : require("../assets/profile.jpeg") // Fallback to default image
              }
              style={styles.commentProfileImage}
            />
            <View>
              <Text style={styles.commentUsername}>{comment.username}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          </View>
        ))}

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Type a message"
            placeholderTextColor={theme.colors.textLight}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={() => handleAddComment(item.id)}>
            <Text style={styles.sendButton}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.circle} />
        <Text style={styles.headerTitle}>Turmeric Protector</Text>
      </View>

      {/* New Post Section */}
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.newPostInput}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.colors.textLight}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {image ? (
          <Image source={{ uri: image }} style={styles.newPostImage} />
        ) : (
          <Text>No image selected</Text> // Debug UI to confirm image state
        )}
        <View style={styles.newPostButtons}>
          <Button title="Pick Image" onPress={pickImage} />
          <Button
            title="Share Post"
            onPress={handleSharePost}
            disabled={loading}
          />
        </View>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Edit Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Post</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Edit your description"
              placeholderTextColor={theme.colors.textLight}
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setEditModalVisible(false)}
                color={theme.colors.error}
              />
              <Button
                title="Update"
                onPress={handleUpdatePost}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: -30,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingTop: theme.spacing.extraLarge,
    paddingHorizontal: theme.spacing.large,
    position: "relative",
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
  headerTitle: {
    fontSize: theme.fontSizes.extraLarge,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  newPostContainer: {
    padding: theme.spacing.medium,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: theme.spacing.large,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  newPostInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: theme.spacing.medium,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  newPostImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: theme.spacing.medium,
  },
  newPostButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flatListContent: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.extraLarge,
  },
  postContainer: {
    marginBottom: theme.spacing.large,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    bottom: -20,
    shadowOffset: { width: 0, height: 2 },
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.medium,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.medium,
  },
  username: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  location: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textLight,
  },
  postActions: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  actionButton: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.medium,
  },
  description: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: theme.spacing.medium,
  },
  commentSection: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
  },
  comment: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.small,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: theme.spacing.small,
  },
  commentUsername: {
    fontSize: theme.fontSizes.small,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  commentText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textLight,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.medium,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: theme.spacing.small,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  sendButton: {
    marginLeft: theme.spacing.medium,
    color: theme.colors.primary,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.large,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    marginBottom: theme.spacing.medium,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: theme.spacing.medium,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DashboardScreen;
