import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../services/AppContext.jsx";
import { UserContext } from "../../context/UserProvider";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { addToCart } from "../../services/apiService.js";
import "./ProductInfo.css";

const extractRating = (ratingText) => {
  if (!ratingText) return null;
  const match = ratingText.match(/([\d.]+) out of 5 stars/);
  return match ? parseFloat(match[1]) : null;
};

const RatingStars = ({ rating }) => {
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return <p className="no-rating">No ratings yet</p>;
  }

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="rating-stars">
      {Array.from({ length: fullStars }, (_, i) => <FaStar key={`full-${i}`} />)}
      {halfStar ? <FaStarHalfAlt key="half" /> : null}
      {Array.from({ length: emptyStars }, (_, i) => <FaRegStar key={`empty-${i}`} />)}
      <span className="rating-count">{rating.toFixed(1)}</span>
    </div>
  );
};

const ProductImageGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images ? images[0] : null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleThumbnailClick = (image, index) => {
    setMainImage(image);
    setSelectedIndex(index);
  };

  if (!images || images.length === 0) {
    return <div className="product-no-image">No images available</div>;
  }

  return (
    <div className="product-gallery">
      <div className="main-image-container">
        <img src={mainImage} alt="Product" className="main-image" />
      </div>
      <div className="thumbnails">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail-wrapper ${index === selectedIndex ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(image, index)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="thumbnail" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductInfo = () => {
  const { productId } = useParams();
  const { user, fetchUser } = useContext(UserContext);
  const { products, fetchProducts } = useContext(AppContext);
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
      // Reset quantity and expanded state when product changes
      setQuantity(1);
      setIsDescriptionExpanded(false);
    }
  }, [products, productId]);

  const rating = productInfo ? extractRating(productInfo.rating) : null;

  // Find similar products (excluding current one)
  const similarProducts = products
    ? products
      .filter(prod => prod.id !== productInfo?.id)
      .slice(0, 8)
    : [];

  // Prepare product images
  const productImages = productInfo?.image
    ? productInfo.image.split('; ').filter(img => img && img.trim().length > 0)
    : [];

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

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
      const response = await addToCart(user.account.id, productInfo.id, quantity);
      if (response && response.errCode === 0) {
        toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart successfully!`);
        fetchUser();
      } else {
        toast.error(response?.error || "Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("An error occurred while adding the product to the cart.");
    }
  };

  // Handle the buy now action
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (!productInfo && products) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>We couldn't find the product you're looking for.</p>
        <button onClick={() => navigate('/')} className="return-home">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Product Gallery Section */}
        <section className="product-media">
          <ProductImageGallery images={productImages} />
        </section>

        {/* Product Information Section */}
        <section className="product-details">
          <div className="product-header">
            <h1 className="product-title">{productInfo?.title || "Loading..."}</h1>

            <div className="product-meta">
              <div className="product-rating-container">
                <RatingStars rating={rating} />
                <span className="review-count">
                  {productInfo?.reviews ? `(${productInfo.reviews} reviews)` : ''}
                </span>
              </div>

              <div className="product-id">ID: {productInfo?.id || 'N/A'}</div>
            </div>
          </div>

          <div className="product-pricing">
            <div className="current-price">
              {productInfo?.price ? `$${productInfo.price.toLocaleString()}` : "Price not available"}
            </div>
            {productInfo?.originalPrice && (
              <div className="original-price">
                ${productInfo.originalPrice.toLocaleString()}
              </div>
            )}
            {productInfo?.discount && <div className="discount-badge">-{productInfo.discount}%</div>}
          </div>

          <div className="product-description">
            <div className={`description-content ${isDescriptionExpanded ? 'expanded' : ''}`}>
              {productInfo?.description || "No description available."}
            </div>
            {productInfo?.description && productInfo.description.length > 200 && (
              <button
                className="read-more"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={decreaseQuantity} className="quantity-btn quantity-btn-left">-</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="quantity-input"
              />
              <button onClick={increaseQuantity} className="quantity-btn quantity-btn-right">+</button>
            </div>

            <div className="action-buttons">
              <button onClick={handleAddToCart} className="add-to-cart-btn">
                <FaShoppingCart /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="buy-now-btn">
                Buy Now
              </button>
            </div>

            <div className="secondary-actions">
              <button className="wishlist-btn">
                <FaHeart /> Save
              </button>
              <button className="share-btn">
                <IoShareSocialOutline /> Share
              </button>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="product-specs-section">
            <h2 className="section-title">Specifications</h2>
            <div className="specs-container">
              {productInfo && Object.entries(productInfo).map(([key, value]) => {
                if (!value || ['id', 'image', 'title', 'description', 'price', 'rating'].includes(key)) return null;
                return (
                  <div className="spec-item" key={key}>
                    <div className="spec-name">{key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}</div>
                    <div className="spec-value">{value.toString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="similar-products-section">
          <h2 className="section-title">Similar Products</h2>
          <div className="similar-products-grid">
            {similarProducts.map((product) => (
              <div
                key={product.id}
                className="similar-product-card"
                onClick={() => navigate(`/product-info/${product.id}`)}
              >
                <div className="similar-product-img-container">
                  <img
                    src={product.image ? product.image.split('; ')[0] : "/default-image.jpg"}
                    alt={product.title || "Product"}
                    className="similar-product-img"
                  />
                </div>
                <div className="similar-product-info">
                  <h3 className="similar-product-title">
                    {product.title
                      ? product.title.length > 40
                        ? `${product.title.substring(0, 40)}...`
                        : product.title
                      : "No title"}
                  </h3>
                  <div className="similar-product-price">
                    {product.price ? `$${product.price.toLocaleString()}` : "N/A"}
                  </div>
                  {product.rating && (
                    <div className="similar-product-rating">
                      <RatingStars rating={extractRating(product.rating)} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductInfo;