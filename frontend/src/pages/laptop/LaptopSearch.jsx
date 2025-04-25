import React, { useState, useEffect } from 'react';
import { fetchLaptops } from '../../services/laptopService';
import './LaptopSearch.css';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const LaptopSearch = () => {
  const [laptops, setLaptops] = useState([]);
  const [priceRange, setPriceRange] = useState([15, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showFilters, setShowFilters] = useState(true);
  const [sortOption, setSortOption] = useState('None');
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    screenSize: true,
    ramSize: true,
    brand: true,
    cpuManufacturer: true,
    weight: true,
    processorType: true,
    operatingSystem: true,
    graphicsCoprocessor: true
  });

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

  // Sort the filtered laptops based on selected sort option
  useEffect(() => {
    let sortedLaptops = [...filteredLaptops];

    switch (sortOption) {
      case 'None':
        break;
      case 'Price: Low to High':
        sortedLaptops.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        sortedLaptops.sort((a, b) => b.price - a.price);
        break;
      case 'Rating: High to Low':
        sortedLaptops.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest Arrivals':
        // Assuming there's a date field, otherwise this will need modification
        sortedLaptops.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
        break;
      default:
        break;
    }

    setFilteredLaptops(sortedLaptops);
  }, [sortOption]);

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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleFilterSection = (section) => {
    setExpandedFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Pagination
  const displayLaptops = filteredLaptops;
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
<<<<<<< HEAD
      console.log('Fetched laptops dat:', data);
      setLaptops(data);
=======
      console.log('Fetched laptops data:', data);
      if (data && Array.isArray(data)) {
        setLaptops(data);
        setFilteredLaptops(data);
      }
>>>>>>> 7e27a27f84f7f221860b01a48481e7fcdc0cb398
    };
    loadLaptops();
  }, []);

  // Render filter section
  const renderFilterSection = (title, section, items, showAll = null, toggleShowAll = null) => {
    return (
      <div className="filter-section">
        <div
          className="filter-header"
          onClick={() => toggleFilterSection(section)}
        >
          <h3>{title}</h3>
          {expandedFilterSections[section] ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {expandedFilterSections[section] && (
          <div className="checkbox-group">
            {items}
            {showAll !== null && items.length > 6 && (
              <div className="see-more" onClick={toggleShowAll}>
                <span>{showAll ? "See less" : "See more"}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="laptop-search-container">


      <div className="search-content">
        {showFilters && (
          <div className="sidebar">
            {renderFilterSection("Display Size", "screenSize", (
              <>
                {[
                  "17 inches & Above",
                  "16 to 16.9 inches",
                  "15 to 15.9 inches",
                  "14 to 14.9 inches",
                  "13 to 13.9 inches",
                  "12 to 12.9 inches",
                  "11 to 11.9 inches",
                  "11 inches & Under"
                ].map(size => (
                  <label key={size}>
                    <input
                      type="checkbox"
                      checked={filters.screenSize.includes(size)}
                      onChange={() => handleFilterChange("screenSize", size)}
                    />
                    <span className="checkmark"></span>
                    {size}
                  </label>
                ))}
              </>
            ))}

            {renderFilterSection("Price", "price", (
              <>
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
              </>
            ))}

            {renderFilterSection("RAM Size", "ramSize", (
              <>
                {["128 GB", "64 GB", "32 GB", "16 GB", "8 GB", "4 GB"].map(size => (
                  <label key={size}>
                    <input
                      type="checkbox"
                      checked={filters.ramSize.includes(size)}
                      onChange={() => handleFilterChange("ramSize", size)}
                    />
                    <span className="checkmark"></span>
                    {size}
                  </label>
                ))}
              </>
            ))}

            {renderFilterSection("Brands", "brand", (
              <>
                {availableBrands
                  .slice(0, showAllBrands ? availableBrands.length : 6)
                  .map(brand => (
                    <label key={brand}>
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={() => handleFilterChange("brand", brand)}
                      />
                      <span className="checkmark"></span>
                      {brand}
                    </label>
                  ))
                }
              </>
            ), showAllBrands, toggleShowAllBrands)}

            {renderFilterSection("CPU Model Manufacturer", "cpuManufacturer", (
              <>
                {["Intel", "AMD", "MediaTek", "Qualcomm"].map(manufacturer => (
                  <label key={manufacturer}>
                    <input
                      type="checkbox"
                      checked={filters.cpuManufacturer.includes(manufacturer)}
                      onChange={() => handleFilterChange("cpuManufacturer", manufacturer)}
                    />
                    <span className="checkmark"></span>
                    {manufacturer}
                  </label>
                ))}
              </>
            ))}

            {/* Remaining filter sections follow the same pattern */}
            {renderFilterSection("Weight", "weight", (
              <>
                {[
                  "Up to 3 Pounds",
                  "3 to 3.9 Pounds",
                  "4 to 4.9 Pounds",
                  "5 to 5.9 Pounds",
                  "6 to 6.9 Pounds",
                  "7 to 7.9 Pounds"
                ].map(weightRange => (
                  <label key={weightRange}>
                    <input
                      type="checkbox"
                      checked={filters.weight.includes(weightRange)}
                      onChange={() => handleFilterChange("weight", weightRange)}
                    />
                    <span className="checkmark"></span>
                    {weightRange}
                  </label>
                ))}
              </>
            ))}

            {renderFilterSection("Processor Type", "processorType", (
              <>
                {[
                  "AMD A-Series",
                  "AMD A10",
                  "AMD A4",
                  "AMD A6",
                  "AMD A8",
                  "Intel Core i3",
                  "Intel Core i5",
                  "Intel Core i7",
                  "Intel Core i9",
                  "Intel Celeron",
                  "Intel Pentium"
                ].map(processor => (
                  <label key={processor}>
                    <input
                      type="checkbox"
                      checked={filters.processorType.includes(processor)}
                      onChange={() => handleFilterChange("processorType", processor)}
                    />
                    <span className="checkmark"></span>
                    {processor}
                  </label>
                ))}
              </>
            ))}

            {renderFilterSection("Operating System", "operatingSystem", (
              <>
                {[
                  "Windows 11 Home",
                  "Windows 11 Pro",
                  "Windows 11 S mode",
                  "Windows 10 Home",
                  "Windows 10 Pro",
                  "macOS",
                  "Chrome OS",
                  "Linux"
                ].map(os => (
                  <label key={os}>
                    <input
                      type="checkbox"
                      checked={filters.operatingSystem.includes(os)}
                      onChange={() => handleFilterChange("operatingSystem", os)}
                    />
                    <span className="checkmark"></span>
                    {os}
                  </label>
                ))}
              </>
            ))}

            {renderFilterSection("Graphics Coprocessor", "graphicsCoprocessor", (
              <>
                {[
                  "Intel Iris Xe Graphics",
                  "NVIDIA GeForce RTX 2060",
                  "NVIDIA GeForce RTX 2070",
                  "NVIDIA GeForce GTX 1650",
                  "NVIDIA GeForce RTX 2080",
                  "NVIDIA GeForce RTX 3050 Ti",
                  "NVIDIA GeForce RTX 3070",
                  "AMD Radeon Graphics",
                  "Intel UHD Graphics",
                  "NVIDIA GeForce RTX 3060"
                ].map(gpu => (
                  <label key={gpu}>
                    <input
                      type="checkbox"
                      checked={filters.graphicsCoprocessor.includes(gpu)}
                      onChange={() => handleFilterChange("graphicsCoprocessor", gpu)}
                    />
                    <span className="checkmark"></span>
                    {gpu}
                  </label>
                ))}
              </>
            ))}
          </div>
        )}

        <div className="results-container">
          <div className="search-header">
            <div className="search-controls">
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for laptops..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="filters-control">
                <button className="hide-filters-btn" onClick={toggleFilters}>
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                  <FaFilter className="filter-icon" />
                </button>
              </div>
            </div>

            <div className="results-header">
              <div className="results-count">
                <h2>{displayLaptops.length} Laptops Found</h2>
              </div>
              <div className="sort-controls">
                <label>Sort by: </label>
                <select value={sortOption} onChange={handleSortChange}>
                  <option value="None">None</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Rating: High to Low">Rating: High to Low</option>
                  <option value="Newest Arrivals">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>
          <div className="laptop-listings">
            {currentLaptops.length > 0 ? (
              currentLaptops.map((laptop) => (
                <div className="laptop-card" key={laptop.id}>
                  <div className="laptop-image" onClick={() => navigate(`/product-info/${laptop.id}`)}>
                    <img
                      src={laptop.image ? laptop.image.split("; ")[0] : "/images/default-laptop.jpg"}
                      alt={laptop.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default-laptop.jpg";
                      }}
                    />
                  </div>

                  <div className="laptop-details">
                    <h3
                      className="laptop-title"
                      title={laptop.title}
                      onClick={() => navigate(`/product-info/${laptop.id}`)}
                    >
                      {laptop.title}
                    </h3>

                    <div className="laptop-meta">
                      <div className="rating">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={star <= Math.round(laptop.rating) ? "star filled" : "star"}
                            />
                          ))}
                        </div>
                        <span className="rating-count">{laptop.rating}</span>
                      </div>

                      <div className="laptop-price">
                        <div className="current-price">
                          <span className="currency">$</span>
                          <span className="amount">
                            {typeof laptop.price === 'number'
                              ? laptop.price.toFixed(2)
                              : laptop.price || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="laptop-specs">
                      {laptop.screen_size && (
                        <div className="spec">
                          <div className="spec-label">Display</div>
                          <div className="spec-value">{laptop.screen_size}</div>
                        </div>
                      )}

                      {laptop.item_weight && (
                        <div className="spec">
                          <div className="spec-label">Weight</div>
                          <div className="spec-value">{laptop.item_weight}</div>
                        </div>
                      )}

                      {laptop.ram && (
                        <div className="spec">
                          <div className="spec-label">RAM</div>
                          <div className="spec-value">{laptop.ram}</div>
                        </div>
                      )}

                      {laptop.operating_system && (
                        <div className="spec">
                          <div className="spec-label">OS</div>
                          <div className="spec-value">{laptop.operating_system}</div>
                        </div>
                      )}
                    </div>

                    <div className="laptop-actions">
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/product-info/${laptop.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No laptops found matching your criteria. Try adjusting your filters.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn prev-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className="page-info">
                <span>Page {currentPage} of {totalPages}</span>
              </div>

              <button
                className="page-btn next-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaptopSearch;