import React, { useState } from "react";
import "./RatingModal.css";
import { toast } from "react-toastify";

const RatingModal = ({ order, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating before submitting");
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the onSubmit function passed from the parent component
            await onSubmit({
                userId: order.userId,
                orderId: order.id,
                productId: order.productId,
                rating,
                comment
            });

            toast.success("Thank you for your feedback!");
            onClose();
        } catch (error) {
            toast.error("Failed to submit rating. Please try again.");
            console.error("Rating submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rating-modal-overlay" onClick={onClose}>
            <div className="rating-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="rating-modal-header">
                    <h2>Rate Your Experience</h2>
                    <button className="rating-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="rating-modal-product">
                    <img
                        src={order.productImage?.split("; ")[0] || "default-image.jpg"}
                        alt={order.title || "Product"}
                    />
                    <div className="rating-modal-product-info">
                        <h3>{order.title}</h3>
                        <p>Order #{order.orderNumber}</p>
                    </div>
                </div>

                <div className="rating-modal-stars">
                    <p>How would you rate this product?</p>
                    <div className="star-rating">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <span
                                    key={index}
                                    className={`star ${ratingValue <= (hover || rating) ? "active" : ""}`}
                                    onClick={() => handleRatingChange(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    ★
                                </span>
                            );
                        })}
                    </div>
                    <div className="rating-text">
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                    </div>
                </div>

                <div className="rating-modal-comment">
                    <label htmlFor="comment">Share your thoughts (optional)</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you liked or disliked about this product..."
                        rows={4}
                    />
                </div>

                <div className="rating-modal-actions">
                    <button
                        className="rating-cancel-btn"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="rating-submit-btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Rating"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;