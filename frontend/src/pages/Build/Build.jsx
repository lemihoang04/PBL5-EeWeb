import React, { useState } from 'react';
import './Build.css';

const Build = () => {
  const [components, setComponents] = useState([
    {
      // id: 'cpu',
      // name: 'CPU',
      // selected: {
      //   name: 'AMD Ryzen 7 9800X3D 4.7 GHz 8-Core Processor',
      //   price: 479.00,
      //   image: 'https://m.media-amazon.com/images/I/51D3BmtA+GL._AC_UF1000,1000_QL80_.jpg'
      // }
      id : 'cpu', name : 'CPU', selected: null
    },
    { id: 'cpuCooler', name: 'CPU Cooler', selected: null },
    { id: 'motherboard', name: 'Motherboard', selected: null },
    { id: 'memory', name: 'Memory', selected: null },
    { id: 'storage', name: 'Storage', selected: null },
    { id: 'videoCard', name: 'Video Card', selected: null },
    { id: 'case', name: 'Case', selected: null },
    { id: 'powerSupply', name: 'Power Supply', selected: null },
    { id: 'operatingSystem', name: 'Operating System', selected: null },
    { id: 'monitor', name: 'Monitor', selected: null }
  ]);

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
    // This would navigate to the component category page in a real application
    console.log(`Navigating to ${componentId} category`);
    alert(`Navigating to ${componentId} category...`);
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
              <td className="base">{component.selected ? `$${component.selected.price.toFixed(2)}` : '—'}</td>
              <td className="promo">—</td>
              <td className="shipping">
                {component.selected && <img src="https://m.media-amazon.com/images/G/01/prime/detail/images/prime_check_badge._CB659998231_.png" alt="Prime" className="prime-icon" />}
              </td>
              <td className="tax">—</td>
              <td className="price">{component.selected ? `$${component.selected.price.toFixed(2)}` : ''}</td>
              <td className="where">
                {component.selected && <span className="amazon-label">amazon.com</span>}
              </td>
              <td className="actions">
                {component.selected && (
                  <div className="action-buttons">
                    <button className="buy-btn">Buy</button>
                    <button className="remove-btn">✕</button>
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
    </div>
  );
};

export default Build;