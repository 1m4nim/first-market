import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.VITE_MICROCMS_API_KEY,
});

// 商品データを取得する
export const getProduct = async (queries = {}) => {
  try {
    const listData = await client.get({
      endpoint: "product",
      queries,
    });
    return listData;
  } catch (error) {
    console.error("エラーの名前だよ:", error.message || error);
    return null;
  }
};
