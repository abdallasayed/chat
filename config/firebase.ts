import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { UploadClient } from "@uploadcare/upload-client";

// إعدادات فايربيز الخاصة بمشروع (مع بعض)
const firebaseConfig = {
  apiKey: "AIzaSyDXGZOSoeQeQx0tYEnCSTIPhmHud6Kt17Q",
  authDomain: "ma3a-ba3d.firebaseapp.com",
  projectId: "ma3a-ba3d",
  storageBucket: "ma3a-ba3d.firebasestorage.app",
  messagingSenderId: "464953058328",
  appId: "1:464953058328:web:d5276ac3e0cbdc9e144f6d",
  measurementId: "G-X1XPS77V5T"
};

// تهيئة فايربيز
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// تهيئة Uploadcare لرفع الصور بطلقة
export const uploadcare = new UploadClient({ publicKey: "740f07d1a15d7ad16ff0" });
