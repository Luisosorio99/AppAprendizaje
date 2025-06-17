// firebaseConfig.js

// firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBvNq-byjG0344co20j8h0QR_mUy6rqto4',
  authDomain: 'appaprendizaje-7af64.firebaseapp.com',
  projectId: 'appaprendizaje-7af64',
  storageBucket: 'appaprendizaje-7af64.appspot.com',  // ← corregido
  messagingSenderId: '489724215321',
  appId: '1:489724215321:web:2b473f15996c36ee4f2a88',
  measurementId: 'G-86C2JJYGX6',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { app, auth };
