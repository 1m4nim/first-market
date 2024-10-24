// // App.js
import ProductForm from './component/ProductForm';
import Mainpage from "./component/Mainpage";
import PlaceBid from "./component/PlaceBid";
import AuctionList from './component/AuctionList';


function App() {
  return (
    <div>
      <h1>商品アップロードフォーム</h1>
      {/* ImageUploadコンポーネントをレンダリング */}
      <ProductForm />
      <Mainpage />
      <PlaceBid />
      <AuctionList />
    </div>
  );
}

export default App;

