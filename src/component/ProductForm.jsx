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
      if (
        !productName.trim() ||
        !productDescription.trim() ||
        !productPrice ||
        !productImage
      ) {
        throw new Error("すべての項目を入力してください。");
      }
      const storageRef = ref(
        storage,
        `product-images/${Date.now()}-${productImage.name}`
      );
      const uploadResult = await uploadBytes(storageRef, productImage);
      const imageUrl = await getDownloadURL(uploadResult.ref);
      const productData = {
        sellerName: sellerName.trim(),
        productName: productName.trim(),
        productDescription: productDescription.trim(),
        productPrice: parseFloat(productPrice),
        imageUrl,
        createdAt: serverTimestamp(),
        status: "active",
      };
      const docRef = await addDoc(collection(db, "products"), productData);
      setMessage({
        text: `商品が正常にアップロードされました！（ID: ${docRef.id}）`,
        isError: false,
      });
      setProducts((prevProducts) => [
        ...prevProducts,
        { ...productData, id: docRef.id },
      ]);
      setSellerName("");
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductImage(null);
      setImagePreview("");
      setIsFormOpen(false);
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
      setMessage({ text: "商品が正常に削除されました。", isError: false });
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage({
        text: `エラーが発生しました: ${error.message}`,
        isError: true,
      });
    }
  };
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#ffffff",
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
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    form: {
      display: isFormOpen ? "block" : "none",
      marginTop: "20px",
    },
    inputGroup: {
      marginBottom: "15px",
    },
    inputLabel: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
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
    },
    productItem: {
      padding: "10px",
      borderBottom: "1px solid #ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    productImage: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "4px",
    },
  };
  return (
    <div style={styles.container}>
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        style={styles.button}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            styles.buttonHover.backgroundColor)
        }
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
      >
        {isFormOpen ? "フォームを閉じる" : "商品を出品する"}
      </button>
      <div style={styles.form}>
        <h2>商品出品フォーム</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>出品者名</label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>商品名</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>商品画像</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
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
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>商品説明</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              style={styles.textarea}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>希望価格 (円)</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            {loading ? "アップロード中..." : "出品する"}
          </button>
        </form>
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
      </div>
      <div style={styles.productList}>
        <h2>出品された商品</h2>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} style={styles.productItem}>
              <img
                src={product.imageUrl}
                alt={product.productName}
                style={styles.productImage}
              />
              <div>
                <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>価格: {product.productPrice} 円</p>
              </div>
              <button
                onClick={() => deleteProduct(product.id)}
                style={{
                  ...styles.button,
                  backgroundColor: "#dc3545",
                  width: "25%",
                }}
              >
                削除
              </button>
            </div>
          ))
        ) : (
          <p>出品された商品はありません。</p>
        )}
      </div>
    </div>
  );
};
export default ProductForm;
