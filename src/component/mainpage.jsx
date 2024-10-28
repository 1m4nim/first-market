import { useState, useEffect } from "react";

import {
  getProducts,
  deleteProduct,
  addProduct,
} from "../firebase/firebaseConfig";
import Modal from "react-modal";
import ProductForm from "./ProductForm";

// モーダルのアプリ要素を設定
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

  useEffect(() => {
    const fetchOverviews = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts(); // getProducts関数を呼び出す
        if (data?.contents) {
          setOverviews(data.contents);
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

  useEffect(() => {
    const filtered = overviews.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOverviews(filtered);
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
      console.log(
        `入札額: ¥${bidAmount} for ${currentProduct.name} by ${bidderName}`
      );
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
      const productId = await addProduct(productData); // Firestoreに商品を追加
      setOverviews((prev) => [...prev, { id: productId, ...productData }]); // 商品リストに追加
    } catch (error) {
      console.error("商品追加中にエラーが発生しました:", error);
    }
  };
  return (
    <div>
      <header style={styles.header}>
        {" "}
        <h1 style={styles.title}>First-Market</h1>
        <p style={styles.description}>
          皆さんのお買い物の選択肢のなかで1番目の市場になりますように...
        </p>
      </header>
      {/* 検索バーを出品フォームの上に移動 */}
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
      <div style={styles.content}>
        {isLoading && <p>読み込み中...</p>}
        {error && <p style={styles.error}></p>}
        {overviews.length === 0 && !isLoading}
        {/* 検索結果を表示する部分 */}
        <div style={styles.overviewList}>
          {filteredOverviews.length > 0 &&
            filteredOverviews.map((item) => (
              <div key={item.id} style={styles.itemContainer}>
                <h2>{item.name}</h2> <p>{item.description}</p>
                <p style={styles.price}>価格: ¥{item.price.toLocaleString()}</p>
                <div style={styles.bidContainer}>
                  <button onClick={() => openBidModal(item)}>入札する</button>{" "}
                  <button
                    onClick={() => openDeleteModal(item)}
                    style={styles.deleteButton}
                  >
                    削除
                  </button>
                  <span style={styles.highestBid}>
                    最高価格: ¥{highestBidInfo.amount.toLocaleString()} (入札者:{" "}
                    {highestBidInfo.name})
                  </span>
                </div>
              </div>
            ))}{" "}
        </div>
      </div>
      {/* 入札モーダル */}{" "}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeBidModal}
        contentLabel="入札モーダル"
      >
        <h2>{currentProduct?.name} に入札</h2>
        <input
          type="text"
          placeholder="入札者名を入力..."
          value={bidderName}
          onChange={(e) => setBidderName(e.target.value)}
          style={styles.bidderInput}
        />
        <input
          type="number"
          placeholder="入札額を入力..."
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          style={styles.bidInput}
        />
        <button onClick={handleBidSubmit}>入札する</button>
        <button onClick={closeBidModal}>キャンセル</button>
        <p>
          現在の最高価格: ¥{highestBidInfo.amount.toLocaleString()} (入札者:{" "}
          {highestBidInfo.name})
        </p>
      </Modal>
      {/* 削除確認モーダル */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="削除確認モーダル"
      >
        <h2>{currentProduct?.name} を削除しますか？</h2>
        <p>この操作は元に戻せません。</p>{" "}
        <button onClick={handleDeleteConfirm}>削除する</button>
        <button onClick={closeDeleteModal}>キャンセル</button>
      </Modal>
    </div>
  );
}

const styles = {
  header: {
    backgroundImage: "url('/assets/background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    margin: "0",
    color: "#995143",
    fontWeight: "bold",
    fontSize: "45px",
    backgroundColor: "#E0C0A7",
  },
  description: {
    fontSize: "1.2em",
    color: "#666",
    textAlign: "center",
    backgroundColor: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  searchInput: {
    width: "300px",
    padding: "10px",
    fontSize: "1em",
  },
  content: {
    padding: "20px",
  },
  overviewList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  itemContainer: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px",
    width: "300px",
    textAlign: "center",
  },
  price: { fontSize: "1.2em", fontWeight: "bold" },
  bidContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  highestBid: {
    marginLeft: "10px",
  },
  error: {
    color: "red",
  },
  bidderInput: { width: "100%", padding: "10px", margin: "5px 0" },
  bidInput: { width: "100%", padding: "10px", margin: "5px 0" },
};
