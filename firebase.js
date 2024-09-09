import { initializeApp } from '@react-native-firebase/app';  // From React Native Firebase
import { getAuth } from '@react-native-firebase/auth';        // From React Native Firebase

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

let app;
if (!initializeApp.apps?.length) {
  app = initializeApp(firebaseConfig);
} else {
  app = initializeApp.apps[0];
}

// Use React Native Firebase Auth
export const auth = getAuth(app);
