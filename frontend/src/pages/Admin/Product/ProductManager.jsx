import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Dropdown, Card, Badge, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSearch, faPlus, faFilter, faSort, faTags } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductManager.css";
import { fetchAllProducts, deleteProduct, addProduct, updateProduct } from "../../../services/productService";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const PAGE_SIZE = 8; // Products per page for the card layout

const ProductManager = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    imageFiles: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, productId: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState({ field: "title", direction: "asc" });

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

  // Category colors for visual differentiation
  const categoryColors = {
    "Laptop": "primary",
    "CPU": "danger",
    "Mainboard": "success",
    "GPU": "warning",
    "RAM": "info",
    "Storage": "secondary",
    "CPU Cooler": "dark",
    "Case": "light",
    "PSU": "danger"
  };

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

  // Filter products by category and search query
  const filteredProducts = products
    .filter(product => 
      categoryFilter === "All" || 
      (product.category_name && product.category_name.toLowerCase() === categoryFilter.toLowerCase())
    )
    .filter(product =>
      searchQuery === "" || 
      (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const fieldA = a[sortOrder.field] || '';
    const fieldB = b[sortOrder.field] || '';
    
    if (sortOrder.direction === "asc") {
      return typeof fieldA === 'string' ? fieldA.localeCompare(fieldB) : fieldA - fieldB;
    } else {
      return typeof fieldA === 'string' ? fieldB.localeCompare(fieldA) : fieldB - fieldA;
    }
  });

  // Pagination logic after filtering and sorting
  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Reset to page 1 when changing category filter or search query
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);
  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.title || "",
        category: product.category_name || "",
        price: product.price || "",
        stock: product.stock || "",
        image: product.image || "",
        description: product.description || ""
      });
    } else {
      setEditingProduct(null);
      setForm({ name: "", category: "", price: "", stock: "", image: "", description: "" });
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm({ name: "", category: "", price: "", stock: "", image: "", description: "" });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file uploads
    if (name === 'imageFiles' && files && files.length > 0) {
      setForm({ ...form, imageFiles: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (field) => {
    setSortOrder({
      field,
      direction: sortOrder.field === field && sortOrder.direction === "asc" ? "desc" : "asc"
    });
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
      const result = await deleteProduct(productId);
      
      if (result.success) {
        setProducts(products.filter(prod => prod.product_id !== productId));
        
        const remainingProductsInPage = paginatedProducts.filter(prod => prod.product_id !== productId);
        if (remainingProductsInPage.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
        // Show success notification (would be better with a toast)
        alert("Product has been successfully deleted");
      } else {
        alert(result.message || "Unable to delete product. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product. Please try again later.");
    } finally {
      cancelDelete();
    }
  };

  // Function to handle save product (add or edit)
  const handleSaveProduct = async () => {
    try {
      // Create FormData object for API request
      const formData = new FormData();
      
      // Add form fields to FormData
      formData.append('common_title', form.name);
      formData.append('common_price', form.price);
      formData.append('common_stock', form.stock);
      formData.append('category_name', form.category);
      
      if (form.image) {
        formData.append('common_image', form.image);
      }
      
      if (form.description) {
        formData.append('common_description', form.description);
      }
      
      // Add image files if any are selected
      if (form.imageFiles && form.imageFiles.length > 0) {
        form.imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      }
      
      let result;
      
      if (editingProduct) {
        // Update existing product
        result = await updateProduct(editingProduct.product_id, formData);
      } else {
        // Add new product
        result = await addProduct(formData);
      }
      
      if (result.success) {
        toast.success(result.message || 'Đã lưu sản phẩm thành công');
        handleCloseModal();
        loadProducts(); // Refresh product list
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi lưu sản phẩm');
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  const getImageUrl = (product) => {
    if (product.image) {
      const images = product.image.split('; ');
      return images[0];
    }
    return "https://via.placeholder.com/200x150?text=No+Image";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <div className="product-manager">
      <div className="product-dashboard">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Product Management</h1>
            <p>Manage your product inventory, prices, and categories</p>
          </div>          <div className="dashboard-actions">
            <Button variant="outline-primary" className="advanced-add-btn me-2" onClick={() => navigate("/admin/add-product")}>
              <FontAwesomeIcon icon={faPlus} /> Add Product
            </Button>
            {/* <Button variant="success" className="add-product-btn" onClick={() => handleShowModal()}>
              <FontAwesomeIcon icon={faPlus} /> Quick Add
            </Button> */}
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="filter-container">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="search-input"
            />
          </div>

          <div className="filter-options">
            <div className="filter-group">
              <span className="filter-label">
                <FontAwesomeIcon icon={faFilter} /> Filter by:
              </span>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-category">
                  <FontAwesomeIcon icon={faTags} /> {categoryFilter}
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
            </div>

            <div className="filter-group">
              <span className="filter-label">
                <FontAwesomeIcon icon={faSort} /> Sort by:
              </span>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-sort">
                  {sortOrder.field === 'title' ? 'Name' : 
                   sortOrder.field === 'price' ? 'Price' : 
                   sortOrder.field === 'category_name' ? 'Category' : 'Default'}
                  {' '}
                  ({sortOrder.direction === 'asc' ? '↑' : '↓'})
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSort('title')}>Name</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('price')}>Price</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('category_name')}>Category</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-card">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
          <div className="stat-card">
            <h3>{filteredProducts.length}</h3>
            <p>Filtered Results</p>
          </div>
          <div className="stat-card">
            <h3>{categoryFilter === "All" ? "All" : categoryFilter}</h3>
            <p>Selected Category</p>
          </div>
          <div className="stat-card">
            <h3>Page {Math.min(currentPage, totalPages) || 1}/{totalPages || 1}</h3>
            <p>Current Page</p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="products-container">
          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" role="status" variant="primary" />
              <p>Loading products...</p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <Row xs={1} sm={2} md={2} lg={4} className="product-cards-grid">
              {paginatedProducts.map((product) => (
                <Col key={product.product_id} className="product-card-column">
                  <Card className="product-card">
                    <div className="card-img-container">
                      <Card.Img variant="top" src={getImageUrl(product)} className="product-image" />
                    </div>
                    <Card.Body>
                      <Badge 
                        bg={categoryColors[product.category_name] || "info"} 
                        className="category-badge"
                      >
                        {product.category_name || "Uncategorized"}
                      </Badge>
                      <Card.Title className="product-card-title">{product.title}</Card.Title>
                      <Card.Text className="product-card-price">
                        {formatPrice(product.price)}
                      </Card.Text>
                      <div className="card-actions">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="edit-btn"
                          onClick={() => handleShowModal(product)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="delete-btn"
                          onClick={() => showDeleteConfirmation(product.product_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="no-products">
              <div className="no-products-message">
                <h3>No products found</h3>
                <p>Try changing your search criteria or add new products.</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="pagination-container">
            <button 
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
            >
              First
            </button>
            <button 
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}
            
            <button 
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button 
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteConfirmation.show} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
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

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Edit Product" : "Add New Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {productCategories.filter(cat => cat !== "All").map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                  />
                </Form.Group>
              </Col>              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                  />
                </Form.Group>                <Form.Group className="mb-3">
                  <Form.Label>Or Upload New Images</Form.Label>
                  <Form.Control
                    type="file"
                    name="imageFiles"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                  />
                  <Form.Text className="text-muted">
                    You can upload multiple images. Max size: 2MB each.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control                as="textarea"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
              />
            </Form.Group>            {/* File upload is handled in the image section above */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            {editingProduct ? "Save Changes" : "Add Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManager;