import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

const Footer = () => {
    return (
        <Navbar bg="dark" variant="dark" fixed="bottom">
            <Container className="justify-content-center">
                <Navbar.Text>&copy; 2023 E-Commerce. All rights reserved.</Navbar.Text>
            </Container>
        </Navbar>
    );
};

export default Footer;