import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import ProductForm from "./ProductForm";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bidderData, setBidderData] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsData);
    setFilteredProducts(productsData);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = products.filter((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, products]);

  const handleBid = async (productId, currentPrice) => {
    const { name, price } = bidderData[productId] || {};

    if (!name || !price) {
      alert("入札者名と入札金額を入力してください。");
      return;
    }

    const bidPrice = parseInt(price, 10);
    if (bidPrice <= currentPrice) {
      alert(
        `入札金額は現在の価格より高く設定してください。現在の価格: ${currentPrice}円`
      );
      return;
    }

    const db = getFirestore();
    const productRef = doc(db, "products", productId);

    await updateDoc(productRef, {
      highestBidder: name,
      highestBid: bidPrice,
    });

    fetchProducts();

    setBidderData((prev) => ({
      ...prev,
      [productId]: { name: "", price: "" },
    }));
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      const db = getFirestore();
      const productRef = doc(db, "products", productToDelete.id);
      await deleteDoc(productRef);
      fetchProducts();
      closeDeleteModal();
    }
  };

  const handleBidderChange = (productId, field, value) => {
    setBidderData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  return (
    <div>
      <header
        style={{
          backgroundImage: "url('/assets/background.jpg')",
          backgroundSize: "cover",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#754f6e",
          fontWeight: "bold",
          fontSize: "56px",
        }}
      >
        <div style={{ backgroundColor: "#E5D2CE", borderRadius: "30px" }}>
          First-Market
        </div>
        <p
          style={{
            color: "black",
            backgroundColor: "white",
            fontSize: "24px",
            marginTop: "10px",
          }}
        >
          皆さんにとって一番目の選択肢がこの市場になりますように
        </p>
      </header>
      {/* <p style={{ textAlign: "center" }}>
        入札するときは検索をかけて入札してね↓
      </p> */}
      <input
        type="text"
        placeholder="商品名で検索"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "300px",
          height: "52px",
          margin: "20px auto",
          display: "block",
        }}
      />
      {searchQuery && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
                margin: "10px",
                width: "200px",
                textAlign: "center",
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.productName}
                style={{ width: "100px", height: "auto" }}
              />
              <h2>{product.productName}</h2>
              <p>出品者: {product.sellerName}</p>
              <p>価格: {product.productPrice}円</p>
              <p>最高入札者: {product.highestBidder || "なし"}</p>
              <p>最高入札額: {product.highestBid || "なし"}円</p>
              {/* 入札者名と入札金額の入力 */}
              <input
                type="text"
                placeholder="入札者名"
                value={bidderData[product.id]?.name || ""}
                onChange={(e) =>
                  handleBidderChange(product.id, "name", e.target.value)
                }
                style={{ margin: "5px", width: "90%", fontSize: "24px" }}
              />
              <input
                type="number"
                placeholder="入札金額"
                value={bidderData[product.id]?.price || ""}
                onChange={(e) =>
                  handleBidderChange(product.id, "price", e.target.value)
                }
                style={{ margin: "5px", width: "90%", fontSize: "24px" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => handleBid(product.id, product.productPrice)}
                  style={{
                    backgroundColor: "#754f6e",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "5px",
                    flex: "1",
                  }}
                >
                  入札する
                </button>
                {/* 削除ボタン */}
                <button
                  onClick={() => openDeleteModal(product)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "5px",
                    flex: "1",
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* 削除モーダル */}
      {isDeleteModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p>本当にこの商品を削除しますか？</p>
            <button
              onClick={handleDelete}
              style={{ margin: "5px", backgroundColor: "red", color: "white" }}
            >
              はい
            </button>
            <button
              onClick={closeDeleteModal}
              style={{
                margin: "5px",
                backgroundColor: "#007BFF",
                color: "white",
              }}
            >
              いいえ
            </button>
          </div>
        </div>
      )}
      <ProductForm fetchProducts={fetchProducts} />
    </div>
  );
};

export default MainPage;
