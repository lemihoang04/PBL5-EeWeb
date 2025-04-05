import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import Images from "../components/Images.jsx";
import "./ProductInfo.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const extractRating = (ratingText) => {
  if (!ratingText) return null;
  const match = ratingText.match(/([\d.]+) out of 5 stars/);
  return match ? parseFloat(match[1]) : null;
};

const RatingStars = ({ rating }) => {
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return <p style={{ color: "gray" }}>Chưa có đánh giá</p>;
  }

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div style={{ color: "#FFD700", display: "flex", alignItems: "center" }}>
      {Array.from({ length: fullStars }, (_, i) => <FaStar key={`full-${i}`} />)}
      {halfStar ? <FaStarHalfAlt key="half" /> : null}
      {Array.from({ length: emptyStars }, (_, i) => <FaRegStar key={`empty-${i}`} />)}
    </div>
  );
};

const ProductInfo = () => {
  const { productId } = useParams();
  const { products } = useContext(AppContext);
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const foundProduct = products.find((prod) => Number(prod.id) === Number(productId));
    setProductInfo(foundProduct || null);
  }, [products, productId]);

  const rating = productInfo ? extractRating(productInfo.rating) : null;
  const productIndex = products?.findIndex((prod) => Number(prod.id) === Number(productId));

  const otherProducts =
    productIndex !== -1
      ? products.slice(Math.max(0, productIndex - 4), productIndex).concat(products.slice(productIndex + 1, productIndex + 5))
      : [];

  return (
    <>
      <div className="product-info-container">
        <div className="product-info-sidebar-left">
          {productInfo?.image ? <Images productId={productInfo.id} /> : <p>Không có hình ảnh</p>}
        </div>

        <div className="product-info-main-content">
          {productInfo ? (
            <div className="product-info-details">
              <h3>{productInfo.title || "Không có tên sản phẩm"}</h3>
              <p>{productInfo.description || ""}</p>
              {/* <p className="product-price">Giá: {productInfo.price ? `${productInfo.price.toLocaleString()} $` : "Không có giá"}</p> */}
              <p
                className="product-price"
                style={{ color: "red", fontSize: "1.5rem", fontWeight: "bold" }}
              >
                Giá: {productInfo.price ? `${productInfo.price.toLocaleString()} $` : "Không có giá"}
              </p>
              <p>Đánh giá:</p>
              <RatingStars rating={rating} />
            </div>
          ) : (
            <p>Không tìm thấy sản phẩm.</p>
          )}

          {productInfo && (
            <>
              <h2>Thông tin chi tiết</h2>
              <table className="product-specs">
                <tbody>
                  {Object.entries(productInfo).map(([key, value]) =>
                    key === "image" ? (
                      <tr key={key}>
                        <td>Hình ảnh</td>
                        <td>
                          <img
                            src={Array.isArray(value) ? value[0] : value}
                            alt="Product"
                            className="product-spec-image"
                          />
                        </td>
                      </tr>
                    ) : (
                      value && (
                        <tr key={key}>
                          {/* <td>{key.replace(/_/g, " ")}</td> */}
                          <td>{key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</td>
                          <td>{value}</td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </>
          )}

          <h2>Các sản phẩm khác</h2>
          <div className="other-products-container">
            {otherProducts.length > 0 ? (
              otherProducts.map((product) => (
                <div
                  key={product.id}
                  className="other-product-item"
                  onClick={() => navigate(`/product-info/${product.id}`)}
                >
                  <img
                    src={product.image || "/default-image.jpg"}
                    alt={product.brand || "Sản phẩm"}
                    className="other-product-image"
                  />
                  <h4>
                    {product.brand
                      ? product.brand.charAt(0).toUpperCase() + product.brand.slice(1).toLowerCase()
                      : "Không có tên"}
                  </h4>

                  {product.price && <p>{product.price.toLocaleString()} $</p>}
                </div>
              ))
            ) : (
              <p>Không có sản phẩm liên quan.</p>
            )}
          </div>
        </div>

        {productInfo && (
          <div className="product-info-sidebar-right">
            <div className="order-summary">
              <img
                src={productInfo.image || "/default-image.jpg"}
                alt={productInfo.title}
                className="order-image"
              />
              <h3>{productInfo.brand || "Không có tên sản phẩm"}</h3>
              <p className="product-price">Tạm tính</p>
              {productInfo.price && <p className="total-price">{productInfo.price.toLocaleString()}$</p>}
              <button className="buy-now">Mua ngay</button>
              <button className="add-to-cart">Thêm vào giỏ</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductInfo;
