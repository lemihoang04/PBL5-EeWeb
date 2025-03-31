import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import Banner from '../components/Banner';



const Home = () => {
    return (
        <div className="App">
            <Header />
            <Banner />
            <ProductList />
            <Footer />
        </div>
    );
};

export default Home;