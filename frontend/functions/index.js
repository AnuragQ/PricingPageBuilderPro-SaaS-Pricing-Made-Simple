const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkEmailRegistered = functions.https.onCall(async (data, context) => {
  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with one argument "email".');
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return { registered: true };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return { registered: false };
    }
    // Forward other errors.
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
});
