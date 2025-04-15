import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCPUs } from '../../services/cpuServiec';
import './CPUSearch.css';

const CPUSearch = () => {
  const [cpus, setCPUs] = useState([]);
  const [filteredCPUs, setFilteredCPUs] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 3235]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCPUs = filteredCPUs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCPUs.length / itemsPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCPUs = async () => {
      const data = await fetchCPUs();
      setCPUs(data);
      setFilteredCPUs(data);
    };
    loadCPUs();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = cpus.filter(cpu => cpu.title.toLowerCase().includes(term));
    setFilteredCPUs(filtered);
  };

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="cpu-search-container">
      <div className="sidebar">
        <div className="filter-section">
          <h3>Price</h3>
          <div className="price-label">${priceRange[0]} - ${priceRange[1].toLocaleString()}</div>
          <div className="price-slider">
            <input type="range" min="0" max="3235" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])} />
            <input type="range" min="0" max="3235" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} />
          </div>
        </div>

        <div className="filter-section">
          <h3>Series</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> AMD Ryzen 3</label>
            <label><input type="checkbox" /> AMD Ryzen 7</label>
            <label><input type="checkbox" /> Intel Core Ultra 5</label>
            <label><input type="checkbox" /> Intel Core Ultra 7</label>
            <label><input type="checkbox" /> Intel Core Ultra 9</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Microarchitecture</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Zen 4</label>
            <label><input type="checkbox" /> Zen 5</label>
            <label><input type="checkbox" /> Alder Lake</label>
            <label><input type="checkbox" /> Arrow Lake</label>
            <label><input type="checkbox" /> Raptor Lake</label>
            <label><input type="checkbox" /> Raptor Lake Refresh</label>
            <label><input type="checkbox" /> Rocket Lake</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Core Family</h3>
          <div className="checkbox-group">
            {['Cezanne', 'Matisse', 'Phoenix 1', 'Phoenix 2', 'Raphael', 'Raven Ridge', 'Renoir', 'Renoir-X', 'Vermeer', 'Vermeer-X', 'Arrow Lake', 'Coffee Lake', 'Coffee Lake Refresh', 'Kaby Lake-S', 'Kaby Lake-X', 'Rocket Lake-S', 'Skylake-X'].map(family => (
              <label key={family}><input type="checkbox" /> {family}</label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Socket</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> AM4</label>
            <label><input type="checkbox" /> AM5</label>
            <label><input type="checkbox" /> LGA1200</label>
            <label><input type="checkbox" /> LGA1700</label>
            <label><input type="checkbox" /> LGA1851</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Integrated Graphics</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Intel UHD Graphics 630</label>
            <label><input type="checkbox" /> Intel UHD Graphics 770</label>
            <label><input type="checkbox" /> Intel Xe</label>
            <label><input type="checkbox" /> Radeon</label>
            <label><input type="checkbox" /> None</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>SMT</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Yes</label>
            <label><input type="checkbox" /> No</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>ECC Support</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Yes</label>
            <label><input type="checkbox" /> No</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Includes Cooler</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" /> Yes</label>
            <label><input type="checkbox" /> No</label>
          </div>
        </div>

      </div>

      <div className="results-container">
        <div className="search-bar">
          <input type="text" placeholder="Search for CPUs..." onChange={handleSearch} />
        </div>

        <div className="cpu-listings">
          {currentCPUs.map(cpu => (
            <div className="cpu-item" key={cpu.id}>
              <img src={cpu.image || 'default-cpu.jpg'} alt={cpu.title} />
              <h3 onClick={() => navigate(`/product-info/${cpu.id}`)}>{cpu.title}</h3>{/*Chưa chỉnh sửa */}
              <p>${cpu.price.toFixed(2)}</p>
              <p>{cpu.coreCount} cores / {cpu.threadCount} threads</p>
              <p>{cpu.socket}</p>
              <button>Add to cart</button>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default CPUSearch;