import React, { useState } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { fetchLaptops } from '../../services/laptopService'; // Adjust the import path as necessary
import './LaptopSearch.css';

const LaptopSearch = () => {
  const [laptops, setLaptops] = useState([]);
  const [priceRange, setPriceRange] = useState([15, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Số sản phẩm mỗi trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLaptops = laptops.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(laptops.length / itemsPerPage);

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

  useEffect(() => {
    const loadLaptops = async () => {
      const data = await fetchLaptops();
      console.log('Fetched laptops dat:', data); // Log the data to check its value
      setLaptops(data);
    };
    loadLaptops();
  }, []);
 
  
  // const laptopss = [
  //   {
  //     id: 1,
  //     name: 'HP 14 Laptop, Intel Celeron N4020, 4 GB RAM, 64 GB Storage, 14-inch Micro-edge HD Display, Windows 11 Home, Thin & Portable, 4K Graphics',
  //     price: 179.00,
  //     originalPrice: 299.99,
  //     rating: 4.5,
  //     ratingCount: 7708,
  //     purchaseCount: '70+ bought in past month',
  //     displaySize: '14 inches',
  //     diskSize: '64 GB',
  //     ram: '4 GB',
  //     os: 'Windows 11 S',
  //     image: 'https://m.media-amazon.com/images/I/41X799Q-wjL.jpg',
  //     delivery: {
  //       free: true,
  //       dates: 'Apr 16 - May 4',
  //       expedited: 'Apr 14 - 30',
  //       stock: '4 left in stock'
  //     }
  //   },
  //   {
  //     id: 2,
  //     name: 'Acer Aspire 3 A315-24P-R7VH Slim Laptop | 15.6" Full HD IPS Display | AMD Ryzen 3 7320U Quad-Core Processor | AMD Radeon Graphics | 8GB LPDDR5 | 128GB NVMe SSD | Wi-Fi 6',
  //     price: 329.99,
  //     rating: 4,
  //     ratingCount: 4112,
  //     purchaseCount: '4x+ bought in past month',
  //     displaySize: '15.6 inches',
  //     diskSize: '128 GB',
  //     ram: '8 GB',
  //     os: 'Windows 11 S',
  //     image: 'https://m.media-amazon.com/images/I/41X799Q-wjL.jpg',
  //     delivery: {
  //       free: true,
  //       dates: 'Wed, Apr 9',
  //       expedited: 'Tomorrow, Apr 5'
  //     }
  //   },
  //   {
  //     id: 3,
  //     name: 'HP 15.6" Business Laptop, Free Microsoft Office 2024 Lifetime License, Copilot AI Chat, HD Touchscreen Display, Intel 6-Core i3-1215U 4.4 GHz, 16GB RAM, 1TB SSD, Long Battery Life',
  //     price: 418.99,
  //     rating: 4.5,
  //     ratingCount: 198,
  //     purchaseCount: '20+ bought in past month',
  //     displaySize: '15.6 inches',
  //     diskSize: '1 TB',
  //     ram: '16 GB',
  //     os: 'Windows 11 Pro',
  //     image: 'https://m.media-amazon.com/images/I/41X799Q-wjL.jpg',
  //     delivery: {
  //       free: true,
  //       dates: 'Mon, Apr 7',
  //       expedited: 'Tomorrow, Apr 5',
  //       stock: '8 left in stock'
  //     }
  //   }
  // ];

  

  return (
   
    <div className="laptop-search-container">
      <div className="sidebar">
        <div className="filter-section">
          <h3>Display Size</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> 17 inches & Above</label>
            <label><input type="checkbox" /> 16 to 16.9 inches</label>
            <label><input type="checkbox" /> 15 to 15.9 inches</label>
            <label><input type="checkbox" /> 14 to 14.9 inches</label>
            <label><input type="checkbox" /> 13 to 13.9 inches</label>
            <label><input type="checkbox" /> 12 to 12.9 inches</label>
            <label><input type="checkbox" /> 11 to 11.9 inches</label>
            <label><input type="checkbox" /> 11 inches & Under</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Price</h3>
          <div className="price-label">${priceRange[0]} - ${priceRange[1].toLocaleString()}</div>
          <div className="price-slider">
            <input 
              type="range" 
              min="15" 
              max="10000" 
              value={priceRange[0]} 
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])} 
            />
            <input 
              type="range" 
              min="15" 
              max="10000" 
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} 
            />
          </div>
          <div className="price-controls">
            <button className="go-button">Go</button>
          </div>
        </div>

        <div className="filter-section">
          <h3>Deals & Discounts</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> All Discounts</label>
            <label><input type="checkbox" /> Today's Deals</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>RAM Size</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> 128 GB</label>
            <label><input type="checkbox" /> 64 GB</label>
            <label><input type="checkbox" /> 32 GB</label>
            <label><input type="checkbox" /> 16 GB</label>
            <label><input type="checkbox" /> 8 GB</label>
            <label><input type="checkbox" /> 4 GB</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Brands</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> HP</label>
            <label><input type="checkbox" /> Lenovo</label>
            <label><input type="checkbox" /> Acer</label>
            <label><input type="checkbox" /> Dell</label>
            <label><input type="checkbox" /> ASUS</label>
            <label><input type="checkbox" /> Apple</label>
            <label><input type="checkbox" /> Jumper</label>
            <div className="see-more">
              <span>See more</span>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Top Brands in Electronics</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Top Brands</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Processor Type</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> AMD A-Series</label>
            <label><input type="checkbox" /> AMD A10</label>
            <label><input type="checkbox" /> AMD A4</label>
            <label><input type="checkbox" /> AMD A6</label>
            <label><input type="checkbox" /> AMD A8</label>
            <div className="see-more">
              <span>See more</span>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Operating System</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Windows 11 Home</label>
            <label><input type="checkbox" /> Windows 11 Pro</label>
            <label><input type="checkbox" /> Windows 11 S mode</label>
            <label><input type="checkbox" /> Windows 10 Home</label>
          </div>
        </div>
      </div>

      <div className="results-container">
        <div className="results-header">
          <h2>Results</h2>
          <p>Check each product page for other buying options.</p>
          <div className="overall-picks">
            <span className="pick-label">Overall Pick</span>
          </div>
        </div>

        <div className="laptop-listings">
          {currentLaptops.map((laptop) => (
            <div className="laptop-item" key={laptop.id}>
              <div className="laptop-image">
                <img src={laptop.image.split("; ")[0]} alt={laptop.title} />
                
              </div>
              
              <div className="laptop-details">
                <div className="laptop-header">
                  <h3>{laptop.title}</h3>
                  <div className="rating">
                    <div className="stars" style={{ '--rating': laptop.rating }}></div>
                    <span className="rating-count">{laptop.rating}</span>
                  </div>
                  {/* <div className="purchase-info">{laptop.purchaseCount}</div> */}
                </div>
                
                <div className="laptop-price">
                  <div className="current-price">
                    <span className="dollar">$</span>
                    <span className="amount">{Math.floor(laptop.price)}</span>
                    <span className="cents">{(laptop.price % 1).toFixed(2).substring(2)}</span>
                  </div>
                  
                  {laptop.price && (
                    <div className="original-price">List: ${laptop.price }</div>
                  )}
                </div>
                
                <div className="laptop-specs">
                  <div className="spec">
                    <div className="spec-label">Display Size</div>
                    <div className="spec-value">{laptop.screen_size}</div>
                  </div>
                  <div className="spec">
                    <div className="spec-label">Weight</div>
                    <div className="spec-value">{laptop.item_weight}</div>
                  </div>
                  <div className="spec">
                    <div className="spec-label">RAM</div>
                    <div className="spec-value">{laptop.ram}</div>
                  </div>
                  <div className="spec">
                    <div className="spec-label">Operating System</div>
                    <div className="spec-value">{laptop.operating_system}</div>
                  </div>
                </div>
                
                {/* <div className="delivery-options">
                  {laptop.delivery.free && <div className="prime-logo"></div>}
                  <div className="delivery-info">
                    <div className="free-delivery">FREE delivery {laptop.delivery.dates}</div>
                    <div className="expedited-delivery">Or fastest delivery {laptop.delivery.expedited}</div>
                    {laptop.delivery.stock && (
                      <div className="stock-info">Only {laptop.delivery.stock.split(' ')[0]} left in stock - order soon.</div>
                    )}
                  </div>
                </div> */}
                
                <button className="add-to-cart">Add to cart</button>
                
                {/* <div className="more-buying-choices">
                  <div className="buying-choices-header">More Buying Choices</div>
                  {laptop.id === 1 && <div className="buying-choices-price">$141.15 (111+ used & new offers)</div>}
                  {laptop.id === 2 && <div className="buying-choices-price">$249.99 (13+ used & new offers)</div>}
                  {laptop.id === 3 && <div className="buying-choices-price">$417.99 (21+ used & new offers)</div>}
                </div> */}
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaptopSearch;