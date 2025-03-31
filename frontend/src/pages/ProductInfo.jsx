import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import Images from "../components/Images.jsx";
import "./ProductInfo.css";

const ProductInfo = () => {
  const { productId } = useParams();
  const { products } = useContext(AppContext);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const foundProduct = products.find((prod) => Number(prod.id) === Number(productId));
    setProductInfo(foundProduct || null);
  }, [products, productId]);

  const otherProducts = products?.filter((prod) => Number(prod.id) !== Number(productId)).slice(0, 8) || [];

  return (
    <div className="product-info-container">
      <div className="product-info-sidebar-left">
        <h2>Ảnh Minh Họa</h2>
        {productInfo?.image ? <Images productId={productInfo.id} /> : <p>Không có hình ảnh</p>}
      </div>
      
      <div className="product-info-main-content">
        <h2>Thông tin sản phẩm</h2>
        {productInfo ? (
          <div className="product-info-details">
            <h3>{productInfo.title || "Không có tên sản phẩm"}</h3>
            <p>{productInfo.description || "Không có mô tả"}</p>
            <p>Giá: {productInfo.price ? productInfo.price.toLocaleString() : "Không có giá"} $</p>
            <p>Đánh giá: {productInfo.rating || "Chưa có đánh giá"}</p>
          </div>
        ) : (
          <p>Không tìm thấy sản phẩm.</p>
        )}

        {productInfo && (
          <>
            <h2>Thông tin chi tiết</h2>
            <table className="product-specs">
              <tbody>
                {Object.entries(productInfo).map(([key, value]) => (
                  key === "image" ? (
                    <tr key={key}><td>Hình ảnh</td><td><img src={Array.isArray(value) ? value[0] : value} alt="Product" className="product-spec-image"/></td></tr>
                  ) : (
                    value && <tr key={key}><td>{key.replace(/_/g, ' ')}</td><td>{value}</td></tr>
                  )
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {productInfo && (
        <div className="product-info-sidebar-right">
          <div className="order-summary">
            <img src={productInfo.image || "/default-image.jpg"} alt={productInfo.title} className="order-image" />
            <h3>{productInfo.title || "Không có tên sản phẩm"}</h3>
            <p className="product-price">Tạm tính</p>
            {productInfo.price && <p className="total-price">{productInfo.price.toLocaleString()}đ</p>}
            <button className="buy-now">Mua ngay</button>
            <button className="add-to-cart">Thêm vào giỏ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;