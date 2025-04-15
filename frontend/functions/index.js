/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.resetPassword = functions.https.onCall(async (data, context) => {
  const { email, newPassword, otp } = data;

  // Verify OTP
  const docRef = admin.firestore().collection("passwordResets").doc(email);
  const doc = await docRef.get();
  if (!doc.exists || doc.data().otp !== otp) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid OTP");
  }

  // Update password
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().updateUser(user.uid, { password: newPassword });

  // Delete the password reset request
  await docRef.delete();

  return { message: "Password reset successful" };
});
