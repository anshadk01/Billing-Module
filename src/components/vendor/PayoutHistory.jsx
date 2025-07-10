// src/components/vendor/PayoutHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorSidebar from "./VendorSidebar";

const PayoutHistory = () => {
  const [pending, setPending] = useState([]);
  const [paid, setPaid] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [pendingRes, paidRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/invoices/pending", { headers }),
        axios.get("http://127.0.0.1:8000/invoices/paid", { headers }),
      ]);

      if (Array.isArray(pendingRes.data)) setPending(pendingRes.data);
      if (Array.isArray(paidRes.data)) setPaid(paidRes.data);
    } catch (err) {
      console.error("Failed to fetch payout data:", err);
    }
  };

  const renderTable = (data) => (
    <div className="overflow-x-auto bg-white shadow rounded-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 font-medium text-gray-600">Invoice No</th>
            <th className="px-4 py-2 font-medium text-gray-600">Company</th>
            <th className="px-4 py-2 font-medium text-gray-600">Start Date</th>
            <th className="px-4 py-2 font-medium text-gray-600">End Date</th>
            <th className="px-4 py-2 font-medium text-gray-600">Total</th>
            <th className="px-4 py-2 font-medium text-gray-600">Commission</th>
            <th className="px-4 py-2 font-medium text-gray-600">Receivable</th>
            <th className="px-4 py-2 font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((inv, i) => (
            <tr key={inv._id || i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{inv.invoice_number}</td>
              <td className="px-4 py-2">{inv.company_name}</td>
              <td className="px-4 py-2">{inv.billing_start_date}</td>
              <td className="px-4 py-2">{inv.billing_end_date}</td>
              <td className="px-4 py-2 text-blue-600 font-semibold">₹{inv.total.toFixed(2)}</td>
              <td className="px-4 py-2 text-red-500">₹{inv.admin_commission.toFixed(2)}</td>
              <td className="px-4 py-2 text-green-600">₹{inv.vendor_receivable.toFixed(2)}</td>
              <td
                className={`px-4 py-2 font-medium ${
                  inv.payment_status === "paid" ? "text-green-700" : "text-red-500"
                }`}
              >
                {inv.payment_status}
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-gray-400 py-6">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <main className="ml-64 flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payout History</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b pb-2">
          <button
            className={`text-sm font-medium ${
              activeTab === "pending" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`text-sm font-medium ${
              activeTab === "paid" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("paid")}
          >
            Paid
          </button>
        </div>

        {activeTab === "pending" ? renderTable(pending) : renderTable(paid)}
      </main>
    </div>
  );
};

export default PayoutHistory;
