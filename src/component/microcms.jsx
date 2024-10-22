import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.VITE_MICROCMS_API_KEY,
});

// 商品データを取得する
export const getProduct = async (queries = {}) => {
  try {
    const listData = await client.get({
      endpoint: "overview",
      queries,
    });
    return listData;
  } catch (error) {
    console.error("エラーの名前だよ:", error.message || error);
    return null;
  }
};

// 商品データを削除する
export const deleteProduct = async (id) => {
  try {
    await client.delete({
      endpoint: "overview",
      contentId: id, // 削除する商品のID
    });
    console.log(`商品ID ${id} を削除しました`);
  } catch (error) {
    console.error("削除エラー:", error.message || error);
  }
};
