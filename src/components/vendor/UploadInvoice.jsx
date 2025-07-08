// src/components/vendor/UploadInvoice.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorSidebar from "./VendorSidebar";
import InvoiceEntriesModal from "./InvoiceEntriesModal"; // ✅ new import

const UploadInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null); // ✅ modal control

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
      <main className="ml-64 flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Invoice</h2>

        {loading ? (
          <p>Loading invoices...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Company</th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Start Date</th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">End Date</th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Total</th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    onClick={() => setSelectedInvoiceId(invoice._id)} // ✅ open modal
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-2 text-sm text-gray-800">{invoice.company_name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{invoice.billing_start_date}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{invoice.billing_end_date}</td>
                    <td className="px-4 py-2 text-sm text-blue-600 font-semibold">
                      ₹{invoice.total?.toLocaleString("en-IN") || "--"}
                    </td>
                    <td
                      className={`px-4 py-2 text-sm font-semibold capitalize ${
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
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ✅ Modal */}
      {selectedInvoiceId && (
        <InvoiceEntriesModal
          invoiceId={selectedInvoiceId}
          onClose={() => setSelectedInvoiceId(null)}
        />
      )}
    </div>
  );
};

export default UploadInvoice;
