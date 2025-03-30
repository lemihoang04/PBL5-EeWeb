import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import "./ProductInfo.css"; // Import file CSS

const ProductInfo = () => {
  const { productId } = useParams(); // Lấy productId từ URL
  const { products } = useContext(AppContext);
  console.log(products); // Kiểm tra xem products có dữ liệu không

  const [productInfo, setProductInfo] = useState(null);
  

  useEffect(() => {
    const fetchProductInfo = () => {
      const foundProduct = products.find((prod) => prod._id === productId);
      setProductInfo(foundProduct);
    };

    fetchProductInfo();
  }, [products, productId]);

  return (
    <div className="product-info-container">
      {/* Cột trái */}
      <div className="product-info-sidebar-left">
        <h2>Cột Trái</h2>
        <p>Nội dung cố định</p>
      </div>

      {/* Cột giữa */}
      <div className="product-info-main-content">
        <h2>Thông tin sản phẩm</h2>
        {productInfo ? (
          <div className="product-info-details">
            <h3>{productInfo.name}</h3>
            <p>{productInfo.description}</p>
            <p>Giá: {productInfo.price} VNĐ</p>
          </div>
        ) : (
          <p>Không tìm thấy sản phẩm.</p>
        )}
      </div>

      {/* Cột phải */}
      <div className="product-info-sidebar-right">
        <h2>Cột Phải</h2>
        <p>Nội dung cố định</p>
      </div>
    </div>
  );
};

export default ProductInfo;
