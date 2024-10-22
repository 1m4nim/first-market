import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./component/mainpage.jsx"; // ここでMainをインポート
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Main /> {/* Mainコンポーネントをここでレンダリング */}
    </Router>
  </StrictMode>
);
