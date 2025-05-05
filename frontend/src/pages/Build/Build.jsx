import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Build.css';
import MotherboardUsage from './MotherboardUsage';

const Build = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [components, setComponents] = useState(() => {
    // Restore state from sessionStorage if available
    const savedComponents = sessionStorage.getItem('components');
    return savedComponents
      ? JSON.parse(savedComponents)
      : [
        { id: 'cpu', name: 'CPU', selected: null, multiple: false, icon: '🧠' },
        { id: 'cpu Cooler', name: 'CPU Cooler', selected: null, multiple: false, icon: '❄️' },
        { id: 'Mainboard', name: 'Mainboard', selected: null, multiple: false, icon: '🔄' },
        { id: 'ram', name: 'RAM', selected: [], multiple: true, icon: '🧮' },
        { id: 'storage', name: 'Storage', selected: [], multiple: true, icon: '💾' },
        { id: 'gpu', name: 'GPU', selected: [], multiple: true, icon: '🎮' },
        { id: 'case', name: 'Case', selected: null, multiple: false, icon: '🏠' },
        { id: 'psu', name: 'PSU', selected: null, multiple: false, icon: '⚡' },
      ];
  });

  const [expansionItems] = useState([
    'Sound Cards', 'Wired Network Adapters', 'Wireless Network Adapters'
  ]);

  const [peripherals] = useState([
    'Headphones', 'Keyboards', 'Mice', 'Speakers', 'Webcams'
  ]);

  const [accessories] = useState([
    'Case Accessories', 'Case Fans', 'Fan Controllers', 'Thermal Compound',
    'External Storage', 'Optical Drives', 'UPS Systems'
  ]);

  // State for compatibility issues
  const [compatibilityIssues, setCompatibilityIssues] = useState([
    { type: 'problem', message: 'Two additional RAM slots are needed.' },
    { type: 'disclaimer', message: 'Some physical constraints are not checked, such as RAM clearance with CPU Coolers.' }
  ]);

  const calculateTotalPrice = () => {
    return components.reduce((sum, component) => {
      if (!component.selected) return sum;

      if (component.multiple) {
        // If multiple type (array of products)
        return sum + component.selected.reduce((itemSum, item) => itemSum + (item ? item.price : 0), 0);
      } else {
        // If single type (one product)
        return sum + (component.selected ? component.selected.price : 0);
      }
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  // Get selected mainboard (if any)
  const selectedMainboard = components.find(component => component.id === 'Mainboard')?.selected || null;

  // Get list of selected RAMs
  const selectedRams = components.find(component => component.id === 'ram')?.selected || [];

  // Get other components if needed
  const selectedCpu = components.find(component => component.id === 'cpu')?.selected || null;
  const selectedStorages = components.find(component => component.id === 'storage')?.selected || [];
  const selectedGpus = components.find(component => component.id === 'gpu')?.selected || [];

  // Update compatibility issues whenever components change
  useEffect(() => {
    const issues = [];

    // Check RAM compatibility
    const motherboard = components.find(c => c.id === 'Mainboard')?.selected;
    const rams = components.find(c => c.id === 'ram')?.selected || [];

    if (motherboard && rams.length > 0) {
      const ramSlots = motherboard.specs?.memorySlots || 4;
      if (rams.length > ramSlots) {
        issues.push({
          type: 'problem',
          message: `Your motherboard only supports ${ramSlots} RAM modules, but you've selected ${rams.length}.`
        });
      }

      // Add the standard disclaimer
      issues.push({
        type: 'disclaimer',
        message: 'Some physical constraints are not checked, such as RAM clearance with CPU Coolers.'
      });
    } else {
      // Default issues when components aren't selected
      issues.push({ type: 'problem', message: 'Two additional RAM slots are needed.' });
      issues.push({
        type: 'disclaimer',
        message: 'Some physical constraints are not checked, such as RAM clearance with CPU Coolers.'
      });
    }

    setCompatibilityIssues(issues);
  }, [components]);

  const handleCategoryClick = (componentId) => {
  // Navigate to ComponentSearch with component type
    if (componentId === 'cpu Cooler') {
      // Kiểm tra nếu CPU đã được chọn
      const selectedCpu = components.find((component) => component.id === 'cpu')?.selected;
      
      // Nếu CPU đã được chọn, điều hướng đến CPU Cooler với brand AMD
      if (selectedCpu) {
        console.log('Selected CPU:', selectedCpu['attributes']['Socket']);
        // Điều hướng đến CPU Cooler với Socket 
        navigate(`/components/cpu%20cooler?cpu_socket=${selectedCpu['attributes']['Socket']}`);
      } else {
        // Điều hướng đến CPU Cooler thông thường
        navigate(`/components/cpu%20cooler`);
      }
    }
    else if (componentId === 'Mainboard') {
      // Check if CPU has been selected
      const selectedCpu = components.find((component) => component.id === 'cpu')?.selected;
      
      // If CPU is selected, navigate to Mainboard with socket filter
      if (selectedCpu) {
        console.log('Selected CPU:', selectedCpu['attributes']['Socket']);
        // Navigate to Mainboard with Socket parameter
        navigate(`/components/mainboard?cpu_socket=${selectedCpu['attributes']['Socket']}`);
      } else {
        // Navigate to regular Mainboard selection
        navigate(`/components/mainboard`);
      }
    }
    else {
      navigate(`/components/${componentId}`);
    }
  };

  // Save state to sessionStorage each time components change
  useEffect(() => {
    sessionStorage.setItem('components', JSON.stringify(components));
  }, [components]);

  // Handle data sent from ComponentSearch.jsx
  useEffect(() => {
    if (location.state?.addedComponent) {
      const componentDetail = location.state.addedComponent;
      setComponents((prevComponents) =>
        prevComponents.map((component) => {
          if (component.name === componentDetail.category_name) {
            if (component.multiple) {
              // If component supports multiple selections
              return {
                ...component,
                selected: [...(component.selected || []), componentDetail],
              };
            } else {
              // If component only supports one selection
              return { ...component, selected: componentDetail };
            }
          }
          return component;
        })
      );
  
      console.log('Added component:', componentDetail);
    }
  }, [location.state]);

  const handleRemoveComponent = (componentId, index = null) => {
    setComponents((prevComponents) =>
      prevComponents.map((comp) => {
        if (comp.id === componentId) {
          if (comp.multiple && index !== null) {
            // Remove a specific item from the selected array
            const newSelected = [...comp.selected];
            newSelected.splice(index, 1);
            return { ...comp, selected: newSelected };
          } else {
            // Remove all selected if not multiple or no index
            return { ...comp, selected: comp.multiple ? [] : null };
          }
        }
        return comp;
      })
    );
  };

  return (
    <div className="build-container">
      <div className="header">
        <div className="compatibility">
          <span className="icon">📋</span>
          <span className="label">Compatibility:</span>
          <span className="notes">See <a href="#notes">notes</a> below.</span>
        </div>
        <div className="wattage">
          <span className="icon">⚡</span>
          <span>Estimated Wattage: {calculateWattage()}W</span>
        </div>
      </div>

      <table className="components-table">
        <thead>
          <tr>
            <th className="component-col">Component</th>
            <th className="selection-col">Selection</th>
            <th className="price-col">Price</th>
            <th className="action-col"></th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <React.Fragment key={component.id}>
              {component.multiple ? (
                // Handling for components that can be selected multiple times (RAM, Storage, GPU)
                <>
                  {/* Display component name if no selection yet */}
                  {component.selected.length === 0 && (
                    <tr className="component-row">
                      <td className="component-name">
                        <a href={`#${component.id}`}>
                          <span className="component-icon">{component.icon}</span>
                          {component.name}
                        </a>
                      </td>
                      <td className="selection">
                        <button
                          className="choose-btn"
                          onClick={() => handleCategoryClick(component.id)}
                        >
                          Choose {component.name}
                        </button>
                      </td>
                      <td className="price">—</td>
                      <td className="actions"></td>
                    </tr>
                  )}

                  {/* Display selected items */}
                  {component.selected.map((item, index) => (
                    <tr key={`${component.id}-${index}`} className="component-row">
                      {/* Only show component name in first row */}
                      {index === 0 && (
                        <td className="component-name" rowSpan={component.selected.length}>
                          <a href={`#${component.id}`}>
                            <span className="component-icon">{component.icon}</span>
                            {component.name}
                          </a>
                        </td>
                      )}
                      <td className="selection">
                        <div className="selected-component">
                          <img src={item.image} alt={item.name} />
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td className="price">{renderPrice(item.price)}</td>
                      <td className="actions">
                        <div className="action-buttons">
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveComponent(component.id, index)}
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Only show "Add Another" button when at least one component is selected */}
                  {component.selected.length > 0 && (
                    <tr className="add-another-row">
                      <td colSpan="4" className="add-another-cell">
                        <button
                          className="add-another-btn"
                          onClick={() => handleCategoryClick(component.id)}
                        >
                          Add another {component.name}
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                // Handling for components that can only be selected once (CPU, Mainboard, etc.)
                <tr className="component-row">
                  <td className="component-name">
                    <a href={`#${component.id}`}>
                      <span className="component-icon">{component.icon}</span>
                      {component.name}
                    </a>
                  </td>
                  <td className="selection">
                    {component.selected ? (
                      <div className="selected-component">
                        <img src={component.selected.image} alt={component.selected.name} />
                        <span>{component.selected.title}</span>
                      </div>
                    ) : (
                      <button
                        className="choose-btn"
                        onClick={() => handleCategoryClick(component.id)}
                      >
                        Choose {component.name}
                      </button>
                    )}
                  </td>
                  <td className="price">
                    {component.selected ? renderPrice(component.selected.price) : '—'}
                  </td>
                  <td className="actions">
                    {component.selected && (
                      <div className="action-buttons">
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveComponent(component.id)}
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="additional-components">
        <div className="component-group">
          <div className="group-title">
            <span className="group-icon">🔌</span>
            Expansion / Networking
          </div>
          <div className="group-items">
            {expansionItems.map(item => (
              <span key={item} className="group-item">
                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</a>
              </span>
            ))}
          </div>
        </div>

        <div className="component-group">
          <div className="group-title">
            <span className="group-icon">🖱️</span>
            Peripherals
          </div>
          <div className="group-items">
            {peripherals.map(item => (
              <span key={item} className="group-item">
                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</a>
              </span>
            ))}
          </div>
        </div>

        <div className="component-group">
          <div className="group-title">
            <span className="group-icon">🔧</span>
            Accessories / Other
          </div>
          <div className="group-items">
            {accessories.map(item => (
              <span key={item} className="group-item">
                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</a>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="total-section">
        <div className="total-label">Total:</div>
        <div className="total-price">{renderPrice(totalPrice)}</div>
      </div>

      <div className="checkout-section">
        <button className="amazon-buy-btn">
          <span className="checkout-icon">🛒</span>
          Buy from Amazon
        </button>
      </div>

      {/* Compatibility issues section */}
      <div className="compatibility-issues" id="notes">
        <h2>Potential Issues / Incompatibilities</h2>

        <div className="issues-container">
          {compatibilityIssues.map((issue, index) => (
            <div key={index} className={`issue-item ${issue.type}`}>
              <div className="issue-badge">{issue.type === 'problem' ? 'P' : 'I'}</div>
              <div className="issue-content">
                <div className="issue-type">
                  {issue.type === 'problem' ? 'Problem:' : 'Note:'}
                </div>
                <div className="issue-message">
                  {issue.message}
                </div>
              </div>
            </div>
          ))}

          {compatibilityIssues.length === 0 && (
            <div className="no-issues">
              <div className="success-icon">✓</div>
              <p>No compatibility issues detected!</p>
            </div>
          )}
        </div>
      </div>

      {/* Motherboard Usage Component */}
      <MotherboardUsage
        motherboard={selectedMainboard}
        rams={selectedRams}
        cpu={selectedCpu}
        storages={selectedStorages}
        gpus={selectedGpus}
        components={components}
      />


    </div>
  );

  // Helper function to format price
  function renderPrice(price) {
    if (!price) return '—';
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Function to calculate estimated wattage
  function calculateWattage() {
    let totalWattage = 0;

    // CPU wattage (typically 65-125W)
    const cpu = components.find(c => c.id === 'cpu')?.selected;
    if (cpu) {
      totalWattage += cpu.specs?.tdp || 95;
    }

    // GPU wattage (typically 75-350W)
    const gpus = components.find(c => c.id === 'gpu')?.selected || [];
    gpus.forEach(gpu => {
      totalWattage += gpu.specs?.tdp || 150;
    });

    // Other components
    totalWattage += 40; // Motherboard
    totalWattage += 10; // Each RAM ~2-5W
    totalWattage += 15; // Each SSD/HDD ~5-10W
    totalWattage += 20; // Fans and other components

    return totalWattage;
  }
};

export default Build;