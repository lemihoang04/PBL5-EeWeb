import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = () => {
    const products = [
        { id: 1, name: 'iPhone 6', price: '$200', image: 'https://example.com/iphone6.jpg' },
        { id: 2, name: 'iPhone 7', price: '$300', image: 'https://example.com/iphone7.jpg' },
        { id: 3, name: 'iPhone 8', price: '$400', image: 'https://example.com/iphone8.jpg' },
        { id: 4, name: 'iPhone 9', price: '$500', image: 'https://example.com/iphone9.jpg' },
        { id: 5, name: 'iPhone 10', price: '$600', image: 'https://example.com/iphone10.jpg' },
        { id: 6, name: 'iPhone 11', price: '$700', image: 'https://example.com/iphone11.jpg' },
        { id: 7, name: 'iPhone 12', price: '$800', image: 'https://example.com/iphone12.jpg' },
        { id: 8, name: 'iPhone 13', price: '$900', image: 'https://example.com/iphone13.jpg' },
        { id: 9, name: 'iPhone 14', price: '$1000', image: 'https://example.com/iphone14.jpg' },
        { id: 10, name: 'iPhone 15', price: '$1100', image: 'https://example.com/iphone15.jpg' },
        { id: 11, name: 'iPhone 16', price: '$1200', image: 'https://example.com/iphone16.jpg' }
    ];

    return (
        <div className="home">
            <Header />
            <main>
                <h1>Welcome to Our E-Commerce Store</h1>
                <div className="product-list">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;