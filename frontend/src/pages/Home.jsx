import React from 'react';
import ProductList from '../components/ProductList';
import Banner from '../components/Banner';



const Home = () => {
    return (
        <div className="App">
            <Banner />
            <ProductList />
        </div>
    );
};

export default Home;