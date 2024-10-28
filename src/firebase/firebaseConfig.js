import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Firebaseアプリの初期化（ここに実際のFirebase設定を入力）
const firebaseConfig = {
    apiKey: "AIzaSyC_6lYWBKG7lsAWlgfitLXok5e8ieBq9wc",
    authDomain: "first-market-b1776.firebaseapp.com",
    projectId: "first-market-b1776",
    storageBucket: "first-market-b1776.appspot.com",
    messagingSenderId: "998971297784",
    appId: "1:998971297784:web:7f5730552405ea70d2900d",
    measurementId: "G-41PT8907YH",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 商品を追加する関数
export async function addProduct(productData) {
    const docRef = await addDoc(collection(db, "products"), productData);
    return docRef.id;
}

// 商品を取得する関数
export async function getProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 商品を削除する関数
export async function deleteProduct(id) {
    await deleteDoc(doc(db, "products", id));
}
