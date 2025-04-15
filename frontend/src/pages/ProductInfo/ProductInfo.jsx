import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../services/AppContext.jsx";
import { UserContext } from "../../context/UserProvider";
import Images from "../../components/Images.jsx";
import "./ProductInfo.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { fetchLaptops } from '../../services/laptopService';
import { toast } from "react-toastify";
import { addToCart } from "../../services/apiService.js";

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
  const { user } = useContext(UserContext);
  const { products, fetchProducts } = useContext(AppContext);
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState(null);

  // Fetch products only if not already loaded
  useEffect(() => {
    if (!products) {
      fetchProducts();
    }
  }, [products, fetchProducts]);

  // Update productInfo when products or productId changes
  useEffect(() => {
    if (products && productId) {
      const foundProduct = products.find((prod) => Number(prod.id) === Number(productId));
      setProductInfo(foundProduct || null);
    }
  }, [products, productId]);

  const rating = productInfo ? extractRating(productInfo.rating) : null;
  const productIndex = products ? products.findIndex((prod) => Number(prod.id) === Number(productId)) : -1;

  // Calculate other products
  const otherProducts = products && productIndex !== -1
    ? products.slice(Math.max(0, productIndex - 4), productIndex).concat(products.slice(productIndex + 1, productIndex + 5))
    : [];

  const handleAddToCart = async () => {
    if (!productInfo) {
      toast.error("Product not found!");
      return;
    }
    if (!(user && user.isAuthenticated)) {
      toast.error("You must be logged in to add products to the cart!");
      navigate('/login');
      return;
    }
    try {
      const response = await addToCart(user.account.id, productInfo.id, 1);
      if (response && response.errCode === 0) {
        toast.success("Product added to cart successfully!");
      } else {
        toast.error(response.error || "Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("An error occurred while adding the product to the cart.");
    }
  };

  return (
    <div className="product-info-container">
      <div className="product-info-sidebar-left">
        {productInfo?.image ? <Images productId={productInfo.id} /> : <p>Không có hình ảnh</p>}
      </div>

      <div className="product-info-main-content">
        {productInfo ? (
          <div className="product-info-details">
            <h3>{productInfo.title || "Không có tên sản phẩm"}</h3>
            <p>{productInfo.description || "Không có mô tả"}</p>
            <p
              className="product-price"
              style={{ color: "red", fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Giá: {productInfo.price ? `${productInfo.price.toLocaleString()} $` : "Không có giá"}
            </p>
            <div className="product-rating">
              <p>Đánh giá:</p>
              <RatingStars rating={rating} />
            </div>
          </div>
        ) : (
          <p>Không tìm thấy sản phẩm.</p>
        )}

        {productInfo && (
          <>
            <h2>Thông tin chi tiết</h2>
            <table className="product-specs">
              <tbody>
                {Object.entries(productInfo).map(([key, value]) => {
                  if (!value || key === "id") return null;
                  return key === "image" ? (
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
                    <tr key={key}>
                      <td>{key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</td>
                      <td>{value}</td>
                    </tr>
                  );
                })}
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
                  alt={product.title || "Sản phẩm"}
                  className="other-product-image"
                />
                <h4>
                  {product.title
                    ? product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase()
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
              src={productInfo.image ? productInfo.image.split("; ")[0] : "/default-image.jpg"}
              alt={productInfo.title}
              className="order-image"
            />
            <h3>{productInfo.title || "Không có tên sản phẩm"}</h3>
            <p className="product-price">Tạm tính</p>
            {productInfo.price && <p className="total-price">{productInfo.price.toLocaleString()} $</p>}
            <button className="buy-now" onClick={() => navigate('/checkout')}>
              Buy now
            </button>
            <button onClick={handleAddToCart} className="add-to-cart">
              Add to cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;