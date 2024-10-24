import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyC_6lYWBKG7lsAWlgfitLXok5e8ieBq9wc",
  authDomain: "first-market-b1776.firebaseapp.com",
  projectId: "first-market-b1776",
  storageBucket: "first-market-b1776.appspot.com",
  messagingSenderId: "998971297784",
  appId: "1:998971297784:web:7f5730552405ea70d2900d",
  measurementId: "G-41PT8907YH",
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 商品データを追加する関数
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    return docRef.id; // 新しく追加された商品のIDを返す
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error; // エラーを投げて呼び出し元で処理
  }
};

// 商品データを取得する関数
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products; // 取得した商品データの配列を返す
  } catch (error) {
    console.error("Error getting products: ", error);
    throw error; // エラーを投げて呼び出し元で処理
  }
};

// 商品データを更新する関数
export const updateProduct = async (id, updatedData) => {
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, updatedData);
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error; // エラーを投げて呼び出し元で処理
  }
};

// 商品データを削除する関数
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error; // エラーを投げて呼び出し元で処理
  }
};
