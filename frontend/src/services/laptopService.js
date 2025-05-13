import axios from "../setup/axios";

const fetchLaptops = async () => {
  try {
    const laptops = await axios.get("/laptops");
    console.log("Laptops fetched successfully:", laptops);
    
    // The interceptor already returns response.data, so laptops is already the array we need
    
    // Normalize the laptop data to ensure consistent structure
    return (Array.isArray(laptops) ? laptops : []).map(laptop => ({
      id: laptop.id,
      title: laptop.title,
      price: laptop.price,
      image: laptop.image,
      rating: laptop.rating,
      description: laptop.description || '',
      brand: laptop.brand || '',
      screen_size: laptop.screen_size || '',
      ram: laptop.ram || '',
      processor_type: laptop.processor_type || '',
      storage_type: laptop.storage_type || '',
      storage_capacity: laptop.storage_capacity || '',
      cpuManufacturer: laptop.cpuManufacturer || '',
      operatingSystem: laptop.operatingSystem || '',
      graphicsCoprocessor: laptop.graphicsCoprocessor || '',
      weight: laptop.weight || ''
    }));
  } catch (error) {
    console.error("Error fetching laptops:", error);
    return [];
  }
};

export { fetchLaptops };
