import axios from "../setup/axios";

const fetchLaptops = async () => {
  try {
    const laptops = await axios.get("/laptops"); // Không cần .data nếu interceptor đã xử lý
    console.log("Laptops fetched successfully:", laptops);
    return laptops;
  } catch (error) {
    console.error("Error fetching laptops:", error);
    return [];
  }
};

export { fetchLaptops };
