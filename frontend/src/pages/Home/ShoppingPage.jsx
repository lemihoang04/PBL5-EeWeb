import React, { useState } from 'react';
import './ShoppingPage.css';

const ShoppingPage = () => {
  const [minPrice, setMinPrice] = useState(8);
  const [maxPrice, setMaxPrice] = useState(11200);

  const updatePriceValues = () => {
    const min = Math.min(minPrice, maxPrice);
    const max = Math.max(minPrice, maxPrice);
    return `$${min} – $${max}+`;
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Filters</h2>

        <div className="price-filter">
          <h3>Price</h3>
          <div className="price-values">{updatePriceValues()}</div>
          <div className="price-range">
            <input
              type="range"
              min="8"
              max="11200"
              value={minPrice}
              onChange={(e) => setMinPrice(parseInt(e.target.value))}
            />
            <input
              type="range"
              min="8"
              max="11200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            />
            <button>Go</button>
          </div>
        </div>

        <div className="filter">
          <h3>Display Size</h3>
          <label><input type="checkbox" /> 17 Inches & Above</label><br />
          <label><input type="checkbox" /> 16 to 16.9 Inches</label><br />
          <label><input type="checkbox" /> 15 to 15.9 Inches</label><br />
          <label><input type="checkbox" /> 14 to 14.9 Inches</label><br />
          <label><input type="checkbox" /> 13 to 13.9 Inches</label><br />
          <label><input type="checkbox" /> 12 to 12.9 Inches</label><br />
          <label><input type="checkbox" /> 11 to 11.9 Inches</label><br />
          <label><input type="checkbox" /> 11 Inches & Under</label><br />
        </div>

        <div className="filter">
          <h3>RAM Size</h3>
          <label><input type="checkbox" /> 128 GB</label><br />
          <label><input type="checkbox" /> 64 GB</label><br />
          <label><input type="checkbox" /> 32 GB</label><br />
          <label><input type="checkbox" /> 16 GB</label><br />
          <label><input type="checkbox" /> 8 GB</label><br />
          <label><input type="checkbox" /> 4 GB</label><br />
          <label><input type="checkbox" /> 2 GB</label>
        </div>

        <div className="filter">
          <h3>Brands</h3>
          <label><input type="checkbox" /> HP</label><br />
          <label><input type="checkbox" /> Lenovo</label><br />
          <label><input type="checkbox" /> acer</label><br />
          <label><input type="checkbox" /> ASUS</label><br />
          <label><input type="checkbox" /> Dell</label><br />
          <label><input type="checkbox" /> Apple</label>
        </div>

        <div className="filter">
          <h3>Processor Type</h3>
          <label><input type="checkbox" /> Intel Core i7</label><br />
          <label><input type="checkbox" /> Intel Core i5</label><br />
          <label><input type="checkbox" /> AMD Ryzen 5</label><br />
          <label><input type="checkbox" /> AMD A-Series</label><br />
          <label><input type="checkbox" /> AMD A4</label><br />
          <label><input type="checkbox" /> AMD A6</label><br />
          <label><input type="checkbox" /> AMD Ryzen 3</label><br />
          <label><input type="checkbox" /> AMD Ryzen 7</label><br />
          <label><input type="checkbox" /> AMD Ryzen 9</label><br />
          <label><input type="checkbox" /> Intel Celeron</label><br />
          <label><input type="checkbox" /> Intel Core 2 Quad</label><br />
          <label><input type="checkbox" /> Intel Core i3</label><br />
          <label><input type="checkbox" /> Intel Core i9</label><br />
          <label><input type="checkbox" /> Intel Pentium</label><br />
        </div>

        <div className="filter">
          <h3>Operating System</h3>
          <label><input type="checkbox" /> Windows 11 Pro</label><br />
          <label><input type="checkbox" /> Windows 10 Pro</label><br />
          <label><input type="checkbox" /> Windows 11 Home</label><br />
          <label><input type="checkbox" /> Windows 11 in S mode</label><br />
          <label><input type="checkbox" /> Windows 10 Home</label><br />
          <label><input type="checkbox" /> Windows 10 in S mode</label><br />
          <label><input type="checkbox" /> Windows Legacy System</label><br />
          <label><input type="checkbox" /> Chrome OS</label>
        </div>

        <div className="filter">
          <h3>Hard Drive Size</h3>
          <label><input type="checkbox" /> 4 TB & Above</label><br />
          <label><input type="checkbox" /> 501 to 999 GB</label><br />
          <label><input type="checkbox" /> 321 to 500 GB</label><br />
          <label><input type="checkbox" /> 121 to 320 GB</label><br />
          <label><input type="checkbox" /> Up to 80 GB</label>
        </div>

        <div className="filter">
          <h3>CPU Model Manufacture</h3>
          <label><input type="checkbox" /> Intel</label><br />
          <label><input type="checkbox" /> AMD</label><br />
          <label><input type="checkbox" /> MediaTek</label><br />
          <label><input type="checkbox" /> Qualcomm</label>
        </div>
        <div className="filter">
          <h3>Processor Speed</h3>
          <label><input type="checkbox" /> 1 to 1.59 GHz</label><br />
          <label><input type="checkbox" /> 1.60 to 1.79 GHz</label><br />
          <label><input type="checkbox" /> 1.80 to 1.99 GHz</label><br />
          <label><input type="checkbox" /> 2.00 to 2.49 GHz</label><br />
          <label><input type="checkbox" /> 2.50 to 2.99 GHz</label><br />
          <label><input type="checkbox" /> 3.00 to 3.49 GHz</label><br />
          <label><input type="checkbox" /> 3.50 to 3.99 GHz</label><br />
          <label><input type="checkbox" /> 4.0 GHz & Above</label>
        </div>

        <div className="filter">
          <h3>Processor Count</h3>
          <label><input type="checkbox" /> 24 Inches</label><br />
          <label><input type="checkbox" /> 16 Inches</label><br />
          <label><input type="checkbox" /> 14 Inches</label><br />
          <label><input type="checkbox" /> 12 Inches</label><br />
          <label><input type="checkbox" /> 10 Inches</label>
        </div>

        <div className="filter">
          <h3>Hard Disk Description</h3>
          <label><input type="checkbox" /> SSD</label><br />
          <label><input type="checkbox" /> Emmc</label><br />
          <label><input type="checkbox" /> HDD</label>
        </div>

        <div className="filter">
          <h3>Graphics Card</h3>
          <label><input type="checkbox" /> Intel Iris Xe Graphics</label><br />
          <label><input type="checkbox" /> NVIDIA GeForce RTX 2060</label><br />
          <label><input type="checkbox" /> NVIDIA GeForce RTX 2070</label><br />
          <label><input type="checkbox" /> NVIDIA GeForce GTX 1650</label><br />
          <label><input type="checkbox" /> NVIDIA GeForce RTX 2080</label><br />
          <label><input type="checkbox" /> NVIDIA GeForce RTX 3050 Ti</label><br />
          <label><input type="checkbox" /> NVIDIA GeForce RTX 3070</label>
        </div>

        <div className="filter">
          <h3>Resolution</h3>
          <label><input type="checkbox" /> 1080p</label><br />
          <label><input type="checkbox" /> 4k</label><br />
          <label><input type="checkbox" /> 720p</label>
        </div>

        <div className="filter">
          <h3>Weight</h3>
          <label><input type="checkbox" /> Up to 3 Pounds</label><br />
          <label><input type="checkbox" /> 3 to 3.9 Pounds</label><br />
          <label><input type="checkbox" /> 4 to 4.9 Pounds</label><br />
          <label><input type="checkbox" /> 5 to 5.9 Pounds</label><br />
          <label><input type="checkbox" /> 6 to 6.9 Pounds</label><br />
          <label><input type="checkbox" /> 7 to 7.9 Pounds</label><br />
          <label><input type="checkbox" /> 8 Pounds & Above</label>
        </div>

        <div className="filter">
          <h3>RAM Type</h3>
          <label><input type="checkbox" /> DDR SDRAM</label><br />
          <label><input type="checkbox" /> DDR3 SDRAM</label><br />
          <label><input type="checkbox" /> DDR4 SDRAM</label><br />
          <label><input type="checkbox" /> DDR5 RAM</label>
        </div>


      </div>

      <div className="content">
        <h2>Results</h2>
        <div className="products">
          <div className="product">
            <img src="laptop1.jpg" alt="Laptop 1" />
            <h4>Jumper 2 in 1 Laptop, 16 inch Convertible</h4>
            <p className="price">$399.99</p>
            <p>16GB RAM, 640GB Storage, Touchscreen</p>
          </div>

          <div className="product">
            <img src="laptop2.jpg" alt="Laptop 2" />
            <h4>Gaming Laptop, 16" FHD Display</h4>
            <p className="price">$269.99</p>
            <p>16GB RAM, 512GB SSD, Intel N100</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;