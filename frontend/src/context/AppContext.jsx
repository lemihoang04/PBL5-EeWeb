import { createContext } from "react";
import { iphones } from "../assets/images/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const value = {
    products: iphones, // Đổi từ `iphones` thành `products`
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
