import React from 'react';
import Gaming from '../assets/images/gaminglaptop.jpg';
import Business from '../assets/images/businesslaptop.jpg';
import Budget from '../assets/images/budgetlaptop.jpg';
function ProductList() {
    const products = [
        { id: 1, name: 'Business Laptop', price: '$400', image: Business },
        { id: 2, name: 'Gaming Laptop', price: '$600', image: Gaming },
        { id: 3, name: 'Student & Budget Laptops', price: '$100', image: Budget },
    ];

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Featured Products</h2>
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={product.image} className="card-img-top" alt={product.name} style={{ height: '300px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <strong>
                                    Price only from</strong>
                                <p className="card-text">{product.price}</p>
                                <button className="btn btn-success">See more</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;