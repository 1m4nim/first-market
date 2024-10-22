import { createClient } from "microcms-js-sdk";

// 環境変数の存在確認
const serviceDomain = import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.VITE_MICROCMS_API_KEY;

// デバッグ情報（値は表示せず、存在確認のみ）
console.log("環境変数チェック:");
console.log("VITE_MICROCMS_SERVICE_DOMAIN exists:", !!serviceDomain);
console.log("VITE_MICROCMS_API_KEY exists:", !!apiKey);

if (!serviceDomain || !apiKey) {
  console.error("環境変数が設定されていません");
  throw new Error("Required environment variables are missing");
}

// MicroCMS クライアントを作成
export const client = createClient({
  serviceDomain,
  apiKey,
});

// 商品データを取得する関数
export const getProduct = async () => {
  try {
    console.log("API リクエスト開始");
    // まず単純な GET リクエストを試してみる
    const data = await client.get({
      endpoint: "overview",
    });
    console.log("データ取得成功");
    return data;
  } catch (error) {
    console.error("API リクエストエラー:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        serviceDomain: !!serviceDomain, // 存在確認のみ
        apiKey: !!apiKey, // 存在確認のみ
      },
    });
    throw error;
  }
};
