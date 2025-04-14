import axios from "../setup/axios";

const fetchCPUs = async () => {
  try {
    const response = await axios.get("/cpus"); 
    console.log("CPUs fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching CPUs:", error);
    return [];
  }
};

export { fetchCPUs };
