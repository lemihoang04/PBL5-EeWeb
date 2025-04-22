import React from 'react';
import './MotherboardUsage.css';

const MotherboardUsage = ({ motherboard, rams, cpu, storages, gpus }) => {
  // Error handling for missing motherboard
  if (!motherboard) {
    return (
      <div className="motherboard-usage motherboard-empty">
        <h2>Motherboard Usage</h2>
        <div className="empty-state">
          <p>Select a motherboard to view compatibility and component placement.</p>
        </div>
      </div>
    );
  }

  // Extract motherboard specs - with error handling for missing properties
  const ramSlots = motherboard.specs?.memorySlots || 4;
  const m2Slots = motherboard.specs?.m2Slots || 2;
  const pcieX16Slots = motherboard.specs?.pcieX16Slots || 2;
  const pcieX1Slots = motherboard.specs?.pcieX1Slots || 2;
  const socketType = motherboard.specs?.socketType || "Unknown";

  // Function to safely get images with fallbacks
  const getSafeImage = (item, defaultImage) => {
    try {
      return item?.image || defaultImage;
    } catch (error) {
      console.error("Error accessing image property:", error);
      return defaultImage;
    }
  };

  // Function to safely get component names
  const getSafeName = (item, type) => {
    try {
      return item?.title || `Unknown ${type}`;
    } catch (error) {
      console.error(`Error accessing title for ${type}:`, error);
      return `Unknown ${type}`;
    }
  };

  return (
    <div className="motherboard-usage">
      <h2>Motherboard Usage</h2>
      
      <div className="motherboard-header">
        <div className="mb-image-container">
          <img 
            src={getSafeImage(motherboard, "/images/motherboard-placeholder.png")} 
            alt="Motherboard" 
            className="mb-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/motherboard-placeholder.png";
            }}
          />
        </div>
        <div className="mb-title">{getSafeName(motherboard, "Motherboard")}</div>
      </div>
      
      <div className="mb-layout">
        <div className="mb-section">
          <div className="section-header">CPU Sockets</div>
          <div className="section-content">
            <div className="socket-item">
              <div className="socket-label">CPU_1 ({socketType})</div>
              <div className="socket-connection"></div>
              {cpu ? (
                <div className="component-item">
                  <img 
                    src={getSafeImage(cpu, "/images/cpu-placeholder.png")} 
                    alt="CPU" 
                    className="component-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/cpu-placeholder.png";
                    }}
                  />
                  <div className="component-name">{getSafeName(cpu, "CPU")}</div>
                </div>
              ) : (
                <div className="component-empty">No CPU selected</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-section">
          <div className="section-header">Memory Slots</div>
          <div className="section-content">
            {/* Dynamically generate RAM slots based on motherboard specs */}
            {Array.from({ length: ramSlots }, (_, index) => (
              <div className="memory-item" key={`ram-${index}`}>
                <div className="memory-label">RAM_{index + 1} (288-pin DIMM)</div>
                <div className="memory-connection"></div>
                {rams && index < rams.length ? (
                  <div className="component-item">
                    <img 
                      src={getSafeImage(rams[index], "/images/ram-placeholder.png")} 
                      alt="RAM" 
                      className="component-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/ram-placeholder.png";
                      }}
                    />
                    <div className="component-name">
                      {getSafeName(rams[index], "RAM")}
                      {rams.length > 1 ? ` ${index + 1}/${rams.length}` : ''}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-note">* Refer to the motherboard manual to determine which specific memory slots to use.</div>
      
      <div className="mb-layout">
        <div className="mb-section">
          <div className="section-header">M.2 Slots</div>
          <div className="section-content">
            {/* Dynamically generate M.2 slots based on motherboard specs */}
            {Array.from({ length: m2Slots }, (_, index) => {
              // Find a storage that's M.2 type (we should add a type property to the storages)
              const m2Storage = storages.find(storage => 
                storage?.specs?.type === 'M.2' || storage?.title?.includes('M.2')
              );
              
              return (
                <div className="slot-item" key={`m2-${index}`}>
                  <div className="slot-label">M2_{index + 1} (M)</div>
                  <div className="slot-connection"></div>
                  {m2Storage && index === 0 ? (
                    <div className="component-item">
                      <img 
                        src={getSafeImage(m2Storage, "/images/m2-placeholder.png")} 
                        alt="M.2 SSD" 
                        className="component-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/m2-placeholder.png";
                        }}
                      />
                      <div className="component-name">{getSafeName(m2Storage, "SSD")}</div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mb-section">
          <div className="section-header">Expansion Slots</div>
          <div className="section-content">
            {/* PCIe x16 slots */}
            {Array.from({ length: pcieX16Slots }, (_, index) => (
              <div className="slot-item" key={`pcie16-${index}`}>
                <div className="slot-label">PCIE_{index + 1} (x16)</div>
                <div className="slot-connection"></div>
                {gpus && index < gpus.length ? (
                  <div className="component-item">
                    <img 
                      src={getSafeImage(gpus[index], "/images/gpu-placeholder.png")} 
                      alt="GPU" 
                      className="component-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/gpu-placeholder.png";
                      }}
                    />
                    <div className="component-name">{getSafeName(gpus[index], "GPU")}</div>
                  </div>
                ) : null}
              </div>
            ))}
            
            {/* PCIe x1 slots */}
            {Array.from({ length: pcieX1Slots }, (_, index) => (
              <div className="slot-item" key={`pcie1-${index}`}>
                <div className="slot-label">PCIE_{pcieX16Slots + index + 1} (x1)</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotherboardUsage;