// src/components/vendor/InvoiceEntriesModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoiceEntriesModal = ({ invoiceId, onClose }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceId) fetchInvoiceEntries();
  }, [invoiceId]);

  const fetchInvoiceEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://127.0.0.1:8000/invoices/${invoiceId}/entries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to load entries", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-6xl max-h-[90%] overflow-y-auto rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Invoice Entries
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>No entries found for this invoice.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border rounded">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Guest</th>
                  <th className="px-4 py-2">Vehicle</th>
                  <th className="px-4 py-2">Cab No</th>
                  <th className="px-4 py-2">KMs</th>
                  <th className="px-4 py-2">Hours</th>
                  <th className="px-4 py-2">Toll</th>
                  <th className="px-4 py-2">Night TA</th>
                  <th className="px-4 py-2">Extra KMs</th>
                  <th className="px-4 py-2">Extra Hrs</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{entry.date}</td>
                    <td className="px-4 py-2">{entry.guest_name}</td>
                    <td className="px-4 py-2">{entry.vehicle_type}</td>
                    <td className="px-4 py-2">{entry.cab_no}</td>
                    <td className="px-4 py-2">{entry.kms}</td>
                    <td className="px-4 py-2">{entry.hours}</td>
                    <td className="px-4 py-2">₹{entry.toll_parking}</td>
                    <td className="px-4 py-2">₹{entry.driver_night_ta}</td>
                    <td className="px-4 py-2">{entry.extra_kms} (₹{entry.extra_kms_amount})</td>
                    <td className="px-4 py-2">{entry.extra_hours} (₹{entry.extra_hr_amount})</td>
                    <td className="px-4 py-2 text-blue-600">₹{entry.amount}</td>
                    <td className="px-4 py-2 font-bold text-green-700">₹{entry.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceEntriesModal;
