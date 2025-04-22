import { useNavigate, useLocation } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import './Build.css';
import MotherboardUsage from './MotherboardUsage';

const Build = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [components, setComponents] = useState(() => {
    // Khôi phục trạng thái từ sessionStorage nếu có
    const savedComponents = sessionStorage.getItem('components');
    return savedComponents
      ? JSON.parse(savedComponents)
      : [
          { id: 'cpu', name: 'CPU', selected: null, multiple: false },
          { id: 'cpu Cooler', name: 'CPU Cooler', selected: null, multiple: false },
          { id: 'Mainboard', name: 'Mainboard', selected: null, multiple: false },
          { id: 'ram', name: 'RAM', selected: [], multiple: true },
          { id: 'storage', name: 'Storage', selected: [], multiple: true },
          { id: 'gpu', name: 'GPU', selected: [], multiple: true },
          { id: 'case', name: 'Case', selected: null, multiple: false },
          { id: 'psu', name: 'PSU', selected: null, multiple: false },
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
        // Nếu là dạng multiple (mảng các sản phẩm)
        return sum + component.selected.reduce((itemSum, item) => itemSum + (item ? item.price : 0), 0);
      } else {
        // Nếu là dạng single (một sản phẩm)
        return sum + (component.selected ? component.selected.price : 0);
      }
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  // Lấy mainboard được chọn (nếu có)
  const selectedMainboard = components.find(component => component.id === 'Mainboard')?.selected || null;
  
  // Lấy danh sách RAM được chọn
  const selectedRams = components.find(component => component.id === 'ram')?.selected || [];

  // Lấy các thành phần khác nếu cần
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
    // Điều hướng đến ComponentSearch với loại thành phần
    if (componentId === 'cpu Cooler') {
      navigate(`/components/cpu%20cooler`);
    } else {
      navigate(`/components/${componentId}`);
    }
  };

  // Lưu trạng thái vào sessionStorage mỗi khi components thay đổi
  useEffect(() => {
    sessionStorage.setItem('components', JSON.stringify(components));
  }, [components]);

  // Xử lý dữ liệu được gửi từ ComponentSearch.jsx
  // useEffect(() => {
  //   if (location.state?.addedComponent) {
  //     const addedComponent = location.state.addedComponent;
  //     setComponents((prevComponents) =>
  //       prevComponents.map((component) => {
  //         if (component.name === addedComponent.category_name) {
  //           if (component.multiple) {
  //             // Nếu component hỗ trợ nhiều lựa chọn
  //             return { 
  //               ...component, 
  //               selected: [...(component.selected || []), addedComponent] 
  //             };
  //           } else {
  //             // Nếu component chỉ hỗ trợ một lựa chọn
  //             return { ...component, selected: addedComponent };
  //           }
  //         }
  //         return component;
  //       })
  //     );
  //     console.log('Added component:', addedComponent);
  //   }
  // }, [location.state]);


  useEffect(() => {
    if (location.state?.addedComponent) {
      const addedComponent = location.state.addedComponent;
      setComponents((prevComponents) =>
        prevComponents.map((component) => {
          if (component.name === addedComponent.category_name) {
            if (component.id === 'Mainboard') {
              // Xử lý riêng cho Mainboard để lấy giá trị M2.slot
              const m2Slots = addedComponent.attributes?.['m2Slots'] || [];
              console.log('M2:', m2Slots);
              return {
                ...component,
                selected: { ...addedComponent, m2Slots }, // Lưu cả sản phẩm và M2.slot
              };
            } else if (component.multiple) {
              // Nếu component hỗ trợ nhiều lựa chọn
              return {
                ...component,
                selected: [...(component.selected || []), addedComponent],
              };
            } else {
              // Nếu component chỉ hỗ trợ một lựa chọn
              return { ...component, selected: addedComponent };
            }
          }
          return component;
        })
      );
      
      console.log('Added component:', addedComponent);
    }
  }, [location.state]);

  const handleRemoveComponent = (componentId, index = null) => {
    setComponents((prevComponents) =>
      prevComponents.map((comp) => {
        if (comp.id === componentId) {
          if (comp.multiple && index !== null) {
            // Xóa một mục cụ thể từ mảng selected
            const newSelected = [...comp.selected];
            newSelected.splice(index, 1);
            return { ...comp, selected: newSelected };
          } else {
            // Xóa toàn bộ selected nếu không phải multiple hoặc không có index
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
            <React.Fragment key={component.id}>
              {component.multiple ? (
                // Xử lý cho các thành phần có thể chọn nhiều (RAM, Storage, GPU)
                <>
                  {/* Hiển thị tên thành phần nếu chưa có lựa chọn nào */}
                  {component.selected.length === 0 && (
                    <tr className="component-row">
                      <td className="component-name">
                        <a href={`#${component.id}`}>{component.name}</a>
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
                  
                  {/* Hiển thị các mục đã chọn */}
                  {component.selected.map((item, index) => (
                    <tr key={`${component.id}-${index}`} className="component-row">
                      {/* Chỉ hiển thị tên thành phần ở dòng đầu tiên */}
                      {index === 0 && (
                        <td className="component-name" rowSpan={component.selected.length}>
                          <a href={`#${component.id}`}>{component.name}</a>
                        </td>
                      )}
                      <td className="selection">
                        <div className="selected-component">
                          <img src={item.image} alt={item.name} />
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td className="price">${item.price.toFixed(2)}</td>
                      <td className="actions">
                        <div className="action-buttons">
                          <button 
                            className="remove-btn" 
                            onClick={() => handleRemoveComponent(component.id, index)}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Chỉ hiển thị nút "Add Another" khi đã có ít nhất một thành phần được chọn */}
                  {component.selected.length > 0 && (
                    <tr className="add-another-row">
                      <td colSpan="9" className="add-another-cell">
                        <button 
                          className="add-another-btn"
                          onClick={() => handleCategoryClick(component.id)}
                        >
                          + Add Another {component.name}
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                // Xử lý cho các thành phần chỉ chọn một (CPU, Mainboard, v.v.)
                <tr className="component-row">
                  <td className="component-name">
                    <a href={`#${component.id}`}>{component.name}</a>
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
                        Choose {component.id === 'operatingSystem' ? 'An' : 'A'} {component.name}
                      </button>
                    )}
                  </td>
                  <td className="price">
                    {component.selected ? `$${component.selected.price.toFixed(2)}` : '—'}
                  </td>
                  <td className="actions">
                    {component.selected && (
                      <div className="action-buttons">
                        <button 
                          className="remove-btn" 
                          onClick={() => handleRemoveComponent(component.id)}
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

      {/* New Compatibility Issues Section */}
      <div className="compatibility-issues" id="notes">
        <h2>Potential Issues / Incompatibilities</h2>
        
        <div className="issues-container">
          {compatibilityIssues.map((issue, index) => (
            <div key={index} className={`issue-item ${issue.type}`}>
              <div className="issue-badge">{issue.type === 'problem' ? 'A' : 'B'}</div>
              <div className="issue-content">
                <div className="issue-type">
                  {issue.type === 'problem' ? 'Problem:' : 'Disclaimer:'}
                </div>
                <div className="issue-message">
                  {issue.message}
                </div>
              </div>
            </div>
          ))}
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
};

export default Build;