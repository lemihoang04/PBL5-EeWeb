import React, { useState, useContext } from 'react';
import './HeaderNew.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserProvider";
import { LogOutUser } from "../../services/userService";
import { toast } from "react-toastify";

const Header = () => {
  const { user, logoutUser } = useContext(UserContext);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      let data = await LogOutUser();
      logoutUser();
      if (data && data.errCode === 0) {
        navigate("/");
        toast.success("Log out success");
      } else {
        toast.error("Log out failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="header-container">
      <div className="main-header">
        <div className="header-items">
          <div className="header-item" onClick={() => navigate('/home')}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/5974/5974636.png"
              alt="Builder Icon"
              className="icon"
              width="25"
              height="25"
            />
            <span>Home</span>
          </div>
          <div className="header-item" onClick={() => navigate('/build')}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/7414/7414141.png"
              alt="Builder Icon"
              className="icon"
              width="25"
              height="25"
            />
            <span>Builder</span>
          </div>
          <div
            className={`header-item ${isProductsOpen ? 'active' : ''}`}
            onClick={toggleProducts}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/4275/4275113.png"
              alt="Builder Icon"
              className="icon"
              width="25"
              height="25"
            />
            <span>Components</span>
            <span className={`arrow ${isProductsOpen ? 'up' : 'down'}`}>▼</span>
          </div>
          <div className="header-item" onClick={() => navigate('/laptops')}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/4639/4639905.png"
              alt="Builder Icon"
              className="icon"
              width="25"
              height="25"
            />
            <span>Laptop</span>
          </div>
          <div className="header-item">
            <img
              src="https://cdn-icons-png.flaticon.com/128/4961/4961759.png"
              alt="Builder Icon"
              className="icon"
              width="25"
              height="25"
            />
            <span>Support</span>
          </div>

          <div className="right-items">
            {user && user.isAuthenticated ? (
              <div className="right-items">
                <div className="header-item" onClick={() => navigate('/cart')}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/891/891407.png"
                    alt="Cart Icon"
                    className="icon"
                    width="25"
                    height="25"
                  />
                  <span>Cart</span>
                </div>

                <div className="header-item dropdown" onClick={() => toggleDropdown()}>
                  <div className="dropdown-toggle" id="userDropdown" aria-expanded="false">
                    <span>Welcome, {user.account.name}</span>
                  </div>
                  <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="userDropdown">
                    <li>
                      <button className="dropdown-item" onClick={() => navigate('/profile')}>
                        Account
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate('/orders')}>
                        Orders
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>

              </div>
            ) : (
              <div className="header-item" onClick={() => navigate('/login')}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/17446/17446833.png"
                  alt="Login Icon"
                  className="icon"
                  width="25"
                  height="25"
                />
                <span>Login</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {
        isProductsOpen && (
          <div className="categories-container">
            <div className="categories-row">
              <div className="categories-column">
                <div className="category-section">
                  <div className="main-items">
                    <div className="main-item">
                      <img src="https://cdna.pcpartpicker.com/static/forever/img/nav-cpu-2023.png" alt="CPU" className="category-image" />
                      <span>CPUs</span>
                    </div>
                    <div className="main-item">
                      <img src="//cdna.pcpartpicker.com/static/forever/img/nav-cpucooler-2023.png" alt="CPU Cooler" className="category-image" />
                      <span>CPU Coolers</span>
                    </div>
                    <div className="main-item">
                      <img src="//cdna.pcpartpicker.com/static/forever/img/nav-motherboard-2023.png" alt="Motherboard" className="category-image" />
                      <span>Motherboards</span>
                    </div>
                    <div className="main-item">
                      <img src="//cdna.pcpartpicker.com/static/forever/img/nav-memory-2023.png" alt="Memory" className="category-image" />
                      <span>Memory</span>
                    </div>
                  </div>
                </div>

                <div className="category-section">
                  <div className="main-items">
                    <div className="main-item">
                      <img src="//cdna.pcpartpicker.com/static/forever/img/nav-ssd-2023.png" alt="Storage" className="category-image" />
                      <span>Storage</span>
                    </div>
                    <div className="main-item">
                      <img src="//cdna.pcpartpicker.com/static/forever/img/nav-videocard-2023.png" alt="Video Card" className="category-image" />
                      <span>Video Card</span>
                    </div>
                    <div className="main-item">
                      <img src="//cdna.pcpartpicker.com/static/forever/img/nav-powersupply-2023.png" alt="Power Supplies" className="category-image" />
                      <span>Power Supplies</span>
                    </div>
                    <div className="main-item">
                      <img src="//cdna.pcpartpicker.com/static/forever/img/nav-case-2023.png" alt="Cases" className="category-image" />
                      <span>Cases</span>
                    </div>

                  </div>
                </div>
              </div>

              <div className="categories-column">
                <div className="category-list-section">
                  <h3>Peripherals</h3>
                  <ul>
                    <li>Headphones</li>
                    <li>Keyboards</li>
                    <li>Mice</li>
                    <li>Speakers</li>
                    <li>Webcams</li>
                  </ul>

                  <h3>Displays</h3>
                  <ul>
                    <li>Monitors</li>
                  </ul>

                  <h3>Software</h3>
                  <ul>
                    <li>Operating Systems</li>
                  </ul>
                </div>
              </div>

              <div className="categories-column">
                <div className="category-list-section">
                  <h3>Expansion</h3>
                  <ul>
                    <li>Sound Cards</li>
                    <li>Wired Networking</li>
                    <li>Wireless Networking</li>
                  </ul>

                  <h3>Accessories / Other</h3>
                  <ul>
                    <li>Case Fans</li>
                    <li>Fan Controllers</li>
                    <li>Thermal Compound</li>
                    <li>External Hard Drives</li>
                    <li>Optical Drives</li>
                    <li>Uninterruptible Power Supplies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Header;