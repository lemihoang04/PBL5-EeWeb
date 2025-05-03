import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./CategoryManager.css"; // Tạo file CSS nếu cần
import axios from "../../../setup/axios";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");

    // Lấy danh sách category từ backend
    const fetchCategories = async () => {
        try {
            const res = await axios.get("/categories");
            console.log("Raw response:", res); 
                
            // Kiểm tra nếu res là array thì dùng res, không thì dùng res.data
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
            toast.error("Lỗi khi tải danh mục");
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Thêm category mới
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) {
            toast.warning("Tên danh mục không được để trống");
            return;
        }
        try {
            await axios.post("/categories", { name: newCategory });
            toast.success("Thêm danh mục thành công");
            setNewCategory("");
            fetchCategories();
        } catch (error) {
            toast.error("Lỗi khi thêm danh mục");
        }
    };

    // Xóa category
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await axios.delete(`/categories/${id}`);
            toast.success("Xóa danh mục thành công");
            fetchCategories();
        } catch (error) {
            toast.error("Lỗi khi xóa danh mục");
        }
    };

    // Bắt đầu chỉnh sửa
    const handleEdit = (id, name) => {
        setEditingId(id);
        setEditingName(name);
    };

    // Lưu chỉnh sửa
    const handleSaveEdit = async (id) => {
        if (!editingName.trim()) {
            toast.warning("Tên danh mục không được để trống");
            return;
        }
        try {
            await axios.put(`/categories/${id}`, { name: editingName });
            toast.success("Cập nhật danh mục thành công");
            setEditingId(null);
            setEditingName("");
            fetchCategories();
        } catch (error) {
            toast.error("Lỗi khi cập nhật danh mục");
        }
    };

    // Hủy chỉnh sửa
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName("");
    };

    return (
        <div className="category-manager-container">
            <h2>Quản lý danh mục</h2>
            <form className="category-add-form" onSubmit={handleAddCategory}>
                <input
                    type="text"
                    placeholder="Tên danh mục mới"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button type="submit">Thêm</button>
            </form>
            <table className="category-table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Tên danh mục</th>
                    <th>Mô tả</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                {categories.map((cat) => (
                    <tr key={cat.category_id}>
                        <td>{cat.category_id}</td>
                        <td>
                            {editingId === cat.category_id ? (
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                />
                            ) : (
                                cat.category_name
                            )}
                        </td>
                        <td>{cat.description}</td>
                        <td>{cat.created_at}</td>
                        <td>{cat.updated_at}</td>
                        <td>
                            {editingId === cat.category_id ? (
                                <>
                                    <button onClick={() => handleSaveEdit(cat.category_id)}>Lưu</button>
                                    <button onClick={handleCancelEdit}>Hủy</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(cat.category_id, cat.category_name)}>Sửa</button>
                                    <button onClick={() => handleDelete(cat.category_id)}>Xóa</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    );
};

export default CategoryManager;