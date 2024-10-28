import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";

function AuctionList() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "auctions"),
      (snapshot) => {
        const auctionData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("取得したオークションデータ:", auctionData);
        setAuctions(auctionData);
      },
      (error) => {
        console.error(
          "オークションデータの取得中にエラーが発生しました:",
          error
        );
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {auctions.length === 0 ? (
        <p>オークションデータがありません</p>
      ) : (
        auctions.map((auction) => (
          <div key={auction.id}>
            <h2>{auction.name}</h2>
            <p>現在の入札額: {auction.currentBid}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AuctionList;
