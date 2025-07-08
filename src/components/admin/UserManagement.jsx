import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Eye } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const toggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:8000/admin/users/${userId}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Status toggle failed:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const openEditModal = (user) => {
    setCurrentUser({
      ...user,
      full_name: user.name,
      password: "supersecret", // You can update this dynamically if needed
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:8000/admin/users/${currentUser._id}`,
        {
          full_name: currentUser.full_name,
          email: currentUser.email,
          phone: currentUser.phone,
          company_name: currentUser.company_name,
          role: currentUser.role,
          status: currentUser.status,
          password: currentUser.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-64"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="company">Company</option>
            <option value="driver">Driver</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-md bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-4 py-2 flex gap-3 items-center">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editModalOpen && currentUser && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg relative">
              <h3 className="text-lg font-semibold mb-4">Edit User</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  name="full_name"
                  value={currentUser.full_name || ""}
                  onChange={handleEditChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <input
                  name="email"
                  value={currentUser.email || ""}
                  onChange={handleEditChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <input
                  name="phone"
                  value={currentUser.phone || ""}
                  onChange={handleEditChange}
                  placeholder="Phone"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <input
                  name="company_name"
                  value={currentUser.company_name || ""}
                  onChange={handleEditChange}
                  placeholder="Company"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <select
                  name="role"
                  value={currentUser.role || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                  <option value="company">Company</option>
                </select>
                <input
                  name="status"
                  value={currentUser.status || ""}
                  onChange={handleEditChange}
                  placeholder="Status"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <input
                  name="password"
                  value={currentUser.password || ""}
                  onChange={handleEditChange}
                  placeholder="Password"
                  type="password"
                  className="w-full px-4 py-2 border rounded-md"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-1 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;



