import React from "react";
import CompanySidebar from "./CompanySidebar";

const CompanyDashboard = () => {
  return (
    <div className="flex h-screen">
      <CompanySidebar />
      <main className="ml-64 flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Company 👔</h2>
        <p className="text-gray-600 mb-4">
          This is your centralized view for invoice tracking and payment actions.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Unpaid Invoices</p>
            <p className="text-2xl font-semibold text-red-500">₹24,000</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Payments Made</p>
            <p className="text-2xl font-semibold text-green-600">₹96,000</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;