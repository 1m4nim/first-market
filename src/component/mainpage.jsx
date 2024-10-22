import { useState, useEffect } from "react";
import { getProduct } from "../microcms-client";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Main() {
  const [overviews, setOverviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOverviews, setFilteredOverviews] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState(""); // 入札者の名前を管理する状態
  const [highestBidInfo, setHighestBidInfo] = useState({
    // 最高入札情報を管理
    amount: 0,
    name: "",
  });

  useEffect(() => {
    const fetchOverviews = async () => {
      try {
        const data = await getProduct();
        if (data?.contents) {
          setOverviews(data.contents);
          console.log("取得したデータ:", data.contents);
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
    setBidAmount(""); // モーダルを開いたときに入力をクリア
    setBidderName(""); // モーダルを開いたときに入札者名をクリア
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
        setHighestBidInfo({
          amount: bidValue, // 新しい最高価格に更新
          name: bidderName, // 入札者名を更新
        });
      }
      console.log(
        `入札額: ¥${bidAmount} for ${currentProduct.name} by ${bidderName}`
      );
      closeBidModal();
    }
  };

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.title}>First-Market</h1>
        <p style={styles.description}>
          皆さんのお買い物の選択肢のなかで1番目の市場になりますように...
        </p>
      </header>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="商品名を検索..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.content}>
        {isLoading && <p>読み込み中...</p>}
        {error && <p style={styles.error}>エラーだよ！！！: {error}</p>}
        {overviews.length === 0 && !isLoading && <p>商品が見つかりません</p>}

        {filteredOverviews.length > 0 && (
          <div style={styles.overviewList}>
            {filteredOverviews.map((item) => (
              <div key={item.id} style={styles.itemContainer}>
                <h2>{item.name}</h2>
                {item.image && (
                  <img
                    src={item.image[0].url}
                    alt={item.name}
                    style={styles.itemImage}
                  />
                )}
                <p>{item.description}</p>
                <p style={styles.price}>価格: ¥{item.price.toLocaleString()}</p>
                <div style={styles.bidContainer}>
                  <button
                    onClick={() => openBidModal(item)}
                    style={styles.button}
                  >
                    入札する
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
      </div>

      {/* 入札モーダル */}
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
    </div>
  );
}

// スタイル
const styles = {
  header: {
    backgroundImage: "url('/assets/background.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center top",
    width: "100vw",
    height: "100vh",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    position: "relative",
    flexDirection: "column",
  },
  title: {
    color: "#BE7B6F",
    backgroundColor: "#d1c7cd",
    borderRadius: "5px",
    fontFamily: "Playwrite England SemiJoined",
    padding: "5px 10px",
  },
  description: {
    color: "black",
    fontWeight: "bold",
    fontSize: "20px",
    marginTop: "10px",
    textDecoration: "underline",
    width: "60%",
    textAlign: "center",
    backgroundColor: "white",
  },
  searchContainer: {
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
  },
  searchInput: {
    padding: "10px",
    width: "80%",
    maxWidth: "500px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  content: {
    padding: "20px",
  },
  error: {
    color: "red",
  },
  overviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },
  itemContainer: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    marginBottom: "10px",
    width: "80%",
    margin: "0 auto",
  },
  itemImage: {
    width: "25%",
    height: "auto",
    maxWidth: "600px",
    display: "block",
    margin: "15px auto",
  },
  price: {
    color: "#BE7B6F",
    fontSize: "1.2em",
    fontWeight: "bold",
    marginTop: "10px",
  },
  bidContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  highestBid: {
    marginLeft: "10px",
    fontWeight: "bold",
  },
  bidderInput: {
    marginBottom: "10px",
    padding: "8px",
    width: "100%",
  },
  bidInput: {
    marginBottom: "10px",
    padding: "8px",
    width: "100%",
  },
};
