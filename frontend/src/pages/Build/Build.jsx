import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Build.css';
import MotherboardUsage from './MotherboardUsage';
import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaFan,
  FaCheck,
  FaCube,
  FaBolt,
  FaDesktop,
  FaShoppingCart,
  FaVideo
} from 'react-icons/fa';

// Helper function to parse memory capacity and convert to GB
function parseMemoryToGB(memoryString) {
  if (!memoryString) return 0;

  // Extract numeric part and unit
  const match = memoryString.match(/(\d+)\s*([GMK]B)/i);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  const unit = match[2].toUpperCase();

  // Convert to GB
  switch (unit) {
    case 'KB': return value / (1024 * 1024);
    case 'MB': return value / 1024;
    case 'GB': return value;
    default: return value;
  }
}

// Function to calculate total RAM capacity from modules
function calculateTotalRAMCapacity(rams) {
  let totalGB = 0;

  rams.forEach(ram => {
    if (!ram || !ram.attributes || !ram.attributes["Modules"]) return;

    const modulesStr = ram.attributes["Modules"];
    // Expected format: "2 x 8GB", extract numbers
    const match = modulesStr.match(/(\d+)\s*x\s*(\d+)\s*([GMK]B)/i);
    if (match && match[1] && match[2] && match[3]) {
      const moduleCount = parseInt(match[1], 10);
      const moduleSize = parseInt(match[2], 10);
      const unit = match[3].toUpperCase();
      // Convert to GB and add to total
      let sizeInGB = moduleSize;
      switch (unit) {
        case 'KB': sizeInGB = moduleSize / (1024 * 1024); break;
        case 'MB': sizeInGB = moduleSize / 1024; break;
        default: break; // GB or unknown units, keep as is
      }

      totalGB += moduleCount * sizeInGB;
    }
  });

  return totalGB;
}

// Function to extract module count from RAM's Modules attribute
function getModuleCount(ram) {
  if (!ram || !ram.attributes || !ram.attributes["Modules"]) return 1; // Default to 1 if not specified

  const modulesStr = ram.attributes["Modules"];
  // Expected format: "2 x 8GB", extract the first number
  const match = modulesStr.match(/^(\d+)\s*x/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 1; // Default to 1 if parsing fails
}

// Helper function to count M.2 slots from motherboard attribute
function countM2Slots(motherboard) {
  // console.log('Motherboard:', motherboard.attributes["M.2 Slots"].split(',').length);
  if (!motherboard || !motherboard.attributes || !motherboard.attributes["M.2 Slots"]) return 0;
  return motherboard.attributes["M.2 Slots"].split(',').length;
}

// Helper function to get number of SATA ports
function getSataPorts(motherboard) {
  if (!motherboard || !motherboard.attributes) return 0;
  const sataPorts = motherboard.attributes["SATA 6.0 Gb/s"];
  return sataPorts ? parseInt(sataPorts, 10) : 0;
}

// Function to categorize storage devices
function categorizeStorageDevices(storages) {
  const result = {
    m2Devices: [],
    sataDevices: []
  };

  storages.forEach(storage => {
    if (!storage || !storage.attributes) return;

    const interfaceType = storage.attributes["Interface"] || '';

    // Check if it's an M.2 NVMe device (contains M.2 but not SATA)
    if (interfaceType.includes('M.2') && !interfaceType.includes('SATA')) {
      result.m2Devices.push(storage);
    }
    // Check if it's a SATA device
    else if (interfaceType.includes('SATA')) {
      result.sataDevices.push(storage);
    }
    // Default to SATA for other storage devices
    else {
      result.sataDevices.push(storage);
    }
  });

  return result;
}

const Build = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [components, setComponents] = useState(() => {
    // Restore state from sessionStorage if available
    try {
      const savedComponents = sessionStorage.getItem('components');
      if (savedComponents) {
        const parsed = JSON.parse(savedComponents);
        console.log('Restored components from sessionStorage:', parsed);

        // Merge saved data with default component structure (including icons)
        const defaultComponents = [
          { id: 'cpu', name: 'CPU', selected: null, multiple: false, icon: <FaMicrochip /> },
          { id: 'cpu Cooler', name: 'CPU Cooler', selected: null, multiple: false, icon: <FaFan /> },
          { id: 'Mainboard', name: 'Mainboard', selected: null, multiple: false, icon: <FaDesktop /> },
          { id: 'ram', name: 'RAM', selected: [], multiple: true, icon: <FaMemory /> },
          { id: 'storage', name: 'Storage', selected: [], multiple: true, icon: <FaHdd /> },
          { id: 'gpu', name: 'GPU', selected: [], multiple: true, icon: <FaVideo /> },
          { id: 'case', name: 'Case', selected: null, multiple: false, icon: <FaCube /> },
          { id: 'psu', name: 'PSU', selected: null, multiple: false, icon: <FaBolt /> },
        ];

        // Merge saved selections with default structure
        const restoredComponents = defaultComponents.map(defaultComponent => {
          const savedComponent = parsed.find(saved => saved.id === defaultComponent.id);
          return savedComponent ? {
            ...defaultComponent,
            selected: savedComponent.selected
          } : defaultComponent;
        });

        return restoredComponents;
      }
    } catch (error) {
      console.error('Error parsing components from sessionStorage:', error);
      // Clear corrupted data
      sessionStorage.removeItem('components');
    }

    // Default components structure
    const defaultComponents = [
      { id: 'cpu', name: 'CPU', selected: null, multiple: false, icon: <FaMicrochip /> },
      { id: 'cpu Cooler', name: 'CPU Cooler', selected: null, multiple: false, icon: <FaFan /> },
      { id: 'Mainboard', name: 'Mainboard', selected: null, multiple: false, icon: <FaDesktop /> },
      { id: 'ram', name: 'RAM', selected: [], multiple: true, icon: <FaMemory /> },
      { id: 'storage', name: 'Storage', selected: [], multiple: true, icon: <FaHdd /> },
      { id: 'gpu', name: 'GPU', selected: [], multiple: true, icon: <FaVideo /> },
      { id: 'case', name: 'Case', selected: null, multiple: false, icon: <FaCube /> },
      { id: 'psu', name: 'PSU', selected: null, multiple: false, icon: <FaBolt /> },
    ];

    console.log('Using default components structure');
    return defaultComponents;
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

  // Memory compatibility check state
  const [memoryCompatible, setMemoryCompatible] = useState(true);

  const totalWattage = calculateWattage();

  // Add a state variable to track overall compatibility
  const [isCompatible, setIsCompatible] = useState(true);

  function calculateTotalPrice() {
    // Object to store price of each component category
    const componentTotals = {};
    let grandTotal = 0;

    // Calculate price for each component separately
    components.forEach(component => {
      let categoryTotal = 0;

      if (component.multiple && component.selected && component.selected.length > 0) {
        // For multiple components (RAM, Storage, GPU)
        categoryTotal = component.selected.reduce((sum, item) =>
          sum + (item && item['price'] ? Number(item['price']) : 0), 0);
      } else if (component.selected && component.selected['price']) {
        // For single components (CPU, Mainboard, etc.)
        categoryTotal = Number(component.selected['price']);
      }

      // Store category total and add to grand total
      componentTotals[component.id] = categoryTotal;
      grandTotal += categoryTotal;
    });

    return grandTotal; // Return the sum of all components
  }

  const totalPrice = calculateTotalPrice();

  // Get selected mainboard (if any)
  const selectedMainboard = components.find(component => component.id === 'Mainboard')?.selected || null;

  // Get list of selected RAMs
  const selectedRams = components.find(component => component.id === 'ram')?.selected || [];

  // Get other components if needed
  const selectedCpu = components.find(component => component.id === 'cpu')?.selected || null;
  const selectedStorages = components.find(component => component.id === 'storage')?.selected || [];
  const selectedGpus = components.find(component => component.id === 'gpu')?.selected || [];
  // Component mount effect - verify sessionStorage sync
  useEffect(() => {
    console.log('Build component mounted, current components:', components);

    // Force a sessionStorage sync on mount
    try {
      const currentSessionData = sessionStorage.getItem('components');
      if (currentSessionData) {
        const parsed = JSON.parse(currentSessionData);
        console.log('Current sessionStorage data:', parsed);
      }
    } catch (error) {
      console.error('Error reading sessionStorage on mount:', error);
    }

    // Listen for storage events (when sessionStorage changes in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'components' && e.newValue) {
        try {
          const updatedComponents = JSON.parse(e.newValue);
          console.log('SessionStorage updated from another tab:', updatedComponents);
          setComponents(updatedComponents);
        } catch (error) {
          console.error('Error parsing storage event data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Update compatibility issues whenever components change
  useEffect(() => {
    const issues = [];
    let isCompatible = true;

    // Check RAM compatibility
    const motherboard = components.find(c => c.id === 'Mainboard')?.selected;
    const rams = components.find(c => c.id === 'ram')?.selected || [];
    const storages = components.find(c => c.id === 'storage')?.selected || [];
    const gpus = components.find(c => c.id === 'gpu')?.selected || [];

    if (motherboard && rams.length > 0) {
      // Calculate total RAM modules using getModuleCount
      const totalRamModules = rams.reduce((sum, ram) => {
        return sum + getModuleCount(ram);
      }, 0);

      // Check RAM slot count against total module count
      const ramSlots = motherboard.specs?.memorySlots || motherboard.attributes?.["Memory Slots"] || 4;
      if (totalRamModules > ramSlots) {
        issues.push({
          type: 'problem',
          message: `Your motherboard only supports ${ramSlots} RAM modules, but you've selected ${totalRamModules} modules in total.`
        });
        isCompatible = false; // RAM slots exceeded, set compatibility to false
      }

      // Check RAM capacity against motherboard max memory
      const maxMemoryStr = motherboard.attributes?.["Memory Max"];
      if (maxMemoryStr) {
        const maxMemoryGB = parseMemoryToGB(maxMemoryStr);
        const totalRAMCapacityGB = calculateTotalRAMCapacity(rams);

        if (totalRAMCapacityGB > maxMemoryGB) {
          issues.push({
            type: 'problem',
            message: `Total RAM capacity (${totalRAMCapacityGB}GB) exceeds motherboard maximum (${maxMemoryGB}GB).`
          });
          isCompatible = false; // RAM capacity exceeded, set compatibility to false
        }
      }

      // Set memory compatibility based on all checks above
      setMemoryCompatible(isCompatible);
    }

    // Check storage compatibility
    if (motherboard && storages.length > 0) {
      const { m2Devices, sataDevices } = categorizeStorageDevices(storages);
      console.log('M.2 Devices:', m2Devices.length);
      // Get available slots from motherboard
      const availableM2Slots = countM2Slots(motherboard);
      const availableSataPorts = getSataPorts(motherboard);

      // Check M.2 compatibility
      if (m2Devices.length > availableM2Slots) {
        issues.push({
          type: 'problem',
          message: `M.2 device count (${m2Devices.length}) exceeds available M.2 slots (${availableM2Slots}).`
        });
        isCompatible = false;
      }

      // Check SATA compatibility
      if (sataDevices.length > availableSataPorts) {
        issues.push({
          type: 'problem',
          message: `SATA device count (${sataDevices.length}) exceeds available SATA ports (${availableSataPorts}).`
        });
        isCompatible = false;
      }
    }

    // Check GPU compatibility
    if (motherboard && gpus.length > 0) {
      const availablePcieX16Slots = motherboard.attributes?.["PCIe x16 Slots"] || 0;

      if (gpus.length > availablePcieX16Slots) {
        issues.push({
          type: 'problem',
          message: `The number of GPUs (${gpus.length}) exceeds the available PCIe x16 slots (${availablePcieX16Slots}).`
        });
        isCompatible = false;
      }
    }

    // Update the overall compatibility state
    setIsCompatible(isCompatible);
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
    else if (componentId === 'cpu') {
      // Check if CPU Cooler has been selected
      const selectedMainboard = components.find((component) => component.id === 'Mainboard')?.selected;

      if (selectedMainboard) {

        navigate(`/components/cpu?cpu_socket=${selectedMainboard['attributes']['Socket/CPU']}`);
      } else {
        // Navigate to regular CPU selection
        navigate(`/components/cpu`);
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
    else if (componentId === 'ram') {
      // Check if Mainboard has been selected
      const selectedMainboard = components.find((component) => component.id === 'Mainboard')?.selected;

      // If Mainboard is selected, navigate to RAM with memory type filter
      if (selectedMainboard) {
        console.log('Selected Mainboard:', selectedMainboard['attributes']['Memory Type']);
        // Navigate to RAM with Memory Type parameter
        navigate(`/components/ram?memory_type=${selectedMainboard['attributes']['Memory Type']}`);
      } else {
        // Navigate to regular RAM selection
        navigate(`/components/ram`);
      }
    }
    else if (componentId === 'storage') {
      navigate(`/components/storage`);
    }
    else if (componentId === 'case') {
      // Check if Mainboard has been selected
      const selectedMainboard = components.find((component) => component.id === 'Mainboard')?.selected;

      // If Mainboard is selected, navigate to Case with form factor filter
      if (selectedMainboard) {
        console.log('Selected Mainboard:', selectedMainboard['attributes']['Form Factor']);
        // Navigate to Case with Form Factor parameter
        navigate(`/components/case?form_factor=${selectedMainboard['attributes']['Form Factor']}`);
      } else {
        // Navigate to regular Case selection
        navigate(`/components/case`);
      }
    }
    else if (componentId === 'psu') {

      navigate(`/components/psu?wattage=${totalWattage}`);
    }
    else {
      navigate(`/components/${componentId}`);
    }
  };
  // Save state to sessionStorage each time components change
  useEffect(() => {
    try {
      // Create a serializable version of components by excluding React icons and other non-serializable properties
      const serializableComponents = components.map(component => ({
        id: component.id,
        name: component.name,
        selected: component.selected,
        multiple: component.multiple
        // Exclude 'icon' property as it contains React elements which cause circular references
      }));

      const componentsToSave = JSON.stringify(serializableComponents);
      sessionStorage.setItem('components', componentsToSave);
      console.log('Components saved to sessionStorage:', serializableComponents);
    } catch (error) {
      console.error('Error saving components to sessionStorage:', error);
    }
  }, [components]);
  // Handle data sent from ComponentSearch.jsx
  useEffect(() => {
    if (location.state?.addedComponent) {
      const componentDetail = location.state.addedComponent;
      console.log('Adding component from ComponentSearch:', componentDetail);

      setComponents((prevComponents) => {
        const updatedComponents = prevComponents.map((component) => {
          if (component.name === componentDetail.category_name) {
            if (component.multiple) {
              // If component supports multiple selections
              const currentSelected = component.selected || [];
              const newSelected = [...currentSelected, componentDetail];
              console.log(`Added to ${component.name}, new count: ${newSelected.length}`);
              return {
                ...component,
                selected: newSelected,
              };
            } else {
              // If component only supports one selection
              console.log(`Replaced ${component.name} selection`);
              return { ...component, selected: componentDetail };
            }
          }
          return component;
        });

        return updatedComponents;
      });

      // Clear the location state to prevent re-adding on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);  // Hàm handleRemoveComponent - Xử lý xóa component
  const handleRemoveComponent = (componentId, index = null) => {
    console.log(`Removing component: ${componentId}, index: ${index}`);

    setComponents((prevComponents) => {
      const updatedComponents = prevComponents.map((comp) => {
        if (comp.id === componentId) {
          if (comp.multiple && index !== null) {
            // Xóa một mục cụ thể khỏi mảng đã chọn
            const newSelected = [...comp.selected];
            newSelected.splice(index, 1);
            console.log(`Removed item at index ${index} from ${componentId}, remaining: ${newSelected.length}`);
            return { ...comp, selected: newSelected };
          } else {
            // Xóa tất cả các mục đã chọn nếu không phải dạng multiple hoặc không có chỉ mục
            console.log(`Cleared all selections for ${componentId}`);
            return { ...comp, selected: comp.multiple ? [] : null };
          }
        }
        return comp;
      });

      // Remove manual sessionStorage update here since useEffect handles it
      console.log('Component removal completed, useEffect will handle sessionStorage update');

      return updatedComponents;
    });
  };

  // Function to clear all components (for debugging)
  const clearAllComponents = () => {
    console.log('Clearing all components');
    setComponents(prevComponents =>
      prevComponents.map(comp => ({
        ...comp,
        selected: comp.multiple ? [] : null
      }))
    );
  };

  const handleBuyNow = () => {
    // Check if there are any components selected
    const hasSelectedComponents = components.some(component =>
      component.multiple
        ? (component.selected && component.selected.length > 0)
        : component.selected !== null
    );

    if (!hasSelectedComponents) {
      alert("Please select at least one component before proceeding to checkout.");
      return;
    }

    // Create items array from the selected components
    const items = [];

    components.forEach(component => {
      if (component.multiple && component.selected && component.selected.length > 0) {
        // For components with multiple selections (RAM, Storage, GPU)
        component.selected.forEach(item => {
          items.push({
            product_id: item.product_id || item.id,
            price: item.price || 0,
            title: item.title || item.name,
            quantity: 1,
            image: item.image
          });
        });
      } else if (!component.multiple && component.selected) {
        // For components with single selection (CPU, Mainboard, etc.)
        items.push({
          product_id: component.selected.product_id || component.selected.id,
          price: component.selected.price || 0,
          title: component.selected.title || component.selected.name,
          quantity: 1,
          image: component.selected.image
        });
      }
    });

    const amount = totalPrice;
    const isBuyNow = true;
    const formValue = { items, amount, isBuyNow };

    console.log("PC Build items to buy:", items);
    navigate("/checkout", {
      state: { formValue }
    });
  };
  return (
    <div className="build-container">
      <div className={`header ${!isCompatible ? 'incompatible' : ''}`}>
        <div className="compatibility">
          <span className="icon"><FaCheck /></span>
          <span className="label">Compatibility Check:</span>
          <span className="notes">See <a href="#notes">details</a> below.</span>
        </div>
        <div className="wattage">
          <span className="icon"><FaBolt /></span>
          <span>Power Required: {calculateWattage()}W</span>
        </div>
      </div>

      <table className="components-table">
        <thead>
          <tr>
            <th className="component-col">Component</th>
            <th className="selection-col">Selection</th>
            <th className="price-col">Price</th>
            <th className="action-col">Action</th>
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
                        <div>
                          <span className="component-icon">{component.icon}</span>
                          {component.name}
                        </div>
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
                          <div>
                            <span className="component-icon">{component.icon}</span>
                            {component.name}
                          </div>
                        </td>
                      )}
                      <td className="selection">
                        <div className="selected-component">
                          <img src={item.image} alt={item.name} />
                          <span>
                            {component.id === 'ram' ? formatRAMDisplayText(item) : item.title}
                          </span>
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
                    <div>
                      <span className="component-icon">{component.icon}</span>
                      {component.name}
                    </div>
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

      {/* <div className="additional-components">
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
      </div> */}

      <div className="total-section">
        <div className="total-label">Total:</div>
        <div className="total-price">{renderPrice(totalPrice)}</div>
      </div>      <div className="checkout-section">
        <button className="amazon-buy-btn" onClick={handleBuyNow}>
          <span className="checkout-icon"><FaShoppingCart /></span>
          Buy Complete Build
        </button>
        {/* Debug button - only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <button
            className="amazon-buy-btn"
            onClick={clearAllComponents}
            style={{ marginLeft: '10px', backgroundColor: '#ff6b6b' }}
          >
            🗑️ Clear All
          </button>
        )}
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
              <div className="success-icon"><FaCheck /></div>
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
    console.log('Price:', price);
    if (!price) return '—';
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Function to calculate estimated wattage
  function calculateWattage() {
    let totalWattage = 0;

    // CPU wattage (typically 65-125W)
    const cpu = components.find(c => c.id === 'cpu')?.selected;
    const cpuCooler = components.find(c => c.id === 'cpu Cooler')?.selected;
    const mainboard = components.find(c => c.id === 'Mainboard')?.selected;
    const rams = components.find(c => c.id === 'ram')?.selected || [];
    const storages = components.find(c => c.id === 'storage')?.selected || [];

    // Function to calculate total price of all components

    // Mainboard wattage
    if (mainboard) {
      totalWattage += 70;
    }

    // CPU Cooler wattage
    if (cpuCooler) {
      totalWattage += 15;
    }

    // CPU wattage
    if (cpu) {
      const tdpValue = cpu['attributes']['TDP'] ? parseInt(cpu['attributes']['TDP']) : NaN;
      totalWattage += isNaN(tdpValue) ? 95 : tdpValue;
    }

    // RAM wattage - 30W per RAM module
    rams.forEach(ram => {
      totalWattage += 30;
    });

    // Storage wattage - 10W per storage device
    storages.forEach(storage => {
      totalWattage += 10;
    });

    // GPU wattage (using TDP values)
    const gpus = components.find(c => c.id === 'gpu')?.selected || [];
    gpus.forEach(gpu => {
      totalWattage += parseInt(gpu['attributes']['TDP']) || 150;
    });
    return totalWattage;
  }

  // Helper function to format RAM display text with modules
  function formatRAMDisplayText(ram) {
    if (!ram) return '';
    
    const baseTitle = ram.title || ram.name || '';
    const modules = ram.attributes?.["Modules"];
    
    if (modules) {
      return `${baseTitle} (${modules})`;
    }
    
    return baseTitle;
  }
};

export default Build;