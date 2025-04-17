import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // We'll keep the same CSS filename

const Home = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Sample data - replace with your actual data
    const featuredProducts = [
        {
            id: 1,
            name: "NVIDIA RTX 4080 Super",
            category: "Graphics Cards",
            price: 999.99,
            rating: 4.8,
            image: "https://cdn-icons-png.flaticon.com/128/7414/7414141.png",
            discount: 15
        },
        {
            id: 2,
            name: "AMD Ryzen 9 7950X",
            category: "Processors",
            price: 649.99,
            rating: 4.9,
            image: "https://cdn-icons-png.flaticon.com/128/5974/5974636.png"
        },
        {
            id: 3,
            name: "ROG STRIX Z790-E Gaming",
            category: "Motherboards",
            price: 499.99,
            rating: 4.7,
            image: "https://cdn-icons-png.flaticon.com/128/4275/4275113.png",
            discount: 10
        },
        {
            id: 4,
            name: "Corsair 32GB DDR5-6000",
            category: "Memory",
            price: 249.99,
            rating: 4.8,
            image: "https://cdn-icons-png.flaticon.com/128/4275/4275113.png"
        }
    ];

    const categories = [
        {
            id: 1,
            name: "Graphics Cards",
            icon: "fa-microchip",
            route: "/components/gpu"
        },
        {
            id: 2,
            name: "Processors",
            icon: "fa-server",
            route: "/components/cpu"
        },
        {
            id: 3,
            name: "Motherboards",
            icon: "fa-puzzle-piece",
            route: "/components/mainboard"
        },
        {
            id: 4,
            name: "Memory",
            icon: "fa-memory",
            route: "/components/ram"
        },
        {
            id: 5,
            name: "Storage",
            icon: "fa-hdd",
            route: "/components/storage"
        },
        {
            id: 6,
            name: "Cases",
            icon: "fa-desktop",
            route: "/components/case"
        },
        {
            id: 7,
            name: "Power Supplies",
            icon: "fa-plug",
            route: "/components/psu"
        },
        {
            id: 8,
            name: "Cooling",
            icon: "fa-fan",
            route: "/components/cpu cooler"
        }
    ];

    const banners = [
        {
            id: 1,
            title: "Next-Gen Gaming PCs",
            subtitle: "Power your gaming experience with the latest technology",
            cta: "Build Your PC",
            image: "https://goscreenworks.com/wp-content/uploads/2022/08/ella-don-JomkRNkzKhE-unsplash.jpg",
            route: "/build"
        },
        {
            id: 2,
            title: "Premium Components",
            subtitle: "High-performance parts for your custom builds",
            cta: "Shop Components",
            image: "https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-01/s9-u05-03-overhead-pc-components-original-rwd.jpg.rendition.intel.web.1648.927.jpg",
            route: "/components/gpu"
        },
        {
            id: 3,
            title: "Gaming Laptops",
            subtitle: "Portable power for gamers on the go",
            cta: "View Laptops",
            image: "https://i.dell.com/sites/csimages/App-Merchandizing_Images/all/1537_US_LP_G_Series_LOB_Banner_2800x839.jpg",
            route: "/laptops"
        }
    ];

    const specialDeals = [
        {
            id: 1,
            title: "Build & Save",
            description: "Save up to 15% when you build a complete system",
            icon: "fa-tools",
            route: "/build"
        },
        {
            id: 2,
            title: "Free Shipping",
            description: "On all orders over $99",
            icon: "fa-truck-fast",
            route: "/shipping"
        },
        {
            id: 3,
            title: "PC Builder",
            description: "Create your custom build with our easy-to-use tool",
            icon: "fa-screwdriver-wrench",
            route: "/build"
        },
        {
            id: 4,
            title: "Tech Support",
            description: "Free expert support with every purchase",
            icon: "fa-headset",
            route: "/support"
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: "Jason R.",
            comment: "The PC builder tool made it so easy to create my dream gaming rig. Excellent prices and fast shipping!",
            rating: 5
        },
        {
            id: 2,
            name: "Michelle K.",
            comment: "TechShop has the best selection of components. Their customer service team was super helpful with my questions.",
            rating: 5
        },
        {
            id: 3,
            name: "David L.",
            comment: "I've built three PCs using parts from TechShop. Quality products and competitive prices keep me coming back.",
            rating: 4
        }
    ];

    // Automatic slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    // Handle slide navigation
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Rating stars component
    const RatingStars = ({ rating }) => {
        return (
            <div className="techshop-rating">
                {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.floor(rating) ? 'techshop-rating__star--filled' : 'techshop-rating__star--empty'}`}></i>
                ))}
                <span className="techshop-rating__number">{rating}</span>
            </div>
        );
    };

    return (
        <div className="techshop">
            {/* Hero Banner Slider */}
            <section className="techshop-hero">
                <div className="techshop-hero__container">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`techshop-hero__slide ${index === currentSlide ? 'techshop-hero__slide--active' : ''}`}
                            style={{ backgroundImage: `url(${banner.image})` }}
                        >
                            <div className="techshop-hero__content">
                                <h1 className="techshop-hero__title">{banner.title}</h1>
                                <p className="techshop-hero__subtitle">{banner.subtitle}</p>
                                <button
                                    className="techshop-hero__button"
                                    onClick={() => navigate(banner.route)}
                                >
                                    {banner.cta}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="techshop-hero__controls">
                        <div className="techshop-hero__dots">
                            {banners.map((_, index) => (
                                <span
                                    key={index}
                                    className={`techshop-hero__dot ${index === currentSlide ? 'techshop-hero__dot--active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                ></span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Deals Section */}
            <section className="techshop-deals">
                <div className="techshop-deals__container">
                    {specialDeals.map(deal => (
                        <div
                            key={deal.id}
                            className="techshop-deals__card"
                            onClick={() => navigate(deal.route)}
                        >
                            <div className="techshop-deals__icon">
                                <i className={`fas ${deal.icon}`}></i>
                            </div>
                            <div className="techshop-deals__info">
                                <h3 className="techshop-deals__title">{deal.title}</h3>
                                <p className="techshop-deals__description">{deal.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="techshop-products">
                <div className="techshop-section__header">
                    <h2 className="techshop-section__title">Featured Products</h2>
                    <button className="techshop-section__view-all" onClick={() => navigate('/products')}>
                        View All <i className="fas fa-arrow-right"></i>
                    </button>
                </div>

                <div className="techshop-products__grid">
                    {featuredProducts.map(product => (
                        <div
                            key={product.id}
                            className="techshop-product"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            {product.discount && (
                                <div className="techshop-product__discount-badge">-{product.discount}%</div>
                            )}
                            <div className="techshop-product__image-container">
                                <img src={product.image} alt={product.name} className="techshop-product__image" />
                            </div>
                            <div className="techshop-product__info">
                                <span className="techshop-product__category">{product.category}</span>
                                <h3 className="techshop-product__name">{product.name}</h3>
                                <RatingStars rating={product.rating} />
                                <div className="techshop-product__price">
                                    {product.discount ? (
                                        <>
                                            <span className="techshop-product__price--current">
                                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                            </span>
                                            <span className="techshop-product__price--original">${product.price.toFixed(2)}</span>
                                        </>
                                    ) : (
                                        <span className="techshop-product__price--current">${product.price.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                            <button className="techshop-product__button">
                                <i className="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* PC Builder Banner */}
            <section className="techshop-builder-banner">
                <div className="techshop-builder-banner__content">
                    <div className="techshop-builder-banner__text">
                        <h2 className="techshop-builder-banner__title">Build Your Dream PC</h2>
                        <p className="techshop-builder-banner__description">Our PC Builder tool makes it easy to create a custom computer that perfectly matches your needs and budget.</p>
                        <button className="techshop-builder-banner__button" onClick={() => navigate('/build')}>
                            Start Building <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    <div className="techshop-builder-banner__image-container">
                        <img src="/api/placeholder/600/400" alt="PC Builder" className="techshop-builder-banner__image" />
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="techshop-categories">
                <div className="techshop-section__header">
                    <h2 className="techshop-section__title">Shop by Category</h2>
                </div>

                <div className="techshop-categories__grid">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="techshop-category"
                            onClick={() => navigate(category.route)}
                        >
                            <div className="techshop-category__icon">
                                <i className={`fas ${category.icon}`}></i>
                            </div>
                            <h3 className="techshop-category__name">{category.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="techshop-testimonials">
                <div className="techshop-section__header">
                    <h2 className="techshop-section__title">What Our Customers Say</h2>
                </div>

                <div className="techshop-testimonials__container">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="techshop-testimonial">
                            <div className="techshop-testimonial__rating">
                                {[...Array(5)].map((_, i) => (
                                    <i
                                        key={i}
                                        className={`fas fa-star ${i < testimonial.rating ? 'techshop-testimonial__star--filled' : 'techshop-testimonial__star--empty'}`}
                                    ></i>
                                ))}
                            </div>
                            <p className="techshop-testimonial__comment">"{testimonial.comment}"</p>
                            <p className="techshop-testimonial__author">- {testimonial.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="techshop-newsletter">
                <div className="techshop-newsletter__content">
                    <h2 className="techshop-newsletter__title">Stay Updated with TechShop</h2>
                    <p className="techshop-newsletter__description">Subscribe to our newsletter for exclusive deals, new product alerts, and tech tips.</p>
                    <div className="techshop-newsletter__form">
                        <input type="email" placeholder="Your email address" className="techshop-newsletter__input" />
                        <button className="techshop-newsletter__button">Subscribe</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;