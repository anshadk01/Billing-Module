import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CommissionOverview = () => {
  const [commissionData, setCommissionData] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);
  const [topVendors, setTopVendors] = useState([]);

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/commissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { total, chart_data, top_vendors } = response.data.data;
      setTotalCommission(total);
      setCommissionData(chart_data);
      setTopVendors(top_vendors);
    } catch (error) {
      console.error("Error fetching commission data:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Commission Overview</h2>
        <p className="text-gray-600 mb-6">
          A summary of commission earnings and performance insights.
        </p>

        {/* Total Commission Summary */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Commissions Earned</h3>
          <p className="text-3xl text-blue-600 font-bold mt-2">₹{totalCommission}</p>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Commissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commissionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Vendors */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Earning Vendors</h3>
          <ul className="space-y-2">
            {topVendors.map((vendor, index) => (
              <li key={index} className="flex justify-between text-sm text-gray-700">
                <span>{vendor.name}</span>
                <span className="font-semibold">₹{vendor.commission}</span>
              </li>
            ))}
            {topVendors.length === 0 && (
              <li className="text-gray-400">No vendor data available.</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default CommissionOverview;