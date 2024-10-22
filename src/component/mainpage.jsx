import { useState, useEffect } from "react";
import { getProduct } from "../microcms-client";
import { Link } from "react-router-dom";

export default function Main() {
  const [overviews, setOverviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOverviews, setFilteredOverviews] = useState([]);

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
                <Link to={`/auction/${item.id}`} style={styles.link}>
                  入札する
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
  link: {
    textDecoration: "none",
    color: "#BE7B6F",
  },
};
