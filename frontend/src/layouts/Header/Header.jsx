import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserProvider";
import { LogOutUser } from "../../services/userService";
import { toast } from "react-toastify";
import './Header.css';

const Header = () => {
  const { user, logoutUser } = useContext(UserContext);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // State to store cart count
  const productsRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {

    if (user && user.account) {
      setCartCount(user.account.cart_items_count || 0);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsRef.current && !productsRef.current.contains(event.target) && !event.target.closest('.categories-container')) {
        setIsProductsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('.dropdown-menu')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
        <div className="logo-container" onClick={() => navigate('/home')}>
          <div className="logo">
            <span className="logo-text">TECH<span className="logo-highlight">SHOP</span></span>
          </div>
        </div>

        <div className="nav-container">
          <div className="nav-item" onClick={() => navigate('/home')}>
            <i className="nav-icon fas fa-home"></i>
            <span>Home</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/build')}>
            <i className="nav-icon fas fa-tools"></i>
            <span>Builder</span>
          </div>
          <div
            className={`nav-item ${isProductsOpen ? 'active' : ''}`}
            onClick={toggleProducts}
            ref={productsRef}
          >
            <i className="nav-icon fas fa-microchip"></i>
            <span>Components</span>
            <i className={`nav-arrow fas fa-chevron-${isProductsOpen ? 'up' : 'down'}`}></i>
          </div>
          <div className="nav-item" onClick={() => navigate('/laptops')}>
            <i className="nav-icon fas fa-laptop"></i>
            <span>Laptops</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/support')}>
            <i className="nav-icon fas fa-headset"></i>
            <span>Support</span>
          </div>
        </div>

        <div className="user-actions">
          {user && user.isAuthenticated ? (
            <>
              <div className="action-item cart-icon" onClick={() => navigate('/cart')}>
                <i className="fas fa-shopping-cart"></i>
                <span className="cart-badge">{cartCount}</span> {/* Display the cart count */}
              </div>
              <div
                className="action-item user-dropdown"
                onClick={toggleDropdown}
                ref={dropdownRef}
              >
                <div className="user-avatar">
                  <span>{user.account.name.split(' ').slice(-1)[0].charAt(0).toUpperCase()}</span>
                </div>
                <span className="user-name">Hi, {user.account.name.split(' ').slice(-1)[0]}</span>
                <i className={`dropdown-arrow fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>

                <div className={`user-menu ${isDropdownOpen ? 'show' : ''}`}>
                  <div className="menu-header">
                    <span className="welcome-text">Welcome,</span>
                    <span className="user-fullname">{user.account.name}</span>
                  </div>
                  <div className="menu-items">
                    <div className="menu-item" onClick={() => navigate('/profile')}>
                      <i className="fas fa-user"></i>
                      <span>My Account</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate('/orders')}>
                      <i className="fas fa-box"></i>
                      <span>My Orders</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate('/wishlist')}>
                      <i className="fas fa-heart"></i>
                      <span>Wishlist</span>
                    </div>
                    <div className="menu-divider"></div>
                    <div className="menu-item logout" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="action-item login-btn" onClick={() => navigate('/login')}>
              <i className="fas fa-user"></i>
              <span>Login</span>
            </div>
          )}
        </div>
      </div>

      {isProductsOpen && (
        <div className="categories-container">
          <div className="categories-content">
            <div className="categories-column featured">
              <h3 className="column-title">Featured Components</h3>
              <div className="featured-grid">
                <div className="featured-item" onClick={() => { navigate('/components/cpu'); setIsProductsOpen(false); }}>
                  <div className="featured-img-container">
                    <img src="https://cdna.pcpartpicker.com/static/forever/img/nav-cpu-2023.png" alt="CPU" />
                  </div>
                  <span>CPUs</span>
                </div>
                <div className="featured-item" onClick={() => { navigate('/components/cpu cooler'); setIsProductsOpen(false); }}>
                  <div className="featured-img-container">
                    <img src="//cdna.pcpartpicker.com/static/forever/img/nav-cpucooler-2023.png" alt="CPU Cooler" />
                  </div>
                  <span>CPU Coolers</span>
                </div>
                <div className="featured-item" onClick={() => { navigate('/components/mainboard'); setIsProductsOpen(false); }}>
                  <div className="featured-img-container">
                    <img src="//cdna.pcpartpicker.com/static/forever/img/nav-motherboard-2023.png" alt="Motherboard" />
                  </div>
                  <span>Motherboards</span>
                </div>
                <div className="featured-item" onClick={() => { navigate('/components/ram'); setIsProductsOpen(false); }}>
                  <div className="featured-img-container">
                    <img src="//cdna.pcpartpicker.com/static/forever/img/nav-memory-2023.png" alt="Memory" />
                  </div>
                  <span>Memory</span>
                </div>
                <div className="featured-item" onClick={() => { navigate('/components/storage'); setIsProductsOpen(false); }}>
                  <div className="featured-img-container">
                    <img src="//cdna.pcpartpicker.com/static/forever/img/nav-ssd-2023.png" alt="Storage" />
                  </div>
                  <span>Storage</span>
                </div>
                <div className="featured-item" onClick={() => { navigate('/components/gpu'); setIsProductsOpen(false); }}>
                  <div className="featured-img-container">
                    <img src="//cdna.pcpartpicker.com/static/forever/img/nav-videocard-2023.png" alt="Video Card" />
                  </div>
                  <span>Video Cards</span>
                </div>
                <div className="featured-item" onClick={() => { navigate('/components/psu'); setIsProductsOpen(false); }}>
                  <div className="featured-img-container">
                    <img src="//cdna.pcpartpicker.com/static/forever/img/nav-powersupply-2023.png" alt="Power Supply" />
                  </div>
                  <span>Power Supplies</span>
                </div>
                <div className="featured-item" onClick={() => { navigate('/components/case'); setIsProductsOpen(false); }}>
                  <div className="featured-img-container">
                    <img src="//cdna.pcpartpicker.com/static/forever/img/nav-case-2023.png" alt="Case" />
                  </div>
                  <span>Cases</span>
                </div>
              </div>
            </div>

            <div className="categories-column lists">
              <div className="category-list">
                <h3 className="list-title">Peripherals</h3>
                <ul>
                  <li onClick={() => { navigate('/components/headphones'); setIsProductsOpen(false); }}>Headphones</li>
                  <li onClick={() => { navigate('/components/keyboards'); setIsProductsOpen(false); }}>Keyboards</li>
                  <li onClick={() => { navigate('/components/mice'); setIsProductsOpen(false); }}>Mice</li>
                  <li onClick={() => { navigate('/components/speakers'); setIsProductsOpen(false); }}>Speakers</li>
                  <li onClick={() => { navigate('/components/webcams'); setIsProductsOpen(false); }}>Webcams</li>
                </ul>
              </div>

              <div className="category-list">
                <h3 className="list-title">Displays</h3>
                <ul>
                  <li onClick={() => { navigate('/components/monitors'); setIsProductsOpen(false); }}>Monitors</li>
                </ul>
              </div>
            </div>

            <div className="categories-column lists">
              <div className="category-list">
                <h3 className="list-title">Expansion</h3>
                <ul>
                  <li onClick={() => { navigate('/components/sound-cards'); setIsProductsOpen(false); }}>Sound Cards</li>
                  <li onClick={() => { navigate('/components/networking'); setIsProductsOpen(false); }}>Wired Networking</li>
                  <li onClick={() => { navigate('/components/wireless'); setIsProductsOpen(false); }}>Wireless Networking</li>
                </ul>
              </div>

              <div className="category-list">
                <h3 className="list-title">Accessories</h3>
                <ul>
                  <li onClick={() => { navigate('/components/fans'); setIsProductsOpen(false); }}>Case Fans</li>
                  <li onClick={() => { navigate('/components/controllers'); setIsProductsOpen(false); }}>Fan Controllers</li>
                  <li onClick={() => { navigate('/components/thermal'); setIsProductsOpen(false); }}>Thermal Compound</li>
                  <li onClick={() => { navigate('/components/external'); setIsProductsOpen(false); }}>External Drives</li>
                </ul>
              </div>

              <div className="category-list">
                <h3 className="list-title">Software</h3>
                <ul>
                  <li onClick={() => { navigate('/components/os'); setIsProductsOpen(false); }}>Operating Systems</li>
                </ul>
              </div>
            </div>

            <div className="categories-column promo">
              <div className="promo-card">
                <div className="promo-content">
                  <h3>Build Your Dream PC</h3>
                  <p>Create a custom build with our easy-to-use PC Builder</p>
                  <button className="promo-btn" onClick={() => { navigate('/build'); setIsProductsOpen(false); }}>
                    Start Building
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;