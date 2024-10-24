// firebase-config.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // Storageのインポート
import { getFirestore } from "firebase/firestore"; // Firestoreのインポート
import { getAnalytics } from "firebase/analytics"; // Analyticsのインポート

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyC_6lYWBKG7lsAWlgfitLXok5e8ieBq9wc",
    authDomain: "first-market-b1776.firebaseapp.com",
    projectId: "first-market-b1776",
    storageBucket: "first-market-b1776.appspot.com",
    messagingSenderId: "998971297784",
    appId: "1:998971297784:web:7f5730552405ea70d2900d",
    measurementId: "G-41PT8907YH"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Storageの初期化
const db = getFirestore(app); // Firestoreの初期化
const analytics = getAnalytics(app); // Analyticsの初期化

// 必要なサービスをエクスポート
export { db as firestore, storage, analytics };
