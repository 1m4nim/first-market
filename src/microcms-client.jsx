import { createClient } from "microcms-js-sdk";

// MicroCMS クライアントを作成
export const client = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.VITE_MICROCMS_API_KEY,
});

client
  .get({
    endpoint: "overview",
  })
  .then((res) => console.log(res));

// 商品データを取得する関数
export const getProduct = async (queries) => {
  try {
    const listData = await client.getList({
      endpoint: "product",
      queries,
    });
    return listData;
  } catch (error) {
    console.error("エラーはこれ！:", error);
    return null;
  }
};
