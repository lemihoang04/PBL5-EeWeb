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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validTypes = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case'];

  // Normalize the type parameter to match validTypes
  const normalizeType = (inputType) => {
    if (!inputType) return null;
    const lowerType = inputType.toLowerCase();
    return validTypes.find((validType) => validType.toLowerCase() === lowerType) || null;
  };

  const normalizedType = normalizeType(type);

  useEffect(() => {
    console.log('Type from useParams:', type, 'Normalized:', normalizedType);
    const loadComponents = async () => {
      setError(null);
      setComponents([]);
      setFilteredComponents([]);
      if (!normalizedType) {
        console.log('Invalid type, clearing components');
        return;
      }
      try {
        const data = await fetchComponents(normalizedType);
        console.log('Received data in ComponentSearch:', data);
        if (data && data.error) {
          console.error('API returned error:', data.error);
          setError(data.error);
          return;
        }
        if (!Array.isArray(data)) {
          console.error('Expected array but got:', data);
          setError('Invalid data format from server');
          return;
        }
        console.log('Number of components received:', data.length);
        if (data.length === 0) {
          console.log('API returned empty array');
          setComponents([]);
          setFilteredComponents([]);
          return;
        }
        // Parse attributes and price
        const parsedComponents = data.map((component, index) => {
          let attributes = {};
          try {
            if (component.attributes && typeof component.attributes === 'string') {
              attributes = Object.fromEntries(
                component.attributes.split(',').map((attr) => {
                  const [name, value] = attr.split(':').map((s) => s?.trim() || '');
                  return [name, value];
                })
              );
            }
          } catch (err) {
            console.error(`Error parsing attributes for component ${index}:`, component, err);
          }
          // Parse price to float, default to 0 if invalid
          const parsedPrice = parseFloat(component.price) || 0;
          return { ...component, price: parsedPrice, attributes };
        });
        console.log('Parsed Components:', parsedComponents);
        console.log('Number of components:', parsedComponents.length);
        setComponents(parsedComponents);
        setFilteredComponents(parsedComponents);
      } catch (err) {
        console.error('Unexpected error in loadComponents:', err);
        setError('Failed to load components');
      }
    };
    loadComponents();
  }, [normalizedType]);

  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComponents = filteredComponents.slice(indexOfFirstItem, indexOfLastItem);
  console.log('Current Components for rendering:', currentComponents);
  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = components.filter((component) =>
      component.title?.toLowerCase().includes(term)
    );
    console.log('Filtered Components after search:', filtered);
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
    const applyAttributeFilter = (attributeName, values) => {
      const filtered = components.filter((component) =>
        values.includes(component.attributes?.[attributeName])
      );
      console.log(`Filtered Components after ${attributeName} filter:`, filtered);
      setFilteredComponents(filtered);
      setCurrentPage(1);
    };

    switch (normalizedType) {
      case 'Storage':
        return (
          <div className="filter-section">
            <h3>Storage Type</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Storage Type', ['SSD'])
                  }
                /> SSD
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Storage Type', ['HDD'])
                  }
                /> HDD
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Storage Type', ['NVMe'])
                  }
                /> NVMe
              </label>
            </div>
          </div>
        );
      case 'PSU':
        return (
          <div className="filter-section">
            <h3>Wattage</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Wattage', ['400W-600W'])
                  }
                /> 400W-600W
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Wattage', ['600W-800W'])
                  }
                /> 600W-800W
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Wattage', ['800W+'])
                  }
                /> 800W+
              </label>
            </div>
          </div>
        );
      case 'Mainboard':
        return (
          <div className="filter-section">
            <h3>Chipset</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Chipset', ['Intel Z790'])
                  }
                /> Intel Z790
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Chipset', ['AMD B650'])
                  }
                /> AMD B650
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Chipset', ['Intel B760'])
                  }
                /> Intel B760
              </label>
            </div>
          </div>
        );
      case 'GPU':
        return (
          <div className="filter-section">
            <h3>GPU Brand</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Brand', ['NVIDIA'])
                  }
                /> NVIDIA
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Brand', ['AMD'])
                  }
                /> AMD
              </label>
            </div>
          </div>
        );
      case 'RAM':
        return (
          <div className="filter-section">
            <h3>Memory Type</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Memory Type', ['DDR4'])
                  }
                /> DDR4
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Memory Type', ['DDR5'])
                  }
                /> DDR5
              </label>
            </div>
          </div>
        );
      case 'CPU Cooler':
        return (
          <div className="filter-section">
            <h3>Cooler Type</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Cooler Type', ['Air'])
                  }
                /> Air
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Cooler Type', ['Liquid'])
                  }
                /> Liquid
              </label>
            </div>
          </div>
        );
      case 'Case':
        return (
          <div className="filter-section">
            <h3>Case Size</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Case Size', ['ATX'])
                  }
                /> ATX
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Case Size', ['Micro-ATX'])
                  }
                /> Micro-ATX
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked &&
                    applyAttributeFilter('Case Size', ['Mini-ITX'])
                  }
                /> Mini-ITX
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!normalizedType) {
    return <div>Invalid component type</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            placeholder={`Search for ${normalizedType}...`}
            onChange={handleSearch}
          />
        </div>

        {filteredComponents.length === 0 ? (
          <div>No components found for {normalizedType}</div>
        ) : (
          <div className="component-listings">
            {currentComponents.map((component) => (
              <div className="component-item" key={component.product_id}>
                <img
                  src={component.image || 'default-component.jpg'}
                  alt={component.title}
                />
                <h3
                  onClick={() => navigate(`/product-info/${component.product_id}`)}
                >
                  {component.title}
                </h3>
                <p>
                  {typeof component.price === 'number' && !isNaN(component.price)
                    ? `$${component.price.toFixed(2)}`
                    : 'N/A'}
                </p>
                <button>Add to cart</button>
              </div>
            ))}
          </div>
        )}

        {filteredComponents.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default ComponentSearch;