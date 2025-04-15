import { createContext, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [products, setProducts] = useState(null);

  const fetchProducts = async () => {
    if (products !== null) return;
    try {
      const response = await axios.get("http://127.0.0.1:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <AppContext.Provider value={{ products, fetchProducts }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;