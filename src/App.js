import ProductForm from './component/ProductForm';
import Mainpage from "./component/Mainpage";;
import AuctionList from './component/AuctionList';
function App() {
  return (
    <div>
      <h1>商品アップロードフォーム</h1>
      {/* ImageUploadコンポーネントをレンダリング */}
      <ProductForm />
      <Mainpage />
      <AuctionList />
    </div>
  );
}
export default App;