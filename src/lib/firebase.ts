import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDiB67pwKUa4oUV1XJ583gyjsCBU9Ye5BQ",
  authDomain: "wecare-hospitals-183e8.firebaseapp.com",
  projectId: "wecare-hospitals-183e8",
  storageBucket: "wecare-hospitals-183e8.firebasestorage.app",
  messagingSenderId: "33525071867",
  appId: "1:33525071867:web:479d7d57e0a0927394155e"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
