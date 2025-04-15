import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../theme";

// Manually defined disease data with descriptions
const diseaseData = [
  {
    name: "Dry Leaf",
    description:
      "Dry Leaf is characterized by wilted, brittle leaves with brown or yellow discoloration. It’s often caused by underwatering, excessive heat, or nutrient deficiencies.\n\n**Solution:**\n- Water the plant regularly, especially in dry conditions.\n- Provide shade to reduce heat stress.\n- Check and adjust soil nutrients with fertilizer.",
  },
  {
    name: "Healthy Leaf",
    description:
      "A Healthy Leaf is vibrant green, showing no signs of disease, discoloration, or wilting.\n\n**Solution:**\n- Continue regular watering and feeding.\n- Monitor for pests and diseases.\n- Ensure adequate sunlight and air flow.",
  },
  {
    name: "Leaf Blotch",
    description:
      "Leaf Blotch is a fungal disease causing irregular brown or black spots on leaves, potentially leading to leaf drop.\n\n**Solution:**\n- Remove and dispose of affected leaves.\n- Use fungicides as needed.\n- Water at the base to keep foliage dry.",
  },
];

const ImageScreen = () => {
  const [image, setImage] = useState(null);
  const [diseaseName, setDiseaseName] = useState("");
  const [diseaseDescription, setDiseaseDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  // Pick an image from the device
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Reset previous disease info when selecting a new image
      setDiseaseName("");
      setDiseaseDescription("");
    }
  };

  // Upload the image to the server and get the prediction
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    setUploading(true);

    let formData = new FormData();
    formData.append("file", {
      uri: image,
      name: "upload.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(
        "https://artistic-supposedly-snake.ngrok-free.app/predict",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const responseData = await response.json();

      // Get the predicted disease from the server
      const predictedClass = responseData.class;
      setDiseaseName(predictedClass);

      // Find and set the matching description from diseaseData
      const disease = diseaseData.find((d) => d.name === predictedClass);
      if (disease) {
        setDiseaseDescription(disease.description);
      } else {
        setDiseaseDescription("No description available for this disease.");
      }
    } catch (error) {
      Alert.alert("Upload Failed", "Something went wrong");
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.circle} />
            <Text style={styles.title}>Image Analysis</Text>
          </View>

          {/* Image Upload Section */}
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.noImageText}>No image selected</Text>
            )}
            <Button
              title="Pick an Image"
              onPress={pickImage}
              color={theme.colors.primary}
            />
            <Button
              title={uploading ? "Uploading..." : "Submit"}
              onPress={uploadImage}
              color={theme.colors.primary}
              disabled={uploading || !image} // Disable if uploading or no image
            />
          </View>

          {/* Disease Details Section */}
          <View style={styles.diseaseContainer}>
            {/* Disease Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Name of the Disease</Text>
              {diseaseName ? (
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionText}>{diseaseName}</Text>
                </View>
              ) : (
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionText}>
                    Upload an image to see the disease name.
                  </Text>
                </View>
              )}
            </View>

            {/* Disease Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Description & Solution
              </Text>
              {diseaseDescription ? (
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionText}>{diseaseDescription}</Text>
                </View>
              ) : (
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionText}>
                    Upload an image to see the description and solution.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles (unchanged)
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
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.extraLarge,
  },
  header: {
    position: "relative",
    alignItems: "center",
    marginBottom: theme.spacing.large,
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
  title: {
    fontSize: theme.fontSizes.extraLarge,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.large,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: theme.spacing.medium,
  },
  noImageText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.medium,
  },
  diseaseContainer: {
    marginTop: theme.spacing.medium,
  },
  section: {
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.textLight,
    backgroundColor: "#d3d3d3",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: theme.spacing.small,
  },
  sectionContent: {
    backgroundColor: "#FFF5F5",
    borderRadius: 10,
    padding: theme.spacing.medium,
  },
  sectionText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    lineHeight: 22,
  },
});

export default ImageScreen;