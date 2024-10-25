import { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore"; // Firestoreの関数をインポート
import firebase from "firebase/compat/app"; // Firebaseの初期化
import "firebase/compat/storage"; // Firebase Storageのインポート

const firebaseConfig = {
  apiKey: "AIzaSyC_6lYWBKG7lsAWlgfitLXok5e8ieBq9wc",
  authDomain: "first-market-b1776.firebaseapp.com",
  projectId: "first-market-b1776",
  storageBucket: "first-market-b1776.appspot.com",
  messagingSenderId: "998971297784",
  appId: "1:998971297784:web:7f5730552405ea70d2900d",
  measurementId: "G-41PT8907YH",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// モーダルのスタイル
const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "8px",
    background: "#fff",
    width: "200px", // モーダルの幅を調整
  },
};

// コンポーネント
const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: "",
    productName: "",
    productDescription: "",
    imageUrl: "",
    productPrice: "",
  });
  const [imageFile, setImageFile] = useState(null); // 追加: 画像ファイルの状態
  const [imagePreview, setImagePreview] = useState(""); // 画像プレビューの状態
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 削除モーダルの状態
  const [productToDelete, setProductToDelete] = useState(null); // 削除する商品の情報

  // 商品を取得する関数
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection("products")); // Firestoreの"products"コレクションからデータを取得
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id, // FirestoreのIDを使用
      ...doc.data(),
    }));
    setProducts(productsData);
  };

  // コンポーネントのマウント時に商品データを取得
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !currentProduct.productName ||
      !currentProduct.productDescription ||
      !currentProduct.productPrice
    ) {
      alert("全部埋めてね！");
      return;
    }
    try {
      const newProduct = {
        productName: currentProduct.productName,
        productDescription: currentProduct.productDescription,
        imageUrl: imageFile
          ? await uploadImage(imageFile)
          : currentProduct.imageUrl,
        productPrice: currentProduct.productPrice,
      };

      if (isEditMode) {
        await deleteDoc(doc("products", currentProduct.id)); // 古いデータを削除
      }

      await addDoc(collection("products"), newProduct); // 新しい商品を追加
      resetForm();
      fetchProducts(); // 商品リストを再取得
    } catch (error) {
      console.error("エラーだよ！！！:", error);
      alert("商品を出品できなかったよ...");
    }
  };

  // 画像をFirebase Storageにアップロードする関数
  const uploadImage = async (file) => {
    const storageRef = firebase.storage().ref(); // Firebase Storageの参照を取得
    const imageRef = storageRef.child(`images/${file.name}`); // 画像のパスを指定
    await imageRef.put(file); // 画像をアップロード
    return await imageRef.getDownloadURL(); // アップロードした画像のURLを取得
  };

  // モーダルを開く
  const handleOpenModal = (product) => {
    setCurrentProduct(product);
    setImageFile(null); // 画像をリセット
    setImagePreview(""); // プレビューをリセット
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // 商品を削除する
  const handleDeleteProduct = async () => {
    if (productToDelete) {
      await deleteDoc(doc("products", productToDelete)); // Firestoreから商品を削除
      setIsDeleteModalOpen(false); // 削除モーダルを閉じる
      fetchProducts(); // 商品リストを再取得
    }
  };

  // 削除モーダルを開く
  const openDeleteModal = (id) => {
    setProductToDelete(id); // 削除する商品IDをセット
    setIsDeleteModalOpen(true); // モーダルを開く
  };

  // フォームをリセットする
  const resetForm = () => {
    setCurrentProduct({
      id: "",
      productName: "",
      productDescription: "",
      imageUrl: "",
      productPrice: "",
    });
    setImageFile(null); // 追加: 画像ファイルのリセット
    setImagePreview(""); // プレビューもリセット
    setIsEditMode(false);
    setIsFormOpen(false);
  };

  // 戻るボタンの動作
  const handleBack = () => {
    resetForm(); // フォームをリセット
  };

  // 画像選択時の処理
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // プレビュー用URLを生成
    }
  };

  const styles = {
    title: { textAlign: "center", marginBottom: "20px", fontSize: "2rem" },
    centeredButton: { textAlign: "center", marginBottom: "20px" },
    button: {
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "background-color 0.3s",
      marginRight: "10px", // ボタン間に余白を追加
    },
    modalTitle: {
      textAlign: "center",
      fontSize: "1.5rem",
      marginBottom: "15px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    input: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "1rem",
    },
    productListTitle: {
      textAlign: "center",
      margin: "20px 0",
      fontSize: "1.5rem",
    },
    productList: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    productItem: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      marginBottom: "15px",
      width: "300px",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    productImage: {
      maxWidth: "100%",
      height: "auto",
      marginBottom: "10px",
    },
    editButton: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      margin: "5px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "background-color 0.3s",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      margin: "5px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "background-color 0.3s",
    },
    deleteModalContent: {
      textAlign: "center",
    },
  };

  return (
    <>
      <div style={styles.centeredButton}>
        <button
          onClick={handleOpenModal}
          style={{ backgroundColor: "blue", color: "white" }}
        >
          出品する
        </button>
      </div>

      <Modal isOpen={isFormOpen} onRequestClose={resetForm} style={modalStyles}>
        <h2 style={styles.modalTitle}>
          {isEditMode ? "商品を編集" : "商品を出品"}
        </h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="商品名"
            value={currentProduct.productName}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                productName: e.target.value,
              })
            }
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="商品説明"
            value={currentProduct.productDescription}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                productDescription: e.target.value,
              })
            }
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="価格"
            value={currentProduct.productPrice}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                productPrice: e.target.value,
              })
            }
            style={styles.input}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="プレビュー"
              style={styles.productImage}
            />
          )}
          <input type="text" placeholder="出品者名" style={styles.input} />
          <div style={styles.centeredButton}>
            <button type="submit" style={styles.button}>
              {isEditMode ? "更新" : "出品"}
            </button>
            <button onClick={handleBack} style={styles.button}>
              戻る
            </button>
          </div>
        </form>
      </Modal>

      {/* 商品リスト */}
      <h2 style={styles.productListTitle}>出品された商品</h2>
      <div style={styles.productList}>
        {products.map((product) => (
          <div key={product.id} style={styles.productItem}>
            <img
              src={product.imageUrl}
              alt={product.productName}
              style={styles.productImage}
            />
            <h3>{product.productName}</h3>
            <p>{product.productDescription}</p>
            <p>価格: ¥{product.productPrice}</p>
            <div>
              <button
                onClick={() => handleOpenModal(product)}
                style={styles.editButton}
              >
                編集
              </button>
              <button
                onClick={() => openDeleteModal(product.id)}
                style={styles.deleteButton}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 削除モーダル */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        style={modalStyles}
      >
        <div style={styles.deleteModalContent}>
          <h2>この商品を削除しますか？</h2>
          <div style={styles.centeredButton}>
            <button onClick={handleDeleteProduct} style={styles.deleteButton}>
              削除する
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              style={styles.button}
            >
              キャンセル
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductForm;
