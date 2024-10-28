import { useState, useEffect } from "react";
import {
  getProducts,
  deleteProduct,
  addProduct,
} from "../firebase/firebaseConfig";
import Modal from "react-modal";
import ProductForm from "./ProductForm";

Modal.setAppElement("#root");

export default function Main() {
  const [overviews, setOverviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOverviews, setFilteredOverviews] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [highestBidInfo, setHighestBidInfo] = useState({ amount: 0, name: "" });

  // データの取得
  useEffect(() => {
    const fetchOverviews = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        if (data?.contents) {
          setOverviews(data.contents);
          setFilteredOverviews(data.contents); // 初期状態でも全データを表示
        } else {
          setError("データの取得に失敗しました");
        }
      } catch (err) {
        console.error("エラーが発生しました:", err);
        setError("データの取得中にエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviews();
  }, []);

  // 検索フィルター
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOverviews(overviews); // 検索クエリが空の場合は全データを表示
    } else {
      const filtered = overviews.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOverviews(filtered);
    }
  }, [searchQuery, overviews]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openBidModal = (product) => {
    setCurrentProduct(product);
    setBidAmount("");
    setBidderName("");
    setModalIsOpen(true);
  };

  const closeBidModal = () => {
    setModalIsOpen(false);
    setBidAmount("");
    setBidderName("");
    setCurrentProduct(null);
  };

  const handleBidSubmit = () => {
    if (currentProduct && bidAmount && bidderName) {
      const bidValue = parseFloat(bidAmount);
      if (bidValue > highestBidInfo.amount) {
        setHighestBidInfo({ amount: bidValue, name: bidderName });
      } else {
        alert("入札額は現在の最高価格を超える必要があります。");
        return;
      }
      closeBidModal();
    }
  };

  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setCurrentProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (currentProduct) {
      try {
        await deleteProduct(currentProduct.id);
        setOverviews((prev) =>
          prev.filter((item) => item.id !== currentProduct.id)
        );
      } catch (err) {
        console.error("削除中にエラーが発生しました:", err);
      }
      closeDeleteModal();
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const productId = await addProduct(productData);
      setOverviews((prev) => [...prev, { id: productId, ...productData }]);
    } catch (error) {
      console.error("商品追加中にエラーが発生しました:", error);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    header: {
      backgroundImage: "url('/assets/background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      width: "100%",
      height: "50vh", // ヘッダーの高さを調整
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      padding: "20px",
    },
    mainContent: {
      flex: 1,
      padding: "20px",
      backgroundColor: "#fff",
    },
    title: {
      textAlign: "center",
      margin: "0",
      color: "#995143",
      fontWeight: "bold",
      fontSize: "45px",
      backgroundColor: "#E0C0A7",
      padding: "10px 20px",
      borderRadius: "5px",
    },
    description: {
      fontSize: "1.2em",
      color: "#666",
      textAlign: "center",
      backgroundColor: "white",
      fontWeight: "bold",
      padding: "10px 20px",
      borderRadius: "5px",
      marginTop: "20px",
    },
    searchContainer: {
      display: "flex",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    searchInput: {
      width: "300px",
      padding: "10px",
      fontSize: "1em",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    overviewList: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      padding: "20px 0",
    },
    itemContainer: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      margin: "10px",
      width: "80%",
      maxWidth: "800px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    price: {
      fontWeight: "bold",
      color: "#2c3e50",
      fontSize: "1.2em",
      marginTop: "10px",
    },
    bidContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "15px",
      gap: "10px",
    },
    actionButton: {
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s",
    },
    bidButton: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    deleteButton: {
      backgroundColor: "#ff4444",
      color: "white",
    },
    highestBid: {
      fontWeight: "bold",
      color: "#2c3e50",
    },
    error: {
      color: "#ff4444",
      textAlign: "center",
      padding: "20px",
    },
    loadingText: {
      textAlign: "center",
      padding: "20px",
      color: "#666",
    },
    noProductsText: {
      textAlign: "center",
      padding: "20px",
      color: "#666",
    },
    modal: {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "90%",
      },
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>First-Market</h1>
        <p style={styles.description}>
          皆さんのお買い物の選択肢のなかで1番目の市場になりますように...
        </p>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="商品名を検索..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>

        <ProductForm onAddProduct={handleAddProduct} />

        {isLoading ? (
          <p style={styles.loadingText}>読み込み中...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : filteredOverviews.length === 0 ? (
          <p style={styles.noProductsText}>商品が見つかりません。</p>
        ) : (
          <div style={styles.overviewList}>
            {filteredOverviews.map((item) => (
              <div key={item.id} style={styles.itemContainer}>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p style={styles.price}>
                  価格: ¥{item.price?.toLocaleString() || 0}
                </p>
                <div style={styles.bidContainer}>
                  <button
                    onClick={() => openBidModal(item)}
                    style={{ ...styles.actionButton, ...styles.bidButton }}
                  >
                    入札する
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                  >
                    削除
                  </button>
                  <span style={styles.highestBid}>
                    最高価格: ¥{highestBidInfo.amount.toLocaleString()} (入札者:{" "}
                    {highestBidInfo.name})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeBidModal}
          style={styles.modal}
          contentLabel="入札モーダル"
        >
          <h2>{currentProduct?.name} に入札</h2>
          <input
            type="text"
            placeholder="入札者名を入力..."
            value={bidderName}
            onChange={(e) => setBidderName(e.target.value)}
            style={styles.searchInput}
          />
          <input
            type="number"
            placeholder="入札額を入力..."
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            style={{ ...styles.searchInput, marginTop: "10px" }}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={handleBidSubmit}
              style={{ ...styles.actionButton, ...styles.bidButton }}
            >
              入札する
            </button>
            <button
              onClick={closeBidModal}
              style={{ ...styles.actionButton, backgroundColor: "#666" }}
            >
              キャンセル
            </button>
          </div>
          <p style={{ marginTop: "20px" }}>
            現在の最高価格: ¥{highestBidInfo.amount.toLocaleString()} (入札者:{" "}
            {highestBidInfo.name})
          </p>
        </Modal>

        <Modal
          isOpen={deleteModalIsOpen}
          onRequestClose={closeDeleteModal}
          style={styles.modal}
          contentLabel="削除確認モーダル"
        >
          <h2>{currentProduct?.name} を削除しますか？</h2>
          <p>この操作は元に戻せません。</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={handleDeleteConfirm}
              style={{ ...styles.actionButton, ...styles.deleteButton }}
            >
              削除する
            </button>
            <button
              onClick={closeDeleteModal}
              style={{ ...styles.actionButton, backgroundColor: "#666" }}
            >
              キャンセル
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
