import React from 'react';

function ProductList() {
    const products = [
        { id: 1, name: 'iPhone 14', price: '$1,000', image: '/assets/images/iphone14.jpg' },
        { id: 2, name: 'Samsung TV 55"', price: '$600', image: '../assets/images/tv.jpg' },
        { id: 3, name: 'MacBook Pro', price: '$1,400', image: '../assets/images/macbook.jpg' },
    ];

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Featured Products</h2>
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={product.image} className="card-img-top" alt={product.name} style={{ height: 'auto', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.price}</p>
                                <button className="btn btn-success">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;