export default function Main() {
  const headerstyle = {
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

  return (
    <header style={headerstyle}>
      <h1
        style={{
          color: "#BE7B6F",
          backgroundColor: "#d1c7cd",
          borderRadius: "5px",
        }}
      >
        First-Market
      </h1>
      <p
        style={{
          color: "black",
          fontWeight: "bold",
          marginTop: "10px",
          textDecoration: "underline",
        }}
      >
        皆さんのお買い物の選択肢のなかで1番目の市場になりますように...
      </p>
    </header>
  );
}
