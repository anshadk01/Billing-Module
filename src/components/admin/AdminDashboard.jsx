import React from "react";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 pt-16 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
        <Header/>
        <h2 className="text-2xl pt-4 font-bold text-gray-800">Welcome Admin 👑</h2>
        <p className="text-gray-600 mt-2">Here’s an overview of your system.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;

