import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDXGZOSoeQeQx0tYEnCSTIPhmHud6Kt17Q",
  authDomain: "ma3a-ba3d.firebaseapp.com",
  projectId: "ma3a-ba3d",
  storageBucket: "ma3a-ba3d.firebasestorage.app",
  messagingSenderId: "464953058328",
  appId: "1:464953058328:web:d5276ac3e0cbdc9e144f6d"
};

let app, auth, db;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    
    // هنا الذكاء: لو إحنا فاتحين من أندرويد أو أيفون، استخدم ذاكرة الموبايل
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    } else {
      // لو فاتحين من متصفح الويب (زي ما إنت عملت)، استخدم الطريقة العادية
      auth = getAuth(app);
    }
  } else {
    app = getApp();
    auth = getAuth(app);
  }
  db = getFirestore(app);
} catch (error) {
  console.log("Fallback init...");
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
