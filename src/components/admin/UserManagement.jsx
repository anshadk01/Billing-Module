import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Eye, Users } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";

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
      const res = await axios.get("http://127.0.0.1:8000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://127.0.0.1:8000/admin/users/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openEditModal = (user) => {
    setCurrentUser({
      ...user,
      full_name: user.name,
      password: "supersecret", // You may change this
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
      await axios.put(`http://127.0.0.1:8000/admin/users/${currentUser._id}`, currentUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 pt-16 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
        {/* Header */} <Header/>
        <div className="mb-6">
          <div className="flex pt-4 items-center gap-3 text-black mb-2">
            <Users size={28} className="text-black" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <p className="text-sm text-gray-500">Manage users, update roles and statuses.</p>
        </div>

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

        {/* User Table */}
        <div className="overflow-x-auto border rounded-md bg-white shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
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
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
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
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Edit User</h3>
              <form onSubmit={handleEditSubmit} className="space-y-3">
                <input name="full_name" value={currentUser.full_name} onChange={handleEditChange} placeholder="Full Name" className="w-full px-4 py-2 border rounded-md" />
                <input name="email" value={currentUser.email} onChange={handleEditChange} placeholder="Email" className="w-full px-4 py-2 border rounded-md" />
                <input name="phone" value={currentUser.phone} onChange={handleEditChange} placeholder="Phone" className="w-full px-4 py-2 border rounded-md" />
                <input name="company_name" value={currentUser.company_name} onChange={handleEditChange} placeholder="Company" className="w-full px-4 py-2 border rounded-md" />
                <select name="role" value={currentUser.role} onChange={handleEditChange} className="w-full px-4 py-2 border rounded-md">
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                  <option value="company">Company</option>
                </select>
                <input name="status" value={currentUser.status} onChange={handleEditChange} placeholder="Status" className="w-full px-4 py-2 border rounded-md" />
                <input name="password" type="password" value={currentUser.password} onChange={handleEditChange} placeholder="Password" className="w-full px-4 py-2 border rounded-md" />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditModalOpen(false)} className="text-gray-600 hover:text-black">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
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




