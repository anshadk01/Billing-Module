// src/components/vendor/PayoutHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorSidebar from "./VendorSidebar";
import { CreditCard, Clock, CheckCircle } from "lucide-react";
import Header from "../admin/Header";


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
    <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 font-medium">Invoice No</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Start Date</th>
            <th className="px-4 py-3 font-medium">End Date</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Commission</th>
            <th className="px-4 py-3 font-medium">Receivable</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((inv, i) => (
            <tr key={inv._id || i} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-2 font-medium text-gray-800">{inv.invoice_number}</td>
              <td className="px-4 py-2">{inv.company_name}</td>
              <td className="px-4 py-2">{inv.billing_start_date}</td>
              <td className="px-4 py-2">{inv.billing_end_date}</td>
              <td className="px-4 py-2 font-semibold text-blue-600">₹{inv.total.toFixed(2)}</td>
              <td className="px-4 py-2 text-red-600">₹{inv.admin_commission.toFixed(2)}</td>
              <td className="px-4 py-2 text-green-600">₹{inv.vendor_receivable.toFixed(2)}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
                    inv.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {inv.payment_status === "paid" ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {inv.payment_status}
                </span>
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
      <main className="ml-64 flex-1 p-8 pt-16 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">

        {/* Header */} <Header/>
        <div className="mb-6">
  <div className="flex pt-4 items-center gap-3 text-black mb-2">
    <CreditCard size={28} className="text-black" />
    <h1 className="text-3xl font-bold">Payout History</h1>
  </div>
  <p className="text-sm text-gray-500">
    Track invoice payments and commission details in real time.
  </p>
</div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b pb-2">
          <button
            className={`text-sm font-semibold transition ${
              activeTab === "pending"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Payouts
          </button>
          <button
            className={`text-sm font-semibold transition ${
              activeTab === "paid"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("paid")}
          >
            Paid Payouts
          </button>
        </div>

        {activeTab === "pending" ? renderTable(pending) : renderTable(paid)}
      </main>
    </div>
  );
};

export default PayoutHistory;

