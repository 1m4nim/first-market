import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_6lYWBKG7lsAWlgfitLXok5e8ieBq9wc",
  authDomain: "first-market-b1776.firebaseapp.com",
  projectId: "first-market-b1776",
  storageBucket: "first-market-b1776.appspot.com",
  messagingSenderId: "998971297784",
  appId: "1:998971297784:web:7f5730552405ea70d2900d",
  measurementId: "G-41PT8907YH",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const storage = getStorage(app);

const ProductForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sellerName, setSellerName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showBitModl, setBitModal] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setMessage({
        text: "画像サイズは5MB以下にしてください。",
        isError: true,
      });
      return;
    }
    setProductImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });
    try {
      if (!productName.trim() || !productDescription.trim() || !productPrice) {
        throw new Error("すべての項目を入力してね！！！");
      }

      let imageUrl = "";
      if (productImage) {
        const storageRef = ref(
          storage,
          `product-images/${Date.now()}-${productImage.name}`
        );
        const uploadResult = await uploadBytes(storageRef, productImage);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const productData = {
        sellerName: sellerName.trim(),
        productName: productName.trim(),
        productDescription: productDescription.trim(),
        productPrice: parseFloat(productPrice),
        imageUrl: imageUrl || editingProduct?.imageUrl, // 画像が変更されない場合、既存の画像を保持
        createdAt: serverTimestamp(),
        status: "active",
      };

      if (editingProduct) {
        await deleteDoc(doc(db, "products", editingProduct.id));
        const docRef = await addDoc(collection(db, "products"), productData);
        setMessage({
          text: `商品が正常に更新されました！（ID: ${docRef.id}）`,
          isError: false,
        });
      } else {
        const docRef = await addDoc(collection(db, "products"), productData);
        setMessage({
          text: `商品が正常にアップロードされました！（ID: ${docRef.id}）`,
          isError: false,
        });
      }

      setProducts((prevProducts) => {
        if (editingProduct) {
          return prevProducts.map((product) =>
            product.id === editingProduct.id
              ? { ...productData, id: editingProduct.id }
              : product
          );
        }
        return [...prevProducts, { ...productData, id: docRef.id }];
      });

      // フォームをリセット
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: `エラーが発生しました: ${error.message}`,
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      setShowDeleteModal(false);
      setMessage({ text: "商品が正常に削除されました。", isError: false });
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage({
        text: `エラーが発生しました: ${error.message}`,
        isError: true,
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setSellerName(product.sellerName);
    setProductName(product.productName);
    setProductDescription(product.productDescription);
    setProductPrice(product.productPrice);
    setImagePreview(product.imageUrl);
    setProductImage(null); // 画像を保持
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setSellerName("");
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductImage(null);
    setImagePreview("");
    setIsFormOpen(false);
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleBidderChange = (productId, field, value) => {
    setBidderData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };
  const [filteredProducts, setFilteredProducts] = useState([]); // フィルタリングされた商品データ
  const [bidderData, setBidderData] = useState({}); // 各商品の入札者名と入札金額を管理

  const fetchProducts = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "products")); // Firestoreの"products"コレクションからデータを取得
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id, // FirestoreのIDを使用
      ...doc.data(), // 商品データを取得
    }));
    setProducts(productsData); // 取得した商品データをセット
    setFilteredProducts(productsData); // フィルタリングされた商品データを初期化
  };

  const handleBid = async (productId, currentPrice) => {
    const { name, price } = bidderData[productId] || {};
    if (!name || !price) {
      alert("入札者名と入札金額を入力してください。");
      return;
    } // 入札金額が現在の価格より高いか確認
    if (parseInt(price, 10) <= currentPrice) {
      alert(
        `入札金額は現在の価格より高く設定してください。現在の価格: ${currentPrice}円`
      );
      return;
    }
    const db = getFirestore();
    const productRef = doc(db, "products", productId);
    // Firestoreに入札者名と入札金額を更新
    await updateDoc(productRef, {
      highestBidder: name,
      highestBid: parseInt(price, 10),
    });
    fetchProducts(); // 更新後にリストを再取得
    setBidderData((prev) => ({
      ...prev,
      [productId]: { name: "", price: "" },
    })); // 入札者データをクリア
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#d1edda",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
    },
    button: {
      width: "100%",
      backgroundColor: "#007bff",
      color: "#fff",
      fontWeight: "bold",
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },

    button1: {
      width: "100%",
      backgroundColor: "red",
      color: "white",
      fontWeight: "bold",
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },

    button2: {
      width: "100%",
      backgroundColor: "#007bff",
      color: "#fff",
      fontWeight: "bold",
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    form: {
      display: isFormOpen ? "block" : "none",
      marginTop: "20px",
    },
    inputGroup: {
      marginBottom: "15px",
      color: "black",
    },
    inputLabel: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "black",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "16px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "16px",
      resize: "vertical",
    },
    imagePreview: {
      marginTop: "10px",
      width: "100%",
      maxWidth: "200px",
      borderRadius: "4px",
      objectFit: "cover",
    },
    productImage: {
      width: "100px",
      height: "auto",
      marginTop: "10px",
    },
    message: {
      marginTop: "10px",
      padding: "10px",
      borderRadius: "4px",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
    },
    successMessage: {
      backgroundColor: "#d4edda",
      color: "#155724",
    },
    productList: {
      marginTop: "20px",
      listStyleType: "none",
      padding: "0",
    },
    productItem: {
      marginBottom: "15px",
      padding: "15px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      backgroundColor: "#f2e8c2",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      marginTop: "20px",
    },
    modal: {
      display: showDeleteModal ? "block" : "none",
      position: "fixed",
      zIndex: 1000,
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    },
    input2: {
      fontSize: "24px",
      width: "80%",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: "black" }}>商品出品フォーム</h2>
      <button
        style={{
          ...styles.button,
          backgroundColor: isFormOpen ? "#edeb8a" : "blue",
          color: isFormOpen ? "black" : "white", // フォームを閉じるときだけ黄色にする
        }}
        onClick={() => setIsFormOpen(!isFormOpen)}
      >
        {isFormOpen ? "フォームを閉じる" : "出品する"}
      </button>

      {isFormOpen && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>出品者名</label>
            <input
              style={styles.input}
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>商品名</label>
            <input
              style={styles.input}
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>商品説明</label>
            <textarea
              style={styles.textarea}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>希望価格</label>
            <input
              style={styles.input}
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>画像アップロード</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={styles.imagePreview}
              />
            )}
          </div>
          <button type="submit" style={styles.button}>
            {loading ? "アップロード中..." : "送信"}
          </button>
          {message.text && (
            <div
              style={{
                ...styles.message,
                ...(message.isError
                  ? styles.errorMessage
                  : styles.successMessage),
              }}
            >
              {message.text}
            </div>
          )}
        </form>
      )}

      <ul style={styles.productList}>
        {products.map((product) => (
          <li key={product.id} style={styles.productItem}>
            <h3>{product.productName}</h3>
            <p>{product.productDescription}</p>
            <p>価格: ¥{product.productPrice}</p>
            <p>出品者: {product.sellerName}</p>
            <p>最高入札者: {product.highestBidder || "なし"}</p>
            <p>最高入札額: {product.highestBid || "なし"}円</p>{" "}
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.productName}
                style={styles.productImage}
              />
            )}
            <button
              onClick={() => handleBid(product.id, product.productPrice)}
              style={{ ...styles.button, marginTop: "10px" }}
            >
              入札
            </button>
            <input
              type="text"
              placeholder="入札者名"
              value={bidderData[product.id]?.name || ""}
              onChange={(e) =>
                handleBidderChange(product.id, "name", e.target.value)
              }
              style={{ ...styles.input2, marginRight: "10px" }}
            />
            <input
              type="number"
              placeholder="入札金額"
              value={bidderData[product.id]?.price || ""}
              onChange={(e) =>
                handleBidderChange(product.id, "price", e.target.value)
              }
              style={{ ...styles.input2, marginRight: "10px" }}
            />
            <button
              style={{ ...styles.button, ...styles.deleteButton }}
              onClick={() => confirmDeleteProduct(product)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      {showDeleteModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h4>削除確認</h4>
            <p>
              本当に「{productToDelete?.productName}
              」を削除してもよろしいですか？
            </p>
            <button
              style={styles.button1}
              onClick={() => deleteProduct(productToDelete.id)}
            >
              削除
            </button>
            <button
              style={styles.button2}
              onClick={() => setShowDeleteModal(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
