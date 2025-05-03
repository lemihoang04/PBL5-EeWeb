import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductManager.css";
import { fetchAllProducts } from "../../../services/productService";

const PAGE_SIZE = 50;

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchAllProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const handleShowModal = (product = null) => {
    setEditingProduct(product);
    setForm(
      product
        ? {
            name: product.title || "",
            category: product.category_name || "",
            price: product.price || "",
            stock: product.stock || "",
          }
        : { name: "", category: "", price: "", stock: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm({ name: "", category: "", price: "", stock: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="product-manager">
      <div className="product-header">
        <h2 className="product-title">Quản lý sản phẩm</h2>
        <Button variant="primary" className="add-product-btn" onClick={() => handleShowModal()}>
          Thêm sản phẩm
        </Button>
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
          {paginatedProducts.map((prod) => (
            <tr key={prod.product_id}>
              <td>{prod.title}</td>
              <td>{prod.category_name}</td>
              <td className="price-column">{prod.price?.toLocaleString()} $</td>
              <td className="action-buttons">
                <Button variant="info" size="sm" onClick={() => handleShowModal(prod)}>
                  Sửa
                </Button>
                <Button variant="primary" size="sm" onClick={() => {/* handleDelete(prod.product_id) */}}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {(() => {
          let start = 1;
          let end = totalPages;
          if (totalPages > 6) {
            if (currentPage <= 3) {
              start = 1;
              end = 6;
            } else if (currentPage >= totalPages - 2) {
              start = totalPages - 5;
              end = totalPages;
            } else {
              start = currentPage - 2;
              end = currentPage + 3;
            }
          }
          return Array.from({ length: Math.min(6, totalPages) }, (_, idx) => {
            const page = start + idx;
            if (page > totalPages || page < 1) return null;
            return (
              <Pagination.Item
                key={page}
                active={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Pagination.Item>
            );
          });
        })()}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Danh mục</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => {/* handleSave() */}}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManager;