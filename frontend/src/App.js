import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ClientRoute from './routers/ClientRouter';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (


    <ClientRoute />


  );
}

export default App;
