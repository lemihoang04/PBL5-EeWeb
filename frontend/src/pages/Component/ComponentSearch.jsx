import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchComponents } from '../../services/componentService';
import './ComponentSearch.css';
import { fetchComponentById } from '../../services/componentService';

const ComponentSearch = () => {
  const { type } = useParams();
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [manufacturerFilter, setManufacturerFilter] = useState({
    AMD: true,
    Intel: false,
    Nvidia: false,
    'Western Digital': false,
    Samsung: false,
    Corsair: false,
    ASUS: false,
    MSI: false,
    Gigabyte: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
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
        'Action'
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
        'Action'
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
        'Action'
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
        'Action'
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
        'Action'
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
        'Action'
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
        'Action'
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
        'Action'
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
    return (
      <div className="comp-search-error">
        <div className="comp-search-error-content">
          <h2>Invalid Component Type</h2>
          <p>Please select a valid component category from the menu.</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comp-search-error">
        <div className="comp-search-error-content">
          <h2>Error Loading Components</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  // Get manufacturers relevant to the current component type
  const getRelevantManufacturers = () => {
    const manufacturerMap = {
      CPU: ['AMD', 'Intel'],
      GPU: ['AMD', 'Nvidia', 'ASUS', 'MSI', 'Gigabyte'],
      RAM: ['Corsair', 'G.Skill', 'Kingston', 'Crucial'],
      Storage: ['Western Digital', 'Samsung', 'Seagate', 'Crucial'],
      Mainboard: ['ASUS', 'MSI', 'Gigabyte', 'ASRock'],
      PSU: ['Corsair', 'EVGA', 'Seasonic', 'be quiet!'],
      'CPU Cooler': ['Noctua', 'Cooler Master', 'NZXT', 'be quiet!'],
      Case: ['Corsair', 'NZXT', 'Fractal Design', 'Lian Li']
    };

    return manufacturerMap[normalizedType] || [];
  };

  return (
    <div className="comp-search-container">
      <div className="comp-search-header">
        <h1>{normalizedType} Components</h1>
        <div className="comp-search-header-actions">
          <div className="comp-search-search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder={`Search for ${normalizedType}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e);
              }}
            />
            {searchTerm && (
              <button
                className="comp-search-clear-search"
                onClick={() => {
                  setSearchTerm('');
                  setFilteredComponents(components);
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            className="comp-search-toggle-filters"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            {isFilterVisible ? 'Hide Filters' : 'Show Filters'} <i className={`fas fa-filter ${isFilterVisible ? 'active' : ''}`}></i>
          </button>
        </div>
      </div>

      <div className="comp-search-content">
        {isFilterVisible && (
          <div className="comp-search-sidebar">
            <div className="comp-search-filter-section">
              <h3>Price Range</h3>
              <div className="comp-search-price-label">
                ${priceRange[0]} - ${priceRange[1].toLocaleString()}
              </div>
              <div className="comp-search-price-slider">
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
                />
              </div>
            </div>

            <div className="comp-search-filter-section">
              <h3>Manufacturer</h3>
              <div className="comp-search-checkbox-group">
                {getRelevantManufacturers().map(manufacturer => (
                  <label key={manufacturer}>
                    <input
                      type="checkbox"
                      name={manufacturer}
                      checked={manufacturerFilter[manufacturer] || false}
                      onChange={handleManufacturerFilter}
                    />
                    {manufacturer}
                  </label>
                ))}
              </div>
            </div>

            <button
              className="comp-search-reset-filters"
              onClick={() => {
                setPriceRange([0, 5000]);
                setManufacturerFilter({
                  AMD: false,
                  Intel: false,
                  Nvidia: false,
                  'Western Digital': false,
                  Samsung: false,
                  Corsair: false,
                  ASUS: false,
                  MSI: false,
                  Gigabyte: false,
                });
                setFilteredComponents(components);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="comp-search-results-container">
          {filteredComponents.length === 0 ? (
            <div className="comp-search-no-results">
              <i className="fas fa-search"></i>
              <h3>No {normalizedType} components found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <>
              <div className="comp-search-results-header">
                <h2>{filteredComponents.length} Compatible {normalizedType} Products</h2>
                <div className="comp-search-sort">
                  <label>Sort by:</label>
                  <select>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Name: A to Z</option>
                  </select>
                </div>
              </div>

              <div className="comp-search-component-table">
                <table>
                  <thead>
                    <tr>
                      {getComponentHeaders().map((header, index) => (
                        <th key={index}>
                          {header} {header !== 'Name' && header !== 'Action' && <i className="fas fa-sort"></i>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentComponents.map((component) => (
                      <tr key={component.product_id}>
                        {getComponentRowData(component).map((data, index) => (
                          <td key={index}>
                            {index === 0 ? (
                              <div className="comp-search-product-name">
                                <img
                                  src={component.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                                  alt={component.title}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                                  }}
                                />
                                <span
                                  onClick={() => navigate(`/component-info/${type}/${component.product_id}`)}
                                >
                                  {data}
                                </span>
                              </div>
                            ) : (
                              data
                            )}
                          </td>
                        ))}
                        <td>
                        <button
                            className="comp-search-add-button"
                            onClick={async () => {
            
                              try {
                                const productId = parseInt(component.product_id, 10); // Cơ số 10 để tránh các vấn đề với số bắt đầu bằng 0
                                // Gọi API để lấy thông tin chi tiết của component
                                const componentDetail = await fetchComponentById(productId);
                                console.log('ProductID:', productId);
                                console.log('Adding component:', typeof componentDetail);
                                if (componentDetail.error) {
                                  console.error('Error fetching component details:', componentDetail.error);
                                  // Có thể thêm thông báo lỗi cho người dùng ở đây
                                  return;
                                }
                                // Nếu lấy dữ liệu thành công, chuyển hướng với dữ liệu đầy đủ
                                navigate('/build', {
                                  state: {
                                    addedComponent: componentDetail,
                                  },
                                  
                                });
                                console.log('Navigating to build with component:', componentDetail);
                              } catch (error) {
                                console.error('Failed to fetch component details:', error);
                                // Fallback: Nếu API gặp lỗi, vẫn dùng dữ liệu hiện có
                                // navigate('/build', {
                                //   state: {
                                //     addedComponent: component,
                                //   },
                                // });
                              }
                            }}
                          >
                            <i className="fas fa-plus"></i> Add
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredComponents.length > itemsPerPage && (
                <div className="comp-search-pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? 'disabled' : ''}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  <div className="comp-search-page-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                          ? totalPages - 4 + i
                          : currentPage - 2 + i;

                      if (pageNumber <= totalPages) {
                        return (
                          <button
                            key={pageNumber}
                            className={currentPage === pageNumber ? 'active' : ''}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? 'disabled' : ''}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentSearch;