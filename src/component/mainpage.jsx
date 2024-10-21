import { useState, useEffect } from "react";
import { getProduct } from "../microcms-client";

export default function Main() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProduct();
      if (data) {
        setProducts(data.contents);
      }
      setIsLoading(false);
    };

    fetchProducts();
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
  };

  const contentStyle = {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    marginBottom: "10px",
    width: "80%",
  };

  return (
    <div>
      <header style={headerStyle}>
        <h1 style={titleStyle}>First-Market</h1>
        <p style={descriptionStyle}>
          皆さんのお買い物の選択肢のなかで1番目の市場になりますように...
        </p>
      </header>

      <div style={{ padding: "20px", width: "100vw" }}>
        {isLoading ? (
          <p>読み込み中...</p>
        ) : (
          products.map((product) => (
            <div key={product.id} style={contentStyle}>
              <h2>{product.name}</h2>
              <p>{product.product_description}</p>
              {product.image && (
                <img
                  src={product.image.url}
                  alt={product.name}
                  style={{ width: "100vw", height: "auto", maxWidth: "600px" }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
