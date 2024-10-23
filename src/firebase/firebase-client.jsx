// firebase-client.js
import { db } from "./firebase-config"; // Firestoreのインスタンスをインポート
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

// 商品データを取得する関数
export const getProducts = async () => {
  try {
    const productCollection = collection(db, "products"); // Firestoreのコレクションを参照
    const productSnapshot = await getDocs(productCollection);
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { contents: productList }; // MicroCMS形式に合わせてラップ
  } catch (error) {
    console.error("データ取得エラー:", error);
    throw error; // エラーを再スローして、呼び出し元でキャッチできるようにする
  }
};

// 商品の削除
export const deleteProduct = async (id) => {
  try {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
  } catch (error) {
    console.error("削除中にエラーが発生しました:", error);
    throw error; // エラーを再スローして、呼び出し元でキャッチできるようにする
  }
};
