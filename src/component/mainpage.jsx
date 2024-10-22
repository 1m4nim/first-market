import { useState, useEffect } from "react";
import { getProduct } from "../microcms-client";

export default function Main() {
  const [overviews, setOverviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviews = async () => {
      try {
        const data = await getProduct();
        if (data && data.contents) {
          setOverviews(data.contents);
          console.log("取得したデータ:", data.contents);
        } else {
          setError("データの取得に失敗しました");
        }
      } catch (err) {
        console.error("エラーが発生しました:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviews();
  }, []);

  const headerStyle = {
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
  };

  const titleStyle = {
    color: "#BE7B6F",
    backgroundColor: "#d1c7cd",
    borderRadius: "5px",
    fontFamily: "Playwrite England SemiJoined",
    padding: "5px 10px",
  };

  const descriptionStyle = {
    color: "black",
    fontWeight: "bold",
    fontSize: "20px",
    marginTop: "10px",
    textDecoration: "underline",
    width: "60%",
    textAlign: "center",
    backgroundColor: "white",
  };

  const contentStyle = {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    marginBottom: "10px",
    width: "80%",
    margin: "0 auto",
  };

  const priceStyle = {
    color: "#BE7B6F",
    fontSize: "1.2em",
    fontWeight: "bold",
    marginTop: "10px",
  };

  return (
    <div>
      <header style={headerStyle}>
        <h1 style={titleStyle}>First-Market</h1>
        <p style={descriptionStyle}>
          皆さんのお買い物の選択肢のなかで1番目の市場になりますように...
        </p>
      </header>

      <div style={{ padding: "20px" }}>
        {isLoading ? (
          <p>読み込み中...</p>
        ) : error ? (
          <p style={{ color: "red" }}>エラーだよ！！！: {error}</p>
        ) : overviews.length === 0 ? (
          <p>商品が見つかりません</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            {overviews.map((item) => (
              <div key={item.id} style={contentStyle}>
                <h2>{item.name}</h2>
                {item.image && (
                  <img
                    src={item.image[0].url}
                    alt={item.name}
                    style={{
                      width: "25%",
                      height: "auto",
                      maxWidth: "600px",
                      display: "block",
                      margin: "15px auto",
                    }}
                  />
                )}
                <p>{item.description}</p>
                <p style={priceStyle}>価格: ¥{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
