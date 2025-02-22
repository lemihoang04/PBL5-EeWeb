import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ProductCard = ({ product }) => {
    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src={product.image} />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.price}</Card.Text>
                <Button variant="primary">Add to Cart</Button>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;