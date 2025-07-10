// src/components/vendor/UploadInvoice.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorSidebar from "./VendorSidebar";
import InvoiceEntriesModal from "./InvoiceEntriesModal";
import { FileText } from "lucide-react"; // ✅ new icon
import Header from "../admin/Header";

const UploadInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setInvoices(response.data);
      } else if (response.data?.invoices) {
        setInvoices(response.data.invoices);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <main className="ml-64 flex-1 p-8 pt-16 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
        {/* ✅ Header */} <Header/>
        <div className="mb-6">
          <div className="flex pt-4 items-center gap-3 text-black mb-2">
            <FileText size={28} className="text-black" />
            <h1 className="text-3xl font-bold">Upload Invoice</h1>
          </div>
          <p className="text-sm text-gray-500">
            Review generated invoices and open entries for verification.
          </p>
        </div>

        {/* ✅ Table */}
        {loading ? (
          <p className="text-sm text-gray-500">Loading invoices...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Start Date</th>
                  <th className="px-4 py-3 font-medium">End Date</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    onClick={() => setSelectedInvoiceId(invoice._id)}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-4 py-2 text-gray-800">{invoice.company_name}</td>
                    <td className="px-4 py-2 text-gray-600">{invoice.billing_start_date}</td>
                    <td className="px-4 py-2 text-gray-600">{invoice.billing_end_date}</td>
                    <td className="px-4 py-2 font-semibold text-blue-600">
                      ₹{invoice.total?.toLocaleString("en-IN") || "--"}
                    </td>
                    <td
                      className={`px-4 py-2 font-medium capitalize ${
                        invoice.payment_status === "paid"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {invoice.payment_status || "unpaid"}
                    </td>
                  </tr>
                ))}

                {invoices.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400 py-6">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Modal */}
        {selectedInvoiceId && (
          <InvoiceEntriesModal
            invoiceId={selectedInvoiceId}
            onClose={() => setSelectedInvoiceId(null)}
          />
        )}
      </main>
    </div>
  );
};

export default UploadInvoice;

