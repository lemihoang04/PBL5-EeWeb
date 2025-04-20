import { useNavigate, useLocation } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import './Build.css';
import MotherboardUsage from './MotherboardUsage';

const Build = () => {
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation();
  
  const [components, setComponents] = useState(() => {
    // Khôi phục trạng thái từ sessionStorage nếu có
    const savedComponents = sessionStorage.getItem('components');
    return savedComponents
      ? JSON.parse(savedComponents)
      : [
          { id: 'cpu', name: 'CPU', selected: null },
          { id: 'cpu Cooler', name: 'CPU Cooler', selected: null },
          { id: 'Mainboard', name: 'Mainboard', selected: null },
          { id: 'ram', name: 'RAM', selected: null },
          { id: 'storage', name: 'Storage', selected: null },
          { id: 'gpu', name: 'GPU', selected: null },
          { id: 'case', name: 'Case', selected: null },
          { id: 'psu', name: 'PSU', selected: null },
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

  const totalPrice = components.reduce((sum, component) => {
    return sum + (component.selected ? component.selected.price : 0);
  }, 0);

  const handleCategoryClick = (componentId) => {
    // Điều hướng đến ComponentSearch với loại thành phần
    if (componentId === 'cpu Cooler') {
      navigate(`/components/cpu%20cooler`);
    }
    else{
      navigate(`/components/${componentId}`);
    }
    
  };

  // Lưu trạng thái vào sessionStorage mỗi khi components thay đổi
    useEffect(() => {
      sessionStorage.setItem('components', JSON.stringify(components));
    }, [components]);

   // Xử lý dữ liệu được gửi từ ComponentSearch.jsx
   useEffect(() => {
    if (location.state?.addedComponent) {
      const addedComponent = location.state.addedComponent;
      setComponents((prevComponents) =>
        prevComponents.map((component) =>
          component.name === addedComponent.category_name
            ? { ...component, selected: addedComponent }
            : component
        )
      );
      console.log('Added component:', addedComponent);
    }
  }, [location.state]);

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
          <span>Estimated Wattage: 120W</span>
        </div>
      </div>

      <table className="components-table">
        <thead>
          <tr>
          <th className="component-col">Component</th>
            <th className="selection-col">Selection</th>
            <th className="base-col">Base</th>
            <th className="promo-col">Promo</th>
            <th className="shipping-col">Shipping</th>
            <th className="tax-col">Tax</th>
            <th className="price-col">Price</th>
            <th className="where-col">Where</th>
            <th className="action-col"></th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component.id} className="component-row">
              <td className="component-name">
                <a href={`#${component.id}`}>{component.name}</a>
              </td>
              <td className="selection">
                {component.selected ? (
                  <div className="selected-component">
                    <img src={component.selected.image} alt={component.selected.name} />
                    <span>{component.selected.name}</span>
                  </div>
                ) : (
                  <button 
                    className="choose-btn"
                    onClick={() => handleCategoryClick(component.id)}
                  >
                    Choose {component.id === 'operatingSystem' ? 'An' : 'A'} {component.name}
                  </button>
                )}
              </td>
              <td className="price">{component.selected ? `$${component.selected.price.toFixed(2)}` : '—'}</td>
              <td className="actions">
                {component.selected && (
                  <div className="action-buttons">
                    <button 
                      className="remove-btn" 
                      onClick={() => {
                        setComponents((prevComponents) =>
                          prevComponents.map((comp) =>
                            comp.id === component.id
                              ? { ...comp, selected: null }
                              : comp
                          )
                        );
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="additional-components">
        <div className="component-group">
          <div className="group-title">
            Expansion Cards / Networking
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
        <div className="total-price">${totalPrice.toFixed(2)}</div>
      </div>

      <div className="checkout-section">
        <button className="amazon-buy-btn">Buy From Amazon</button>
      </div>

      <MotherboardUsage/>
    </div>
  );
};

export default Build;