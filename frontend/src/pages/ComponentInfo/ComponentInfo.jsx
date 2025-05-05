import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { addToCart } from "../../services/apiService.js";
import { fetchComponents } from "../../services/componentService.js";   
import "../ProductInfo/ProductInfo.css";

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

const ComponentImageGallery = ({ images }) => {
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
        <img src={mainImage} alt="Component" className="main-image" />
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

const ComponentInfo = () => {
  const { componentId, type } = useParams();
  const { user, fetchUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [componentInfo, setComponentInfo] = useState(null);
  const [components, setComponents] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const validTypes = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case'];

  const normalizeType = (inputType) => {
    if (!inputType) return null;
    const lowerType = inputType.toLowerCase();
    return validTypes.find((validType) => validType.toLowerCase() === lowerType) || null;
  };

  const normalizedType = normalizeType(type);

  // Fetch components by type
  useEffect(() => {
    const loadComponents = async () => {
      const result = await fetchComponents(normalizedType);
      if (result.error) {
        toast.error(result.error);
        setComponents([]);
      } else {
        setComponents(result);
      }
    };
    loadComponents();
  }, [normalizedType]);

  // Update componentInfo when components or componentId changes
  useEffect(() => {
    if (components.length > 0 && componentId) {
      const foundComponent = components.find(
        (comp) => Number(comp.product_id) === Number(componentId)
      );
      setComponentInfo(foundComponent || null);
      setQuantity(1);
      setIsDescriptionExpanded(false);
    }
  }, [components, componentId]);

  const rating = componentInfo ? extractRating(componentInfo.rating) : null;

  // Find similar components (excluding current one)
  const similarComponents = components
    .filter((comp) => comp.product_id !== componentInfo?.product_id)
    .slice(0, 8);

  // Prepare component images
  const componentImages = componentInfo?.image
    ? componentInfo.image.split("; ").filter((img) => img && img.trim().length > 0)
    : [];

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!componentInfo) {
      toast.error("Component not found!");
      return;
    }
    if (!(user && user.isAuthenticated)) {
      toast.error("You must be logged in to add components to the cart!");
      navigate("/login");
      return;
    }
    try {
      const response = await addToCart(user.account.id, componentInfo.product_id, quantity);
      if (response && response.errCode === 0) {
        toast.success(`${quantity} ${quantity > 1 ? "items" : "item"} added to cart successfully!`);
        fetchUser();
      } else {
        toast.error(response?.error || "Failed to add component to cart.");
      }
    } catch (error) {
      console.error("Error adding component to cart:", error);
      toast.error("An error occurred while adding the component to the cart.");
    }
  };

  const handleBuyNow = () => {
    if (!componentInfo) return;
    const item = {
      product_id: componentInfo.product_id,
      price: componentInfo.price,
      title: componentInfo.title,
      quantity,
    };
    const amount = componentInfo.price ? componentInfo.price * quantity : 0;
    const isBuyNow = true;
    const items = [item];
    const formValue = { items, amount, isBuyNow };
    navigate("/checkout", {
      state: { formValue },
    });
  };

  if (!componentInfo && components.length > 0) {
    return (
      <div className="product-not-found">
        <h2>Component Not Found</h2>
        <p>We couldn't find the component you're looking for.</p>
        <button onClick={() => navigate("/")} className="return-home">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Component Gallery Section */}
        <section className="product-media">
          <ComponentImageGallery images={componentImages} />
        </section>

        {/* Component Information Section */}
        <section className="product-details">
          <div className="product-header">
            <h1 className="product-title">{componentInfo?.title || "Loading..."}</h1>

            <div className="product-meta">
              <div className="product-rating-container">
                <RatingStars rating={rating} />
                <span className="review-count">
                  {componentInfo?.reviews ? `(${componentInfo.reviews} reviews)` : ""}
                </span>
              </div>

              <div className="product-id">ID: {componentInfo?.product_id || "N/A"}</div>
            </div>
          </div>

          <div className="product-pricing">
            <div className="current-price">
              {componentInfo?.price
                ? `$${componentInfo.price.toLocaleString()}`
                : "Price not available"}
            </div>
            {componentInfo?.originalPrice && (
              <div className="original-price">
                ${componentInfo.originalPrice.toLocaleString()}
              </div>
            )}
            {componentInfo?.discount && (
              <div className="discount-badge">-{componentInfo.discount}%</div>
            )}
          </div>

          <div className="product-description">
            <div className={`description-content ${isDescriptionExpanded ? "expanded" : ""}`}>
              {componentInfo?.description || "No description available."}
            </div>
            {componentInfo?.description && componentInfo.description.length > 200 && (
              <button
                className="read-more"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={decreaseQuantity} className="quantity-btn quantity-btn-left">
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="quantity-input"
              />
              <button onClick={increaseQuantity} className="quantity-btn quantity-btn-right">
                +
              </button>
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

          {/* Component Specifications */}
          <div className="product-specs-section">
            <h2 className="section-title">Specifications</h2>
            <div className="specs-container">
              {componentInfo?.attributes ? (
                typeof componentInfo.attributes === 'string' ? (
                  componentInfo.attributes.split(",").map((attr, index) => {
                    const [name, value] = attr.split(":");
                    return (
                      <div className="spec-item" key={index}>
                        <div className="spec-name">{name}</div>
                        <div className="spec-value">{value}</div>
                      </div>
                    );
                  })
                ) : (
                  // Handle case where attributes is an object
                  Object.entries(componentInfo.attributes).map(([name, value], index) => (
                    <div className="spec-item" key={index}>
                      <div className="spec-name">{name}</div>
                      <div className="spec-value">{String(value)}</div>
                    </div>
                  ))
                )
              ) : (
                <p>No specifications available.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Similar Components Section */}
      {similarComponents.length > 0 && (
        <section className="similar-products-section">
          <h2 className="section-title">Similar Components</h2>
          <div className="similar-products-grid">
            {similarComponents.map((component) => (
              <div
                key={component.product_id}
                className="similar-product-card"
                onClick={() => navigate(`/component-info/${normalizeType}/${component.product_id}`)}
              >
                <div className="similar-product-img-container">
                  <img
                    src={
                      component.image ? component.image.split("; ")[0] : "/default-image.jpg"
                    }
                    alt={component.title || "Component"}
                    className="similar-product-img"
                  />
                </div>
                <div className="similar-product-info">
                  <h3 className="similar-product-title">
                    {component.title
                      ? component.title.length > 40
                        ? `${component.title.substring(0, 40)}...`
                        : component.title
                      : "No title"}
                  </h3>
                  <div className="similar-product-price">
                    {component.price ? `$${component.price.toLocaleString()}` : "N/A"}
                  </div>
                  {component.rating && (
                    <div className="similar-product-rating">
                      <RatingStars rating={extractRating(component.rating)} />
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

export default ComponentInfo;