import React, { useEffect, useState } from "react";
import { GetAllUser, DeleteUser } from "../../../services/userService";
import { toast } from "react-toastify";
import "./UserManager.css";

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await GetAllUser();
            // Nếu response là mảng, set luôn, nếu không thì lấy response.data
            if (Array.isArray(response)) {
                setUsers(response);
            } else if (response && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                toast.error("Không thể tải danh sách người dùng.");
            }
        } catch (error) {
            toast.error("Lỗi khi tải danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                await DeleteUser(userId);
                toast.success("Đã xóa người dùng.");
                fetchUsers();
            } catch (error) {
                toast.error("Lỗi khi xóa người dùng.");
            }
        }
    };

    return (
        <div className="user-manager-container">
            <h2>Quản lý người dùng</h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6">Không có người dùng nào.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.address}</td>
                                    <td>
                                        {/* Nút xóa, có thể thêm nút sửa nếu muốn */}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserManager;