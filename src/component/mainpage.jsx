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
    updateFilteredProducts(productsData);
  };

  const updateFilteredProducts = (productList) => {
    const filtered = productList.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      updateFilteredProducts(products);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, products]);

  const handleBid = async (productId, currentPrice, highestBid) => {
    const { name, price } = bidderData[productId] || {};

    if (!name || !price) {
      alert("入札者名と入札金額を入力してください。");
      return;
    }

    const bidPrice = parseInt(price, 10);

    // 入札金額が開始価格以上であることを確認
    if (bidPrice < currentPrice) {
      alert(
        `入札金額は開始価格（${currentPrice}円）以上である必要があります。`
      );
      return;
    }

    // 最高入札額が存在する場合、その金額より高いことを確認
    if (highestBid && bidPrice <= highestBid) {
      alert(
        `入札金額は現在の最高入札額（${highestBid}円）より高く設定してください。`
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
            backgroundColor: "#F2E8C2",
            fontSize: "24px",
            marginTop: "10px",
          }}
        >
          一番目の選択肢となる市場を目指して
        </p>
      </header>
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
                color: "black",
                backgroundColor: "#F2E8C2",
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.productName}
                style={{ width: "100px", height: "auto" }}
              />
              <h2>{product.productName}</h2>
              <p>出品者: {product.sellerName}</p>
              <p>開始価格: {product.productPrice}円</p>
              <p>最高入札者: {product.highestBidder || "なし"}</p>
              <p>最高入札額: {product.highestBid || "なし"}円</p>
              <p>
                現在の必要入札額:{" "}
                {(product.highestBid || product.productPrice) + 1}円以上
              </p>
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
                  onClick={() =>
                    handleBid(
                      product.id,
                      product.productPrice,
                      product.highestBid
                    )
                  }
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
