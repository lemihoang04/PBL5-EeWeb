import React, { useState, useEffect } from "react";
import "./Images.css";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Images = ({ productId }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    if (productId) {
      axios.get(`http://127.0.0.1:5000/product-images/${productId}`)
        .then(response => {
          setImages(response.data);
          if (response.data.length > 0) {
            setSelectedImage(response.data[0]);
          }
        })
        .catch(error => console.error("Error fetching product images:", error));
    }
  }, [productId]);

  const handleNext = () => {
    if (startIndex + itemsPerPage < images.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <div className="carousel-container">
      <div className="main-image">
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" className="product-image" />
        ) : (
          <p>Không có hình ảnh</p>
        )}
      </div>
      <div className="thumbnail-navigation">
        <button className="nav-button left" onClick={handlePrev} disabled={startIndex === 0}>
          <FaChevronLeft />
        </button>
        <div className="thumbnail-container">
          {images.slice(startIndex, startIndex + itemsPerPage).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              className={`thumbnail ${selectedImage === image ? "selected" : ""}`}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
        <button
          className="nav-button right"
          onClick={handleNext}
          disabled={startIndex + itemsPerPage >= images.length}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Images;