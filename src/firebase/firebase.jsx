import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_6lYWBKG7lsAWlgfitLXok5e8ieBq9wc",
  authDomain: "first-market-b1776.firebaseapp.com",
  projectId: "first-market-b1776",
  storageBucket: "first-market-b1776.appspot.com",
  messagingSenderId: "998971297784",
  appId: "1:998971297784:web:7f5730552405ea70d2900d",
  measurementId: "G-41PT8907YH",
};
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
export default firebase;
