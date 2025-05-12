import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./CategoryManager.css";
import axios from "../../../setup/axios";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [editingDescription, setEditingDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch categories from backend
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/categories");
            const data = Array.isArray(res) ? res : res.data;

            if (!data) {
                console.error("No data received from server");
                setCategories([]);
                return;
            }

            if (!Array.isArray(data)) {
                console.error("Invalid data format - expected array");
                setCategories([]);
                return;
            }

            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Error loading categories");
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Add new category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) {
            toast.warning("Category name cannot be empty");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post("/categories", {
                name: newCategory,
                description: newDescription
            });
            toast.success("Category added successfully");
            setNewCategory("");
            setNewDescription("");
            fetchCategories();
        } catch (error) {
            toast.error("Error adding category");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete category
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        setIsLoading(true);
        try {
            await axios.delete(`/categories/${id}`);
            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (error) {
            toast.error("Error deleting category");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Start editing
    const handleEdit = (id, name, description = "") => {
        setEditingId(id);
        setEditingName(name);
        setEditingDescription(description || "");
    };

    // Save edits
    const handleSaveEdit = async (id) => {
        if (!editingName.trim()) {
            toast.warning("Category name cannot be empty");
            return;
        }

        setIsLoading(true);
        try {
            await axios.put(`/categories/${id}`, {
                name: editingName,
                description: editingDescription
            });
            toast.success("Category updated successfully");
            setEditingId(null);
            setEditingName("");
            setEditingDescription("");
            fetchCategories();
        } catch (error) {
            toast.error("Error updating category");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName("");
        setEditingDescription("");
    };

    // Filter categories by search term
    const filteredCategories = categories.filter(cat =>
        cat.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="catmgr-category-manager-container">
            <div className="catmgr-category-header">
                <h2>Category Management</h2>
                <div className="catmgr-search-container">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="catmgr-search-input"
                    />
                </div>
            </div>

            <div className="catmgr-card">
                <div className="catmgr-card-header">
                    <h3>Add New Category</h3>
                </div>
                <div className="catmgr-card-body">
                    <form className="catmgr-category-add-form" onSubmit={handleAddCategory}>
                        <div className="catmgr-form-group">
                            <label htmlFor="categoryName">Name</label>
                            <input
                                id="categoryName"
                                type="text"
                                placeholder="Category name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                        </div>
                        <div className="catmgr-form-group">
                            <label htmlFor="categoryDescription">Description</label>
                            <textarea
                                id="categoryDescription"
                                placeholder="Category description (optional)"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="catmgr-btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? "Adding..." : "Add Category"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="catmgr-card catmgr-mt-4">
                <div className="catmgr-card-header">
                    <h3>Categories List</h3>
                    <span className="catmgr-category-count">{filteredCategories.length} categories</span>
                </div>
                <div className="catmgr-card-body">
                    {isLoading && <div className="catmgr-loading-indicator">Loading...</div>}

                    {!isLoading && filteredCategories.length === 0 && (
                        <div className="catmgr-empty-state">
                            {searchTerm ? "No categories match your search" : "No categories available"}
                        </div>
                    )}

                    {!isLoading && filteredCategories.length > 0 && (
                        <div className="catmgr-table-responsive">
                            <table className="catmgr-category-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Created</th>
                                        <th>Updated</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map((cat) => (
                                        <tr key={cat.category_id}>
                                            <td>{cat.category_id}</td>
                                            <td>
                                                {editingId === cat.category_id ? (
                                                    <input
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        className="catmgr-edit-input"
                                                    />
                                                ) : (
                                                    <span className="catmgr-category-name">{cat.category_name}</span>
                                                )}
                                            </td>
                                            <td>
                                                {editingId === cat.category_id ? (
                                                    <textarea
                                                        value={editingDescription}
                                                        onChange={(e) => setEditingDescription(e.target.value)}
                                                        className="catmgr-edit-textarea"
                                                    />
                                                ) : (
                                                    <span className="catmgr-category-description">{cat.description || "—"}</span>
                                                )}
                                            </td>
                                            <td>{formatDate(cat.created_at)}</td>
                                            <td>{formatDate(cat.updated_at)}</td>
                                            <td className="catmgr-actions-cell">
                                                {editingId === cat.category_id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveEdit(cat.category_id)}
                                                            className="catmgr-btn-save"
                                                            disabled={isLoading}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="catmgr-btn-cancel"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(cat.category_id, cat.category_name, cat.description)}
                                                            className="catmgr-btn-edit"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cat.category_id)}
                                                            className="catmgr-btn-delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;