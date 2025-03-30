import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ClientRoute from './routers/ClientRouter';
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
<<<<<<< HEAD
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
=======
    <ClientRoute />
>>>>>>> 462fe7d4a79762370932dbf85a7adc3d1b7a427f
  );
}

export default App;
