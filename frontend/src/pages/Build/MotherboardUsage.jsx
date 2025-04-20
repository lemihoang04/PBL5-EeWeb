import React from 'react';
import './MotherboardUsage.css';

const MotherboardUsage = () => {
  return (
    <div className="motherboard-usage">
      <h2>Motherboard Usage</h2>
      
      <div className="motherboard-header">
        <div className="mb-image-container">
          <img src="/images/motherboard.png" alt="Motherboard" className="mb-image" />
        </div>
        <div className="mb-title">MSI B650 GAMING PLUS WIFI ATX AM5</div>
      </div>
      
      <div className="mb-layout">
        <div className="mb-section">
          <div className="section-header">CPU Sockets</div>
          <div className="section-content">
            <div className="socket-item">
              <div className="socket-label">CPU_1 (AM5)</div>
              <div className="socket-connection"></div>
              <div className="component-item">
                <img src="/images/cpu.png" alt="CPU" className="component-image" />
                <div className="component-name">AMD Ryzen 5 7600X 4.7 GHz 6-Core (CPU)</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-section">
          <div className="section-header">Memory Slots</div>
          <div className="section-content">
            <div className="memory-item">
              <div className="memory-label">RAM_1 (288-pin DIMM)</div>
              <div className="memory-connection"></div>
              <div className="component-item">
                <img src="/images/ram.png" alt="RAM" className="component-image" />
                <div className="component-name">Corsair Vengeance 32 GB (2 x 16 GB) DDR5-6000 CL30 1/2 (RAM)</div>
              </div>
            </div>
            
            <div className="memory-item">
              <div className="memory-label">RAM_2 (288-pin DIMM)</div>
              <div className="memory-connection"></div>
              <div className="component-item">
                <img src="/images/ram.png" alt="RAM" className="component-image" />
                <div className="component-name">Corsair Vengeance 32 GB (2 x 16 GB) DDR5-6000 CL30 2/2 (RAM)</div>
              </div>
            </div>
            
            <div className="memory-item">
              <div className="memory-label">RAM_3 (288-pin DIMM)</div>
            </div>
            
            <div className="memory-item">
              <div className="memory-label">RAM_4 (288-pin DIMM)</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-note">* Refer to the motherboard manual to determine which specific memory slots to use.</div>
      
      <div className="mb-layout">
        <div className="mb-section">
          <div className="section-header">M.2 Slots</div>
          <div className="section-content">
            <div className="slot-item">
              <div className="slot-label">M2_1 (M)</div>
              <div className="slot-connection"></div>
              <div className="component-item">
                <img src="/images/m2.png" alt="M.2 SSD" className="component-image" />
                <div className="component-name">Crucial P3 Plus 2 TB M.2-2280 PCIe 4.0 X4 NVME SSD (M.2 NVMe)</div>
              </div>
            </div>
            
            <div className="slot-item">
              <div className="slot-label">M2_2 (M)</div>
            </div>
          </div>
        </div>
        
        <div className="mb-section">
          <div className="section-header">Expansion Slots</div>
          <div className="section-content">
            <div className="slot-item">
              <div className="slot-label">PCIE_1 (x16)</div>
              <div className="slot-connection"></div>
              <div className="component-item">
                <img src="/images/gpu.png" alt="GPU" className="component-image" />
                <div className="component-name">ASRock Challenger D Radeon RX 6600 8 GB (PCIe x16)</div>
              </div>
            </div>
            
            <div className="slot-item covered">
              <div className="slot-label">Covered</div>
            </div>
            
            <div className="slot-item">
              <div className="slot-label">PCIE_2 (x1)</div>
            </div>
            
            <div className="slot-item">
              <div className="slot-label">PCIE_3 (x16 @x4)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotherboardUsage;