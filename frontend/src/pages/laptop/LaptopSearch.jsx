import React, { useState } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { fetchLaptops } from '../../services/laptopService'; // Adjust the import path as necessary
import './LaptopSearch.css';
import { useNavigate } from 'react-router-dom';

const LaptopSearch = () => {
  const [laptops, setLaptops] = useState([]);
  const [priceRange, setPriceRange] = useState([15, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Số sản phẩm mỗi trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLaptops = laptops.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(laptops.length / itemsPerPage);

  const [filteredLaptops, setFilteredLaptops] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

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
const handleSearch = (e) => {
  const term = e.target.value.toLowerCase();
  // setSearchTerm(term);

  // Lọc danh sách laptop theo tiêu đề
  const filtered = laptops.filter((laptop) =>
    laptop.title.toLowerCase().includes(term)
  );
  setFilteredLaptops(filtered);
};

  useEffect(() => {
    const loadLaptops = async () => {
      const data = await fetchLaptops();
      console.log('Fetched laptops dat:', data); // Log the data to check its value
      setLaptops(data);
    };
    loadLaptops();
  }, []);

  return (
   
    <div className="laptop-search-container">
      <div className="sidebar">
        <div className="filter-section">
          <h3>Display Size</h3>
          <div className="checkbox-gr</div>oup">
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
          <h3>CPU Model Manufacture</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Intel</label>
            <label><input type="checkbox" /> AMD</label>
            <label><input type="checkbox" /> MediaTek</label>
            <label><input type="checkbox" /> Qualcomm</label>
          </div>
        </div>
        <div className="filter-section">
          <h3>Weight</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Up to 3 Pounds</label>
            <label><input type="checkbox" /> 3 to 3.9 Pounds</label>
            <label><input type="checkbox" /> 4 to 4.9 Pounds</label>
            <label><input type="checkbox" /> 5 to 5.9 Pounds</label>
            <label><input type="checkbox" /> 6 to 6.9 Pounds</label>
            <label><input type="checkbox" /> 7 to 7.9 Pounds</label>
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
        <div className="filter-section">
          <h3>Graphics Coprocessor</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Intel Iris Xe Graphics</label>
            <label><input type="checkbox" /> NVIDIA GeForce RTX 2060</label>
            <label><input type="checkbox" /> NVIDIA GeForce RTX 2070</label>
            <label><input type="checkbox" /> NVIDIA GeForce GTX 1650</label>
            <label><input type="checkbox" /> NVIDIA GeForce RTX 2080</label>
            <label><input type="checkbox" /> NVIDIA GeForce RTX 3050 Ti</label>
            <label><input type="checkbox" /> NVIDIA GeForce RTX 3070</label>
          </div>
        </div>
      </div>

      <div className="results-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for laptops..."
            // value={searchTerm}
            onChange={handleSearch}
          />
        </div>
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
                <h3
                  className="laptop-title"
                  onClick={() => navigate(`/product-info/${laptop.id}`)}
                  style={{ cursor: 'pointer', color: '#0066c0' }}
                >
                  {laptop.title}
                </h3>
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