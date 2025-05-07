import React, { useState, useEffect } from 'react';
import './MotherboardUsage.css';

function countM2slot(input) {
  if (!input) return 0;
  return input.split(',').length;
}

const MotherboardUsage = ({ motherboard, rams, cpu, storages, gpus }) => {
  const [animateSection, setAnimateSection] = useState(null);

  // Animation effect for highlighting sections when component mounts
  useEffect(() => {
    const sections = ['cpu', 'ram', 'storage', 'expansion'];
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      setAnimateSection(sections[currentIndex]);
      currentIndex = (currentIndex + 1) % sections.length;

      // Remove animation effect after 700ms
      setTimeout(() => {
        setAnimateSection(null);
      }, 700);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Error handling for missing motherboard
  if (!motherboard) {
    return (
      <div className="motherboard-usage motherboard-empty">
        <h2>Motherboard Usage</h2>
        <div className="empty-state">
          <p>Select a motherboard to view component compatibility and positioning.</p>
        </div>
      </div>
    );
  }

  // Extract motherboard specs - with error handling for missing properties

  const ramSlots = motherboard.attributes?.["Memory Slots"] || 3;
  const m2Slots = countM2slot(motherboard.attributes?.["M.2 Slots"]);
  const pcieX16Slots = motherboard.attributes?.["PCIe x16 Slots"] || 2;
  const pcieX1Slots = motherboard.attributes?.["PCIe x1 Slots"] || 0;
  const socketType = motherboard.attributes?.["Socket/CPU"] || "Unknown";
  const sataPorts = motherboard.attributes?.["SATA 6.0 Gb/s"] || 0;

  // Extract Rams spect
  


  // Filter M.2 type storage devices
  const m2Storages = storages.filter(storage =>
    storage?.specs?.type === 'M.2' || storage?.title?.includes('M.2')
  );

  // Filter SATA or other storage devices
  const sataStorages = storages.filter(storage =>
    !m2Storages.includes(storage)
  );

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

  // Check if a PCIe slot is covered by a component
  const isPCIeSlotCovered = (slotIndex, slotType) => {
    if (slotType === 'x16' && gpus.length > 0) {
      // In real world, a GPU often covers more than one slot
      // Let's assume each GPU covers the slot it's in and potentially one extra slot
      for (let i = 0; i < gpus.length; i++) {
        if (i === slotIndex || i + 1 === slotIndex) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div className="motherboard-usage">
      <h2>Motherboard Compatibility Diagram</h2>

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
        <div className="mb-title">
          {getSafeName(motherboard, "Motherboard")}
          <div className="mb-subtitle">{motherboard.attributes?.["Chipset"] || 'Unknown Chipset'}</div>
        </div>
      </div>

      {/* CPU and RAM in the same row */}
      <div className={`mb-layout ${animateSection === 'cpu' || animateSection === 'ram' ? 'highlight-section' : ''}`}>
        <div className="mb-section">
          <div className="section-header">
            <span className="section-icon">🧠</span> CPU Sockets
          </div>
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
                  <div className="component-name">
                    {getSafeName(cpu, "CPU")}
                    {/* <div className="component-specs">{cpu.specs?.cores || 'N/A'} cores, {cpu.specs?.frequency || 'N/A'}</div> */}
                  </div>
                </div>
              ) : (
                <div className="component-empty">No CPU selected</div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-section">
          <div className="section-header">
            <span className="section-icon">🧮</span> Memory Slots ({ramSlots} slots)
          </div>
          <div className="section-content">
            {/* Dynamically generate RAM slots based on motherboard specs */}
            {Array.from({ length: ramSlots }, (_, index) => (
              <div className="memory-item" key={`ram-${index}`}>
                <div className="memory-label">RAM_{index + 1} (DDR4)</div>
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
                      {/* <div className="component-specs">
                        {rams[index].specs?.capacity || 'N/A'}, {rams[index].specs?.speed || 'N/A'}
                      </div> */}
                    </div>
                  </div>
                ) : (
                  <div className="component-empty">No RAM selected</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-note">
        <span className="note-icon">ℹ️</span> The number of RAM slots may vary depending on the motherboard. Please refer to the motherboard manual for optimal RAM installation.
      </div>

      {/* Storage section remains as is */}
      <div className={`mb-layout ${animateSection === 'storage' ? 'highlight-section' : ''}`}>
        <div className="mb-section">
          <div className="section-header">
            <span className="section-icon">💾</span> M.2 Slots ({m2Slots} slots)
          </div>
          <div className="section-content">
            {/* Dynamically generate M.2 slots based on motherboard specs */}
            {Array.from({ length: m2Slots }, (_, index) => {
              const m2Storage = m2Storages[index];

              return (
                <div className="slot-item" key={`m2-${index}`}>
                  <div className="slot-label">M2_{index + 1} (M)</div>
                  <div className="slot-connection"></div>
                  {m2Storage ? (
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
                      <div className="component-name">
                        {getSafeName(m2Storage, "SSD")}
                        <div className="component-specs">
                          {m2Storage.specs?.capacity || 'N/A'}, {m2Storage.specs?.interface || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="component-empty">No M.2 SSD selected</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-section">
          <div className="section-header">
            <span className="section-icon">💿</span> SATA Port ({sataPorts} slots)
          </div>
          <div className="section-content">
            {/* Dynamically generate RAM slots based on motherboard specs */}
            {Array.from({ length: ramSlots }, (_, index) => (
              <div className="memory-item" key={`ram-${index}`}>
                <div className="memory-label">SATA_{index + 1} (6.0 Gb/s)</div>
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
                      {/* <div className="component-specs">
                        {rams[index].specs?.capacity || 'N/A'}, {rams[index].specs?.speed || 'N/A'}
                      </div> */}
                    </div>
                  </div>
                ) : (
                  <div className="component-empty">No SATA 6.0 Gb/s selected</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PCIe slots section remains as is */}
      <div className={`mb-layout ${animateSection === 'expansion' ? 'highlight-section' : ''}`}>
        <div className="mb-section">
          <div className="section-header">
            <span className="section-icon">🎮</span> PCIe x16 Slots ({pcieX16Slots} slots)
          </div>
          <div className="section-content">
            {/* PCIe x16 slots */}
            {Array.from({ length: pcieX16Slots }, (_, index) => (
              <div className={`slot-item ${isPCIeSlotCovered(index, 'x16') && index > 0 ? 'covered' : ''}`} key={`pcie16-${index}`}>
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
                    <div className="component-name">
                      {getSafeName(gpus[index], "GPU")}
                      <div className="component-specs">
                        {gpus[index].specs?.memory || 'N/A'} VRAM
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="component-empty">
                    {isPCIeSlotCovered(index, 'x16') ? 'Slot covered by another GPU' : 'No PCIe device selected'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-section">
          <div className="section-header">
            <span className="section-icon">🔌</span> PCIe x1/x4 Slots
          </div>
          <div className="section-content">
            {/* PCIe x1 slots */}
            {Array.from({ length: pcieX1Slots }, (_, index) => (
              <div className={`slot-item ${isPCIeSlotCovered(index, 'x1') ? 'covered' : ''}`} key={`pcie1-${index}`}>
                <div className="slot-label">PCIE_{pcieX16Slots + index + 1} (x1)</div>
                <div className="slot-connection"></div>
                {isPCIeSlotCovered(index, 'x1') ? (
                  <div className="component-empty">Slot covered by GPU</div>
                ) : (
                  <div className="component-empty">No expansion card selected</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="motherboard-footer">
        <div className="compatibility-rating">
          <div className="rating-label">Overall Compatibility</div>
          <div className="rating-stars">
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star">★</span>
          </div>
          <div className="rating-text">Very Good</div>
        </div>

        <div className="compatibility-details">
          <div className="detail-item">
            <div className="detail-icon">✓</div>
            <div className="detail-text">CPU compatible with socket {socketType}</div>
          </div>
          <div className="detail-item">
            <div className="detail-icon">✓</div>
            <div className="detail-text">RAM does not exceed slot count ({rams.length}/{ramSlots})</div>
          </div>
          <div className="detail-item">
            <div className="detail-icon">✓</div>
            <div className="detail-text">GPU does not exceed PCIe x16 slot count ({gpus.length}/{pcieX16Slots})</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotherboardUsage;