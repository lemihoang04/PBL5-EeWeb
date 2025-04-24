import React, { useState, useEffect } from 'react';
import { fetchLaptops } from '../../services/laptopService'; // Adjust the import path as necessary
import './LaptopSearch.css';
import { useNavigate } from 'react-router-dom';

const LaptopSearch = () => {
  const [laptops, setLaptops] = useState([]);
  const [priceRange, setPriceRange] = useState([15, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter states
  const [filters, setFilters] = useState({
    screenSize: [],
    ramSize: [],
    brand: [],
    cpuManufacturer: [],
    weight: [],
    processorType: [],
    operatingSystem: [],
    graphicsCoprocessor: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const navigate = useNavigate();

  // Apply all filters to laptops
  useEffect(() => {
    let results = [...laptops];

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(laptop =>
        laptop.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price range filter
    results = results.filter(laptop =>
      laptop.price >= priceRange[0] && laptop.price <= priceRange[1]
    );

    // Apply screen size filter
    if (filters.screenSize.length > 0) {
      results = results.filter(laptop => {
        if (!laptop.screen_size) return false;
        const screenSize = parseFloat(laptop.screen_size);

        return filters.screenSize.some(size => {
          if (size === "17 inches & Above" && screenSize >= 17) return true;
          if (size === "16 to 16.9 inches" && screenSize >= 16 && screenSize < 17) return true;
          if (size === "15 to 15.9 inches" && screenSize >= 15 && screenSize < 16) return true;
          if (size === "14 to 14.9 inches" && screenSize >= 14 && screenSize < 15) return true;
          if (size === "13 to 13.9 inches" && screenSize >= 13 && screenSize < 14) return true;
          if (size === "12 to 12.9 inches" && screenSize >= 12 && screenSize < 13) return true;
          if (size === "11 to 11.9 inches" && screenSize >= 11 && screenSize < 12) return true;
          if (size === "11 inches & Under" && screenSize < 11) return true;
          return false;
        });
      });
    }

    // Apply RAM filter
    if (filters.ramSize.length > 0) {
      results = results.filter(laptop =>
        filters.ramSize.some(size => laptop.ram && laptop.ram.includes(size))
      );
    }

    // Apply brand filter
    if (filters.brand.length > 0) {
      results = results.filter(laptop =>
        filters.brand.includes(laptop.brand)
      );
    }

    // Apply CPU manufacturer filter
    if (filters.cpuManufacturer.length > 0) {
      results = results.filter(laptop => {
        return filters.cpuManufacturer.some(manufacturer =>
          laptop.processor_brand && laptop.processor_brand.includes(manufacturer)
        );
      });
    }

    // Apply weight filter
    if (filters.weight.length > 0) {
      results = results.filter(laptop => {
        if (!laptop.item_weight) return false;
        const weight = parseFloat(laptop.item_weight);

        return filters.weight.some(weightRange => {
          if (weightRange === "Up to 3 Pounds" && weight <= 3) return true;
          if (weightRange === "3 to 3.9 Pounds" && weight > 3 && weight < 4) return true;
          if (weightRange === "4 to 4.9 Pounds" && weight >= 4 && weight < 5) return true;
          if (weightRange === "5 to 5.9 Pounds" && weight >= 5 && weight < 6) return true;
          if (weightRange === "6 to 6.9 Pounds" && weight >= 6 && weight < 7) return true;
          if (weightRange === "7 to 7.9 Pounds" && weight >= 7 && weight < 8) return true;
          return false;
        });
      });
    }

    // Apply OS filter
    if (filters.operatingSystem.length > 0) {
      results = results.filter(laptop =>
        filters.operatingSystem.some(os => laptop.operating_system && laptop.operating_system.includes(os))
      );
    }

    // Apply processor type filter
    if (filters.processorType.length > 0) {
      results = results.filter(laptop =>
        filters.processorType.some(processor => laptop.processor_type && laptop.processor_type.includes(processor))
      );
    }

    // Apply graphics filter
    if (filters.graphicsCoprocessor.length > 0) {
      results = results.filter(laptop =>
        filters.graphicsCoprocessor.some(gpu => laptop.graphics_coprocessor && laptop.graphics_coprocessor.includes(gpu))
      );
    }

    setFilteredLaptops(results);
  }, [laptops, filters, priceRange, searchTerm]);

  // Handle checkbox change for filters
  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[category].includes(value)) {
        // Remove the value if it's already in the array
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        // Add the value if it's not in the array
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      return updatedFilters;
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Apply price filter
  const applyPriceFilter = () => {
    setCurrentPage(1); // Reset to first page when price filter is applied
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when search changes
  };

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

  const toggleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands);
  };

  // Pagination
  const displayLaptops = filteredLaptops.length > 0 ? filteredLaptops : laptops;
  const totalPages = Math.ceil(displayLaptops.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLaptops = displayLaptops.slice(indexOfFirstItem, indexOfLastItem);

  // Extract unique brands from laptops
  useEffect(() => {
    if (laptops.length > 0) {
      const brands = [...new Set(laptops.map(laptop => laptop.brand).filter(Boolean))];
      setAvailableBrands(brands);
    }
  }, [laptops]);

  useEffect(() => {
    const loadLaptops = async () => {
      const data = await fetchLaptops();
      console.log('Fetched laptops data:', data);
      if (data && Array.isArray(data)) {
        setLaptops(data);
        setFilteredLaptops(data);
      }
    };
    loadLaptops();
  }, []);

  return (
    <div className="laptop-search-container">
      <div className="sidebar">
        <div className="filter-section">
          <h3>Display Size</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={filters.screenSize.includes("17 inches & Above")}
                onChange={() => handleFilterChange("screenSize", "17 inches & Above")}
              />
              17 inches & Above
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.screenSize.includes("16 to 16.9 inches")}
                onChange={() => handleFilterChange("screenSize", "16 to 16.9 inches")}
              />
              16 to 16.9 inches
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.screenSize.includes("15 to 15.9 inches")}
                onChange={() => handleFilterChange("screenSize", "15 to 15.9 inches")}
              />
              15 to 15.9 inches
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.screenSize.includes("14 to 14.9 inches")}
                onChange={() => handleFilterChange("screenSize", "14 to 14.9 inches")}
              />
              14 to 14.9 inches
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.screenSize.includes("13 to 13.9 inches")}
                onChange={() => handleFilterChange("screenSize", "13 to 13.9 inches")}
              />
              13 to 13.9 inches
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.screenSize.includes("12 to 12.9 inches")}
                onChange={() => handleFilterChange("screenSize", "12 to 12.9 inches")}
              />
              12 to 12.9 inches
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.screenSize.includes("11 to 11.9 inches")}
                onChange={() => handleFilterChange("screenSize", "11 to 11.9 inches")}
              />
              11 to 11.9 inches
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.screenSize.includes("11 inches & Under")}
                onChange={() => handleFilterChange("screenSize", "11 inches & Under")}
              />
              11 inches & Under
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Price</h3>
          <div className="price-label">${priceRange[0]} - ${priceRange[1].toLocaleString()}</div>
          <div className="price-range-controls">
            <div className="price-track"></div>
            <div
              className="price-range-selected"
              style={{
                left: `${(priceRange[0] / 10000) * 100}%`,
                right: `${100 - (priceRange[1] / 10000) * 100}%`
              }}
            ></div>
            <input
              type="range"
              min="15"
              max="10000"
              value={priceRange[0]}
              onChange={(e) => {
                const newMin = Math.min(parseInt(e.target.value), priceRange[1] - 1);
                setPriceRange([newMin, priceRange[1]]);
              }}
            />
            <input
              type="range"
              min="15"
              max="10000"
              value={priceRange[1]}
              onChange={(e) => {
                const newMax = Math.max(parseInt(e.target.value), priceRange[0] + 1);
                setPriceRange([priceRange[0], newMax]);
              }}
            />
          </div>
          <div className="price-controls">
            <button className="go-button" onClick={applyPriceFilter}>Apply</button>
          </div>
        </div>

        <div className="filter-section">
          <h3>RAM Size</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={filters.ramSize.includes("128 GB")}
                onChange={() => handleFilterChange("ramSize", "128 GB")}
              />
              128 GB
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.ramSize.includes("64 GB")}
                onChange={() => handleFilterChange("ramSize", "64 GB")}
              />
              64 GB
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.ramSize.includes("32 GB")}
                onChange={() => handleFilterChange("ramSize", "32 GB")}
              />
              32 GB
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.ramSize.includes("16 GB")}
                onChange={() => handleFilterChange("ramSize", "16 GB")}
              />
              16 GB
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.ramSize.includes("8 GB")}
                onChange={() => handleFilterChange("ramSize", "8 GB")}
              />
              8 GB
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.ramSize.includes("4 GB")}
                onChange={() => handleFilterChange("ramSize", "4 GB")}
              />
              4 GB
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Brands</h3>
          <div className="checkbox-group">
            {/* Display first 6 brands or all if showAllBrands is true */}
            {availableBrands
              .slice(0, showAllBrands ? availableBrands.length : 6)
              .map(brand => (
                <label key={brand}>
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => handleFilterChange("brand", brand)}
                  />
                  {brand}
                </label>
              ))
            }
            {availableBrands.length > 6 && (
              <div className="see-more" onClick={toggleShowAllBrands}>
                <span>{showAllBrands ? "See less" : "See more"}</span>
              </div>
            )}
          </div>
        </div>

        <div className="filter-section">
          <h3>CPU Model Manufacture</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={filters.cpuManufacturer.includes("Intel")}
                onChange={() => handleFilterChange("cpuManufacturer", "Intel")}
              />
              Intel
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.cpuManufacturer.includes("AMD")}
                onChange={() => handleFilterChange("cpuManufacturer", "AMD")}
              />
              AMD
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.cpuManufacturer.includes("MediaTek")}
                onChange={() => handleFilterChange("cpuManufacturer", "MediaTek")}
              />
              MediaTek
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.cpuManufacturer.includes("Qualcomm")}
                onChange={() => handleFilterChange("cpuManufacturer", "Qualcomm")}
              />
              Qualcomm
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Weight</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={filters.weight.includes("Up to 3 Pounds")}
                onChange={() => handleFilterChange("weight", "Up to 3 Pounds")}
              />
              Up to 3 Pounds
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.weight.includes("3 to 3.9 Pounds")}
                onChange={() => handleFilterChange("weight", "3 to 3.9 Pounds")}
              />
              3 to 3.9 Pounds
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.weight.includes("4 to 4.9 Pounds")}
                onChange={() => handleFilterChange("weight", "4 to 4.9 Pounds")}
              />
              4 to 4.9 Pounds
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.weight.includes("5 to 5.9 Pounds")}
                onChange={() => handleFilterChange("weight", "5 to 5.9 Pounds")}
              />
              5 to 5.9 Pounds
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.weight.includes("6 to 6.9 Pounds")}
                onChange={() => handleFilterChange("weight", "6 to 6.9 Pounds")}
              />
              6 to 6.9 Pounds
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.weight.includes("7 to 7.9 Pounds")}
                onChange={() => handleFilterChange("weight", "7 to 7.9 Pounds")}
              />
              7 to 7.9 Pounds
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Processor Type</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={filters.processorType.includes("AMD A-Series")}
                onChange={() => handleFilterChange("processorType", "AMD A-Series")}
              />
              AMD A-Series
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.processorType.includes("AMD A10")}
                onChange={() => handleFilterChange("processorType", "AMD A10")}
              />
              AMD A10
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.processorType.includes("AMD A4")}
                onChange={() => handleFilterChange("processorType", "AMD A4")}
              />
              AMD A4
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.processorType.includes("AMD A6")}
                onChange={() => handleFilterChange("processorType", "AMD A6")}
              />
              AMD A6
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.processorType.includes("AMD A8")}
                onChange={() => handleFilterChange("processorType", "AMD A8")}
              />
              AMD A8
            </label>
            <div className="see-more">
              <span>See more</span>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Operating System</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={filters.operatingSystem.includes("Windows 11 Home")}
                onChange={() => handleFilterChange("operatingSystem", "Windows 11 Home")}
              />
              Windows 11 Home
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.operatingSystem.includes("Windows 11 Pro")}
                onChange={() => handleFilterChange("operatingSystem", "Windows 11 Pro")}
              />
              Windows 11 Pro
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.operatingSystem.includes("Windows 11 S mode")}
                onChange={() => handleFilterChange("operatingSystem", "Windows 11 S mode")}
              />
              Windows 11 S mode
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.operatingSystem.includes("Windows 10 Home")}
                onChange={() => handleFilterChange("operatingSystem", "Windows 10 Home")}
              />
              Windows 10 Home
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Graphics Coprocessor</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={filters.graphicsCoprocessor.includes("Intel Iris Xe Graphics")}
                onChange={() => handleFilterChange("graphicsCoprocessor", "Intel Iris Xe Graphics")}
              />
              Intel Iris Xe Graphics
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.graphicsCoprocessor.includes("NVIDIA GeForce RTX 2060")}
                onChange={() => handleFilterChange("graphicsCoprocessor", "NVIDIA GeForce RTX 2060")}
              />
              NVIDIA GeForce RTX 2060
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.graphicsCoprocessor.includes("NVIDIA GeForce RTX 2070")}
                onChange={() => handleFilterChange("graphicsCoprocessor", "NVIDIA GeForce RTX 2070")}
              />
              NVIDIA GeForce RTX 2070
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.graphicsCoprocessor.includes("NVIDIA GeForce GTX 1650")}
                onChange={() => handleFilterChange("graphicsCoprocessor", "NVIDIA GeForce GTX 1650")}
              />
              NVIDIA GeForce GTX 1650
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.graphicsCoprocessor.includes("NVIDIA GeForce RTX 2080")}
                onChange={() => handleFilterChange("graphicsCoprocessor", "NVIDIA GeForce RTX 2080")}
              />
              NVIDIA GeForce RTX 2080
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.graphicsCoprocessor.includes("NVIDIA GeForce RTX 3050 Ti")}
                onChange={() => handleFilterChange("graphicsCoprocessor", "NVIDIA GeForce RTX 3050 Ti")}
              />
              NVIDIA GeForce RTX 3050 Ti
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.graphicsCoprocessor.includes("NVIDIA GeForce RTX 3070")}
                onChange={() => handleFilterChange("graphicsCoprocessor", "NVIDIA GeForce RTX 3070")}
              />
              NVIDIA GeForce RTX 3070
            </label>
          </div>
        </div>
      </div>

      <div className="results-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for laptops..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="results-header">
          <h2>Results</h2>
          <p>Found {displayLaptops.length} laptops</p>
        </div>

        <div className="laptop-listings">
          {currentLaptops.map((laptop) => (
            <div className="laptop-item" key={laptop.id}>
              <div className="laptop-image">
                <img
                  src={laptop.image ? laptop.image.split("; ")[0] : "default-image.jpg"}
                  alt={laptop.title}
                />
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
                </div>

                <div className="laptop-price">
                  <div className="current-price">
                    <span className="dollar">$</span>
                    <span className="amount">{Math.floor(laptop.price)}</span>
                    <span className="cents">{(laptop.price % 1).toFixed(2).substring(2)}</span>
                  </div>

                  {laptop.price && (
                    <div className="original-price">List: ${laptop.price}</div>
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
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaptopSearch;