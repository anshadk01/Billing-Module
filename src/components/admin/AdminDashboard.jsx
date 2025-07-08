import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Admin 👑</h2>
        <p className="text-gray-600 mt-2">Here’s an overview of your system.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;

