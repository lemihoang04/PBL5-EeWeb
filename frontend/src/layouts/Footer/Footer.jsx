import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="tech-footer">
            <div className="tech-footer__container">
                <div className="tech-footer__main">
                    <div className="tech-footer__company">
                        <h3 className="tech-footer__title">TechShop</h3>
                        <p className="tech-footer__text">Your trusted technology partner since 2020</p>
                    </div>
                    
                    <div className="tech-footer__links">
                        <div className="tech-footer__section">
                            <h4 className="tech-footer__heading">Products</h4>
                            <ul className="tech-footer__list">
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Laptops</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Smartphones</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Accessories</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Build PC</a></li>
                            </ul>
                        </div>
                        
                        <div className="tech-footer__section">
                            <h4 className="tech-footer__heading">Support</h4>
                            <ul className="tech-footer__list">
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">FAQ</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Warranty</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Returns</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Contact</a></li>
                            </ul>
                        </div>
                        
                        <div className="tech-footer__section">
                            <h4 className="tech-footer__heading">Company</h4>
                            <ul className="tech-footer__list">
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">About Us</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Careers</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">News</a></li>
                                <li className="tech-footer__item"><a href="#" className="tech-footer__link">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="tech-footer__contact">
                        <h4 className="tech-footer__heading">Contact Us</h4>
                        <p className="tech-footer__contact-item">
                            <span className="tech-footer__contact-icon">📍</span>
                            123 Electronics Road, HCMC
                        </p>
                        <p className="tech-footer__contact-item">
                            <span className="tech-footer__contact-icon">✉️</span>
                            support@techshop.com
                        </p>
                        <p className="tech-footer__contact-item">
                            <span className="tech-footer__contact-icon">📞</span>
                            +1 123 456 7890
                        </p>
                        <div className="tech-footer__social">
                            <a href="#" className="tech-footer__social-link">FB</a>
                            <a href="#" className="tech-footer__social-link">IG</a>
                            <a href="#" className="tech-footer__social-link">TW</a>
                            <a href="#" className="tech-footer__social-link">YT</a>
                        </div>
                    </div>
                </div>
                
                <div className="tech-footer__bottom">
                    <p className="tech-footer__copyright">© 2025 TechShop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;