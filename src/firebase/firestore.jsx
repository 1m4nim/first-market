// firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC_6lYWBKG7lsAWlgfitLXok5e8ieBq9wc",
  authDomain: "first-market-b1776.firebaseapp.com",
  projectId: "first-market-b1776",
  storageBucket: "first-market-b1776.appspot.com",
  messagingSenderId: "998971297784",
  appId: "1:998971297784:web:7f5730552405ea70d2900d",
  measurementId: "G-41PT8907YH",
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

export default app;