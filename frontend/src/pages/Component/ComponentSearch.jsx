import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchComponents } from '../../services/componentService';
import './ComponentSearch.css';

const ComponentSearch = () => {
  const { type } = useParams();
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const validTypes = ['storage', 'psu', 'mainboard', 'gpu', 'cpu', 'ram', 'cpu_cooler', 'case'];

  useEffect(() => {
    console.log('Type from useParams:', type);
    if (!validTypes.includes(type)) {
      return; 
    }
    const loadComponents = async () => {
      const data = await fetchComponents(type);
      if (!data) {
        
        console.error('No data returned from fetchComponents');
        setComponents([]);
        setFilteredComponents([]);
        return;
      }
      if (data.error) {
        console.error(data.error);
        setComponents([]);
        setFilteredComponents([]);
      } else {
        setComponents(data);
        setFilteredComponents(data);
      }
    };
    loadComponents();
  }, [type]);

  if (!validTypes.includes(type)) {
    return <div>Invalid component type</div>;
  }

  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComponents = filteredComponents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = components.filter((component) =>
      component.title.toLowerCase().includes(term)
    );
    setFilteredComponents(filtered);
    setCurrentPage(1);
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

  const getComponentSpecificFilters = () => {
    switch (type) {
      case 'storage':
        return (
          <div className="filter-section">
            <h3>Storage Type</h3>
            <div className="checkbox-group">
              <label><input type="checkbox" /> SSD</label>
              <label><input type="checkbox" /> HDD</label>
              <label><input type="checkbox" /> NVMe</label>
            </div>
          </div>
        );
      case 'psu':
        return (
          <div className="filter-section">
            <h3>Wattage</h3>
            <div className="checkbox-group">
              <label><input type="checkbox" /> 400W-600W</label>
              <label><input type="checkbox" /> 600W-800W</label>
              <label><input type="checkbox" /> 800W+</label>
            </div>
          </div>
        );
      case 'mainboard':
        return (
          <div className="filter-section">
            <h3>Chipset</h3>
            <div className="checkbox-group">
              <label><input type="checkbox" /> Intel Z790</label>
              <label><input type="checkbox" /> AMD B650</label>
              <label><input type="checkbox" /> Intel B760</label>
            </div>
          </div>
        );
      case 'gpu':
        return (
          <div className="filter-section">
            <h3>GPU Brand</h3>
            <div className="checkbox-group">
              <label><input type="checkbox" /> NVIDIA</label>
              <label><input type="checkbox" /> AMD</label>
            </div>
          </div>
        );
      case 'ram':
        return (
          <div className="filter-section">
            <h3>Memory Type</h3>
            <div className="checkbox-group">
              <label><input type="checkbox" /> DDR4</label>
              <label><input type="checkbox" /> DDR5</label>
            </div>
          </div>
        );
      case 'cpu_cooler':
        return (
          <div className="filter-section">
            <h3>Cooler Type</h3>
            <div className="checkbox-group">
              <label><input type="checkbox" /> Air</label>
              <label><input type="checkbox" /> Liquid</label>
            </div>
          </div>
        );
      case 'case':
        return (
          <div className="filter-section">
            <h3>Case Size</h3>
            <div className="checkbox-group">
              <label><input type="checkbox" /> ATX</label>
              <label><input type="checkbox" /> Micro-ATX</label>
              <label><input type="checkbox" /> Mini-ITX</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="component-search-container">
      <div className="sidebar">
        <div className="filter-section">
          <h3>Price</h3>
          <div className="price-label">
            ${priceRange[0]} - ${priceRange[1].toLocaleString()}
          </div>
          <div className="price-slider">
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            />
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
          </div>
        </div>

        {getComponentSpecificFilters()}
      </div>

      <div className="results-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Search for ${type}...`}
            onChange={handleSearch}
          />
        </div>

        <div className="component-listings">
          {currentComponents.map((component) => (
            <div className="component-item" key={component.id}>
              <img
                src={component.image || 'default-component.jpg'}
                alt={component.title}
              />
              <h3
                onClick={() => navigate(`/product-info/${component.id}`)}
              >
                {component.title}
              </h3>
              <p>${component.price?.toFixed(2) || 'N/A'}</p>
              <button>Add to cart</button>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentSearch;