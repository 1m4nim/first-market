import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

// Firestoreを初期化
const db = getFirestore();

const FirestoreService = () => {
    const [price, setPrice] = useState("");

    // 変更したいドキュメントのIDとコレクション名を指定
    const docRef = doc(db, "first-market", "products", "productId"); // productIdを適切なIDに変更

    const updateData = async () => {
        try {
            await updateDoc(docRef, {
                商品名: "商品の名前",
                商品説明: "商品の説明",
                商品画像: "商品の画像URL",
                価格: price, // フォームから取得した価格を使用
                出品者名: "出品者の名前",
            });
            console.log("Document successfully updated!");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="価格を入力"
            />
            <button onClick={updateData}>更新</button>
        </div>
    );
};

export default FirestoreService;
