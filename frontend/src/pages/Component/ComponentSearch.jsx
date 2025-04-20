import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchComponents } from '../../services/componentService';
import './ComponentSearch.css';

const ComponentSearch = () => {
  const { type } = useParams();
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [manufacturerFilter, setManufacturerFilter] = useState({
    AMD: true,
    Intel: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validTypes = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case'];

  const normalizeType = (inputType) => {
    if (!inputType) return null;
    const lowerType = inputType.toLowerCase();
    return validTypes.find((validType) => validType.toLowerCase() === lowerType) || null;
  };

  const normalizedType = normalizeType(type);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const data = await fetchComponents(normalizedType);
        if (!data || data.error) {
          setError(data?.error || 'Failed to load components');
          setComponents([]);
          setFilteredComponents([]);
          return;
        }
        if (!Array.isArray(data)) {
          setError('Invalid data format from server');
          return;
        }
        const parsedComponents = data.map((component) => {
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
            console.error(`Error parsing attributes for component:`, component, err);
          }
          const parsedPrice = parseFloat(component.price) || 0;
          return { ...component, price: parsedPrice, attributes };
        });
        setComponents(parsedComponents);
        setFilteredComponents(parsedComponents);
      } catch (err) {
        setError('Failed to load components');
      }
    };
    loadComponents();
  }, [normalizedType]);

  const itemsPerPage = 50;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComponents = filteredComponents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = components.filter((component) =>
      component.title?.toLowerCase().includes(term)
    );
    setFilteredComponents(filtered);
    setCurrentPage(1);
  };

  const handlePriceFilter = () => {
    const filtered = components.filter(
      (component) =>
        component.price >= priceRange[0] && component.price <= priceRange[1]
    );
    setFilteredComponents(filtered);
    setCurrentPage(1);
  };

  const handleManufacturerFilter = (e) => {
    const { name, checked } = e.target;
    const updatedFilter = { ...manufacturerFilter, [name]: checked };
    setManufacturerFilter(updatedFilter);

    const activeManufacturers = Object.keys(updatedFilter).filter(
      (key) => updatedFilter[key]
    );
    if (activeManufacturers.length === 0) {
      setFilteredComponents(components);
      setCurrentPage(1);
      return;
    }
    const filtered = components.filter((component) =>
      activeManufacturers.some((man) =>
        component.title?.toLowerCase().includes(man.toLowerCase())
      )
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

  const getComponentHeaders = () => {
    const normalizeHeader = (header) =>
      header
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const headers = {
      CPU: [
        'Name',
        'Core Count',
        'Performance Core Clock',
        'Performance Core Boost Clock',
        'Microarchitecture',
        'TDP',
        'Integrated Graphics',
        'Rating',
        'Price',
      ],
      RAM: [
        'Name',
        'Speed',
        'Modules',
        'CAS Latency',
        'Voltage',
        'Timing',
        'ECC / Registered',
        'Price',
      ],
      'CPU Cooler': [
        'Name',
        'Fan RPM',
        'Noise Level',
        'Height',
        'CPU Socket',
        'Water Cooled',
        'Fanless',
        'Price',
      ],
      Case: [
        'Name',
        'Type',
        'Color',
        'Side Panel',
        'Motherboard Form Factor',
        'Maximum Video Card Length',
        'Drive Bays',
        'Price',
      ],
      GPU: [
        'Name',
        'Chipset',
        'Memory',
        'Core Clock',
        'Boost Clock',
        'TDP',
        'Cooling',
        'Price',
      ],
      Mainboard: [
        'Name',
        'Socket/CPU',
        'Form Factor',
        'Chipset',
        'Memory Max',
        'Memory Slots',
        'PCIe x16 Slots',
        'Price',
      ],
      PSU: [
        'Name',
        'Wattage',
        'Efficiency Rating',
        'Modular',
        'ATX 4-Pin Connectors',
        'PCIe 8-Pin Connectors',
        'SATA Connectors',
        'Price',
      ],
      Storage: [
        'Name',
        'Capacity',
        'Type',
        'Form Factor',
        'Interface',
        'NVME',
        'Cache',
        'Price',
      ],
    };

    return (headers[normalizedType] || ['Name', 'Price']).map(normalizeHeader);
  };

  const getComponentRowData = (component) => {
    const ratingStars = (rating, count) => (
      <span>
        {'★'.repeat(Math.round(rating || 4)) + '☆'.repeat(5 - Math.round(rating || 4))} ({count || 0})
      </span>
    );

    switch (normalizedType) {
      case 'CPU':
        return [
          component.title,
          component.attributes?.['Core Count'] || 'N/A',
          component.attributes?.['Performance Core Clock'] || 'N/A',
          component.attributes?.['Performance Core Boost Clock'] || 'N/A',
          component.attributes?.['Microarchitecture'] || 'N/A',
          component.attributes?.['TDP'] || 'N/A',
          component.attributes?.['Integrated Graphics'] || 'None',
          ratingStars(4, component.attributes?.['Rating Count']),
          `$${component.price.toFixed(2)}`,
        ];
      case 'RAM':
        return [
          component.title,
          component.attributes?.['Speed'] || 'N/A',
          component.attributes?.['Modules'] || 'N/A',
          component.attributes?.['CAS Latency'] || 'N/A',
          component.attributes?.['Voltage'] || 'N/A',
          component.attributes?.['Timing'] || 'N/A',
          component.attributes?.['ECC / Registered'] || 'N/A',
          `$${component.price.toFixed(2)}`,
        ];
      case 'CPU Cooler':
        return [
          component.title,
          component.attributes?.['Fan RPM'] || 'N/A',
          component.attributes?.['Noise Level'] || 'N/A',
          component.attributes?.['Height'] || 'N/A',
          component.attributes?.['CPU Socket'] || 'N/A',
          component.attributes?.['Water Cooled'] || 'N/A',
          component.attributes?.['Fanless'] || 'N/A',
          `$${component.price.toFixed(2)}`,
        ];
      case 'Case':
        return [
          component.title,
          component.attributes?.['Type'] || 'N/A',
          component.attributes?.['Color'] || 'N/A',
          component.attributes?.['Side Panel'] || 'N/A',
          component.attributes?.['Motherboard Form Factor'] || 'N/A',
          component.attributes?.['Maximum Video Card Length'] || 'N/A',
          component.attributes?.['Drive Bays'] || 'N/A',
          `$${component.price.toFixed(2)}`,
        ];
      case 'GPU':
        return [
          component.title,
          component.attributes?.['Chipset'] || 'N/A',
          component.attributes?.['Memory'] || 'N/A',
          component.attributes?.['Core Clock'] || 'N/A',
          component.attributes?.['Boost Clock'] || 'N/A',
          component.attributes?.['TDP'] || 'N/A',
          component.attributes?.['Cooling'] || 'N/A',
          `$${component.price.toFixed(2)}`,
        ];
      case 'Mainboard':
        return [
          component.title,
          component.attributes?.['Socket/CPU'] || 'N/A',
          component.attributes?.['Form Factor'] || 'N/A',
          component.attributes?.['Chipset'] || 'N/A',
          component.attributes?.['Memory Max'] || 'N/A',
          component.attributes?.['Memory Slots'] || 'N/A',
          component.attributes?.['PCIe x16 Slots'] || 'N/A',
          `$${component.price.toFixed(2)}`,
        ];
      case 'PSU':
        return [
          component.title,
          component.attributes?.['Wattage'] || 'N/A',
          component.attributes?.['Efficiency Rating'] || 'N/A',
          component.attributes?.['Modular'] || 'N/A',
          component.attributes?.['ATX 4-Pin Connectors'] || 'N/A',
          component.attributes?.['PCIe 8-Pin Connectors'] || 'N/A',
          component.attributes?.['SATA Connectors'] || 'N/A',
          `$${component.price.toFixed(2)}`,
        ];
      case 'Storage':
        return [
          component.title,
          component.attributes?.['Capacity'] || 'N/A',
          component.attributes?.['Type'] || 'N/A',
          component.attributes?.['Form Factor'] || 'N/A',
          component.attributes?.['Interface'] || 'N/A',
          component.attributes?.['NVME'] || 'N/A',
          component.attributes?.['Cache'] || 'N/A',
          `$${component.price.toFixed(2)}`,
        ];
      default:
        return [component.title, `$${component.price.toFixed(2)}`];
    }
  };

  if (!normalizedType) {
    return <div>Invalid component type</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="component-search-container" style={{ display: 'flex' }}>
      <div className="sidebar" style={{ width: '250px', padding: '20px', borderRight: '1px solid #ddd' }}>
        <div className="filter-section">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Price</h3>
          <div className="price-label" style={{ marginBottom: '10px' }}>
            ${priceRange[0]} - ${priceRange[1].toLocaleString()}
          </div>
          <div className="price-slider">
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[0]}
              onChange={(e) => {
                const newRange = [parseInt(e.target.value), priceRange[1]];
                setPriceRange(newRange);
                handlePriceFilter();
              }}
              style={{ width: '100%' }}
            />
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => {
                const newRange = [priceRange[0], parseInt(e.target.value)];
                setPriceRange(newRange);
                handlePriceFilter();
              }}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="filter-section">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Manufacturer</h3>
          <div className="checkbox-group">
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <input
                type="checkbox"
                name="AMD"
                checked={manufacturerFilter.AMD}
                onChange={handleManufacturerFilter}
              /> AMD
            </label>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <input
                type="checkbox"
                name="Intel"
                checked={manufacturerFilter.Intel}
                onChange={handleManufacturerFilter}
              /> Intel
            </label>
          </div>
        </div>
      </div>

      <div className="results-container" style={{ flex: 1, padding: '20px' }}>
        <div className="search-bar" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder={`Search for ${normalizedType}...`}
            onChange={handleSearch}
            style={{ width: '200px', padding: '5px' }}
          />
        </div>

        {filteredComponents.length === 0 ? (
          <div>No components found for {normalizedType}</div>
        ) : (
          <div className="component-table">
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
              {/* {filteredComponents.length} Compatible Products */}
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {getComponentHeaders().map((header, index) => (
                    <th
                      key={index}
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      {header} {header !== 'Name' && <span>▼</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentComponents.map((component) => (
                  <tr key={component.product_id} style={{ borderBottom: '1px solid #ddd' }}>
                    {getComponentRowData(component).map((data, index) => (
                      <td
                        key={index}
                        style={{
                          padding: '10px',
                          verticalAlign: 'middle',
                        }}
                      >
                        {index === 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src={component.image || 'default-component.jpg'}
                              alt={component.title}
                              style={{ width: '50px', marginRight: '10px' }}
                            />
                            <span
                              onClick={() => navigate(`/product-info/${component.product_id}`)}
                              style={{ cursor: 'pointer', color: '#007bff' }}
                            >
                              {data}
                            </span>
                          </div>
                        ) : (
                          data
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '10px' }}>
                    <button className="add-button"
                        onClick={() => {
                          console.log('Adding component:', component);
                          navigate('/build', {
                            state: {
                              addedComponent: component,
                            },
                          });
                        }}
                      >
                        Add
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredComponents.length > itemsPerPage && (
              <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  style={{
                    padding: '5px 10px',
                    marginRight: '10px',
                    backgroundColor: currentPage === 1 ? '#ddd' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >

                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '5px 10px',
                    marginLeft: '10px',
                    backgroundColor: currentPage === totalPages ? '#ddd' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentSearch;