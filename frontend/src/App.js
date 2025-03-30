import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import Login from './components/Login';
import ProductInfo from './pages/ProductInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContextProvider from './context/AppContext';

function App() {
  return (
    <AppContextProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Banner />
                  <ProductList />
                </>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/product-info/:productId" element={<ProductInfo />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AppContextProvider>
  );
}

export default App;
