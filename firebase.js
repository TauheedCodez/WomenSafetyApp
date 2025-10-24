// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your_apikey",
  authDomain: "your_authDomain",
  projectId: "your_projectId",
  storageBucket: "your_storageBucket",
  messagingSenderId: "your_messagingSenderId",
  appId: "your_appId",
  measurementId: "your_measurementId"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth with AsyncStorage for persistence
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };