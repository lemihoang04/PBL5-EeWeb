import axios from "../setup/axios";

// Lấy tất cả sản phẩm
const fetchAllProducts = async () => {
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

// Xóa sản phẩm theo ID
const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`/product/${productId}`);
        return {
            success: true,
            message: response.message || "Sản phẩm đã được xóa thành công",
            data: response
        };
    } catch (error) {
        console.error("Error deleting product:", error);
        return {
            success: false,
            message: error.response?.data?.error || "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
            error
        };
    }
};
const fetchProductById = async (productId) => {
    try {
        const product = await axios.get(`/product/${productId}`);
        console.log("Product fetched successfully:", product);
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};
const fetchProductsByCategoryId = async (categoryId) => {
    try {
        const products = await axios.get(`/category/${categoryId}/products`); // Fetch products by category ID
        console.log("Products fetched successfully:", products);
        return products;
    } catch (error) {
        console.error("Error fetching laptops:", error);
        return [];
    }
};
export { fetchAllProducts, deleteProduct, fetchProductById, fetchProductsByCategoryId };