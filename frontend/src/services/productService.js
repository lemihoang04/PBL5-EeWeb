import axios from "../setup/axios";

// Lấy tất cả sản phẩm
export const fetchAllProducts = async () => {
    try {
      const response = await axios.get("/products");
      // console.log("Full response:", response);
      if (!response) return [];
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.products)) return response.products;
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
};