import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Pagination as BootstrapPagination, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductManager.css";
import { fetchAllProducts, deleteProduct } from "../../../services/productService";

const PAGE_SIZE = 40; // Reduced from 50 to show more pages for testing

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, productId: null }); // State for delete confirmation

  // Define product categories based on your data
  const productCategories = [
    "All", 
    "Laptop", 
    "CPU", 
    "Mainboard", 
    "GPU", 
    "RAM", 
    "Storage", 
    "CPU Cooler", 
    "Case", 
    "PSU"
  ];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProducts();
      console.log("Loaded products:", data.length);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products by category - case insensitive comparison
  const filteredProducts = categoryFilter === "All" 
    ? products 
    : products.filter(product => 
        product.category_name && 
        product.category_name.toLowerCase() === categoryFilter.toLowerCase()
      );

  // Pagination logic after filtering
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when changing category filter
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  const handleShowModal = (product = null) => {
    // ...existing code...
  };

  const handleCloseModal = () => {
    // ...existing code...
  };

  const handleChange = (e) => {
    // ...existing code...
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to show delete confirmation
  const showDeleteConfirmation = (productId) => {
    setDeleteConfirmation({
      show: true,
      productId
    });
  };

  // Function to cancel delete
  const cancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      productId: null
    });
  };

  // Function to handle delete
  const handleDelete = async () => {
    const { productId } = deleteConfirmation;
    if (!productId) return;
    
    try {
      // Use the productService instead of direct axios call
      const result = await deleteProduct(productId);
      
      if (result.success) {
        // Remove product from state if deletion was successful
        setProducts(products.filter(prod => prod.product_id !== productId));
        
        // If the current page becomes empty after deletion, go to previous page
        const remainingProductsInPage = paginatedProducts.filter(prod => prod.product_id !== productId);
        if (remainingProductsInPage.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
        // Show success message
        alert("Product has been successfully deleted");
      } else {
        // Show error message
        alert(result.message || "Unable to delete product. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product. Please try again later.");
    } finally {
      // Close the confirmation modal
      cancelDelete();
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    let items = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    items.push(
      <BootstrapPagination.Item 
        key={1} 
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </BootstrapPagination.Item>
    );

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 2);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 2) {
      startPage = Math.max(2, endPage - maxPagesToShow + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(<BootstrapPagination.Ellipsis key="ellipsis1" disabled />);
    }

    // Add middle pages
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <BootstrapPagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </BootstrapPagination.Item>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(<BootstrapPagination.Ellipsis key="ellipsis2" disabled />);
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <BootstrapPagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </BootstrapPagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="product-manager">
      <div className="product-header">
        <h2 className="product-title">Product Management</h2>
        <div className="product-actions">
          <Dropdown className="category-filter">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-category">
              Category: {categoryFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {productCategories.map(category => (
                <Dropdown.Item 
                  key={category} 
                  onClick={() => setCategoryFilter(category)}
                  active={categoryFilter === category}
                >
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="primary" className="add-product-btn" onClick={() => handleShowModal()}>
            Add Product
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading products...</div>
      ) : (
        <>
          <div className="product-stats">
            {/* <span>Total products: {products.length}</span>
            <span>Products in this category: {filteredProducts.length}</span>
            <span>Showing: {Math.min(filteredProducts.length, paginatedProducts.length)} / {PAGE_SIZE} per page</span> */}
          </div>

          <Table striped bordered hover className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((prod) => (
                  <tr key={prod.product_id}>
                    <td>{prod.title}</td>
                    <td>{prod.category_name}</td>
                    <td className="price-column">{prod.price?.toLocaleString()} $</td>
                    <td className="action-buttons">
                      <Button variant="info" size="sm" onClick={() => handleShowModal(prod)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => showDeleteConfirmation(prod.product_id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No products available</td>
                </tr>
              )}
            </tbody>
          </Table>

          {filteredProducts.length > 0 && (
            <div className="pagination-container">
              <BootstrapPagination>
                <BootstrapPagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <BootstrapPagination.Prev onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
                {renderPaginationItems()}
                <BootstrapPagination.Next onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} />
                <BootstrapPagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </BootstrapPagination>
            </div>
          )}
          
          {/* Delete Confirmation Modal */}
          <Modal show={deleteConfirmation.show} onHide={cancelDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this product? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Product
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ProductManager;