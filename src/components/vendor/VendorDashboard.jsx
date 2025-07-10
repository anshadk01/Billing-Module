import React from "react";
import VendorSidebar from "./VendorSidebar";
import Header from "../admin/Header";

const VendorDashboard = () => {
  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <main className="ml-64 flex-1 p-8 pt-16 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
        <Header/>
        <h2 className="text-2xl pt-4 font-bold text-gray-800 mb-2">Welcome Vendor 🧾</h2>
        <p className="text-gray-600 mb-4">
          Here's a quick overview of your payout status, uploaded invoices, and trip performance.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">This Month's Payout</p>
            <p className="text-2xl font-semibold text-blue-600">₹38,000</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Pending Invoices</p>
            <p className="text-2xl font-semibold text-yellow-600">5</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Trips This Month</p>
            <p className="text-2xl font-semibold text-green-600">27</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;