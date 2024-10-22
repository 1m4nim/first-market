// PlaceBid.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import PlaceBid from "./PlaceBid"; // 入札するためのコンポーネント

function Auction() {
  const { id } = useParams(); // URLからIDを取得
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuction = async () => {
      const auctionRef = doc(db, "auctions", id);
      const auctionSnap = await getDoc(auctionRef);

      if (auctionSnap.exists()) {
        setAuction({ id: auctionSnap.id, ...auctionSnap.data() });
      } else {
        console.error("オークションが見つかりません");
      }
      setLoading(false);
    };

    fetchAuction();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div>
      {auction ? (
        <>
          <h2>{auction.name}</h2>
          <p>現在の入札額: {auction.currentBid}</p>
          <PlaceBid auction={auction} />
        </>
      ) : (
        <p>オークション情報がありません。</p>
      )}
    </div>
  );
}

export default Auction;
