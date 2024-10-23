import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, firestore } from "./firebase-config"; // firebase-config.jsからインポート

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // ファイル選択時のハンドラ
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // フォーム送信時のハンドラ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // エラーをリセット

    if (file) {
      try {
        const storageRef = ref(storage, `images/${file.name}`);

        // 画像をアップロード
        await uploadBytes(storageRef, file);

        // アップロードした画像のダウンロードURLを取得
        const imageUrl = await getDownloadURL(storageRef);

        // Firestoreに説明文と画像URLを保存
        await addDoc(collection(firestore, "images"), {
          url: imageUrl,
          description: description,
        });

        // フォームのリセット
        setFile(null);
        setDescription("");
        alert("画像と説明文がアップロードされました");
      } catch (error) {
        console.error("エラーが発生しました:", error);
        setError("アップロード中にエラーが発生しました");
      }
    } else {
      setError("画像を選択してください");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      <input
        type="text"
        placeholder="説明文を入力..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">アップロード</button>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* エラーメッセージの表示 */}
    </form>
  );
};

export default ImageUpload;
