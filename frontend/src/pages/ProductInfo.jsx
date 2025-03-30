import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import "./ProductInfo.css";

const ProductInfo = () => {
  const { productId } = useParams();
  const { products } = useContext(AppContext);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const fetchProductInfo = () => {
      const foundProduct = products.find((prod) => prod._id === productId);
      setProductInfo(foundProduct);
    };

    fetchProductInfo();
  }, [products, productId]);

  // Lọc các sản phẩm khác (không bao gồm sản phẩm hiện tại)
  const otherProducts = products.filter((prod) => prod._id !== productId).slice(0,8);

  return (
    <div className="product-info-container">
      <div className="product-info-sidebar-left">
        <div style={{ textAlign: "center", width: "100%" }}>
          <h2>Ảnh Minh Họa</h2>
        </div>
        {productInfo && productInfo.image ? (
          <img
            src={productInfo.image}
            alt={productInfo.name}
            className="product-image"
          />
        ) : (
          <p>Không có hình ảnh</p>
        )}
      </div>

      <div className="product-info-main-content">
        <h2>Thông tin sản phẩm</h2>
        {productInfo ? (
          <div className="product-info-details">
            <h3>{productInfo.name}</h3>
            <p>{productInfo.description}</p>
            <p>Giá: {productInfo.price.toLocaleString()} VNĐ</p>
          </div>
        ) : (
          <p>Không tìm thấy sản phẩm.</p>
        )}

        <h2>Các sản phẩm khác</h2>
        <div className="other-products-container">
          {otherProducts.map((product) => (
            <div key={product._id} className="other-product-item">
              <img src={product.image} alt={product.name} className="other-product-image" />
              <h4>{product.name}</h4>
              <p>{product.price.toLocaleString()} VNĐ</p>
            </div>
          ))}
        </div>
      </div>

      <div className="product-info-sidebar-right">
        {productInfo ? (
          <div className="order-summary">
            <img src={productInfo.image} alt={productInfo.name} className="order-image" />
            <h3>{productInfo.name}</h3>
            <p className="product-color">Xanh Đậm</p>
            <p className="product-quantity">Số Lượng</p>
            <div className="quantity-control">
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>
            <p className="product-price">Tạm tính</p>
            <p className="total-price">{productInfo.price.toLocaleString()}đ</p>
            <button className="buy-now">Mua ngay</button>
            <button className="add-to-cart">Thêm vào giỏ</button>
          </div>
        ) : (
          <p>Không tìm thấy sản phẩm.</p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;