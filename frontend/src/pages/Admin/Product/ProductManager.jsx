import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Pagination as BootstrapPagination, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductManager.css";
import { fetchAllProducts } from "../../../services/productService";

const PAGE_SIZE = 40; // Reduced from 50 to show more pages for testing

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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
        <h2 className="product-title">Quản lý sản phẩm</h2>
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
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">Đang tải sản phẩm...</div>
      ) : (
        <>
          <div className="product-stats">
            {/* <span>Tổng số sản phẩm: {products.length}</span>
            <span>Sản phẩm trong danh mục này: {filteredProducts.length}</span>
            <span>Hiển thị: {Math.min(filteredProducts.length, paginatedProducts.length)} / {PAGE_SIZE} mỗi trang</span> */}
          </div>

          <Table striped bordered hover className="product-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Hành động</th>
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
                        Sửa
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => {/* handleDelete(prod.product_id) */}}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">Không có sản phẩm nào</td>
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
        </>
      )}
      
      {/* Add CSS for the pagination container */}
    </div>
  );
};

export default ProductManager;