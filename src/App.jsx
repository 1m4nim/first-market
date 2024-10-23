// // App.js
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Main from "./component/Main"; // Mainコンポーネントをインポート
// import PlaceBid from "./component/PlaceBid"; // PlaceBidコンポーネントをインポート

// function App() {
//   return (
//     <Router>
//       <Switch>
//         <Route path="/" exact component={Main} />
//         <Route path="/auction/:id" component={PlaceBid} />
//       </Switch>
//     </Router>
//   );
// }

// export default App;

import ImageUpload from "./ImageUpload"; // ImageUploadコンポーネントをインポート

const App = () => {
  return (
    <div>
      <h1>画像アップロード</h1>
      <ImageUpload /> {/* ImageUploadコンポーネントを表示 */}
    </div>
  );
};

export default App;
