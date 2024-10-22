// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyVHDoqA5XiBJcdnpaJ7FATMb4fLTavgY",
  authDomain: "auth-f0950.firebaseapp.com",
  projectId: "auth-f0950",
  storageBucket: "auth-f0950.appspot.com",
  messagingSenderId: "8520126572",
  appId: "1:8520126572:web:abfe0ae0ecd32f5a91c849"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };