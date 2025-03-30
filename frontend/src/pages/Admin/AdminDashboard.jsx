import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
    const [selectedTab, setSelectedTab] = useState("categories");
    const [categories, setCategories] = useState([
        { id: 1, name: "mobiles", parent: "No parent category" },
        { id: 2, name: "iphones", parent: "mobiles" },
        { id: 3, name: "android", parent: "mobiles" },
    ]);
    const [editCategory, setEditCategory] = useState(null);

    const handleDelete = (id) => {
        setCategories(categories.filter((category) => category.id !== id));
    };

    const handleEdit = (category) => {
        setEditCategory(category);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editCategory) {
            setCategories(
                categories.map((cat) =>
                    cat.id === editCategory.id ? { ...cat, name: editCategory.name, parent: editCategory.parent } : cat
                )
            );
            setEditCategory(null);
        }
    };

    const renderContent = () => {
        switch (selectedTab) {
            case "dashboard":
                return <h2>Dashboard</h2>;
            case "categories":
                return (
                    <div>
                        <h2>Categories</h2>
                        {editCategory && (
                            <div className="mb-4 p-3 bg-light border rounded">
                                <div className="mb-3">
                                    <label className="form-label">Edit category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editCategory.name}
                                        onChange={(e) =>
                                            setEditCategory({ ...editCategory, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Parent category</label>
                                    <select
                                        className="form-select"
                                        value={editCategory.parent}
                                        onChange={(e) =>
                                            setEditCategory({ ...editCategory, parent: e.target.value })
                                        }
                                    >
                                        <option>No parent category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    Save
                                </button>
                            </div>
                        )}
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Category name</th>
                                    <th>Parent category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>{category.parent}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleEdit(category)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case "orders":
                return <h2>Orders</h2>;
            case "customers":
                return <h2>Customers</h2>;
            default:
                return null;
        }
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div
                className="bg-primary text-white p-3"
                style={{ width: "200px", height: "100vh" }}
            >
                <div className="mb-4">
                    <h4>EcommerceAdmin</h4>
                </div>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <button
                            className={`nav-link text-white ${selectedTab === "dashboard" ? "bg-primary-dark" : ""}`}
                            onClick={() => setSelectedTab("dashboard")}
                            style={{ background: "none", border: "none", textAlign: "left" }}
                        >
                            <i className="bi bi-house-door me-2"></i> Dashboard
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link text-white ${selectedTab === "categories" ? "bg-primary-dark" : ""}`}
                            onClick={() => setSelectedTab("categories")}
                            style={{ background: "none", border: "none", textAlign: "left" }}
                        >
                            <i className="bi bi-list me-2"></i> Category
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link text-white ${selectedTab === "orders" ? "bg-primary-dark" : ""}`}
                            onClick={() => setSelectedTab("orders")}
                            style={{ background: "none", border: "none", textAlign: "left" }}
                        >
                            <i className="bi bi-cart me-2"></i> Orders
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link text-white ${selectedTab === "customers" ? "bg-primary-dark" : ""}`}
                            onClick={() => setSelectedTab("customers")}
                            style={{ background: "none", border: "none", textAlign: "left" }}
                        >
                            <i className="bi bi-gear me-2"></i> Customers
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="p-4 w-100" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;