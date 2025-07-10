import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorSidebar from "./VendorSidebar";
import { ClipboardList } from "lucide-react"; // ✅ Icon
import Header from "../admin/Header";

const TripRecords = () => {
  const [billingData, setBillingData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newEntry, setNewEntry] = useState({
    date: "",
    company_name: "",
    vehicle_type: "",
    package: "",
    guest_name: "",
    type_of_duty: "",
    cab_no: "",
    kms: "",
    hours: "",
    toll_parking: "",
    driver_night_ta: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBillingData();
    fetchCompanies();
    fetchVehicles();
    fetchPackages();
  }, []);

  const fetchBillingData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/billing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.status) setBillingData(res.data.data);
    } catch (error) {
      console.error("Error fetching billing data:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/master/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data || []);
    } catch (err) {
      console.error("Error fetching companies", err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/master/vehicle", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data || []);
    } catch (err) {
      console.error("Error fetching vehicles", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/master/package", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(res.data?.packages || []);
    } catch (err) {
      console.error("Error fetching packages", err);
    }
  };

  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewEntrySubmit = (e) => {
    e.preventDefault();
    alert("Entry saved! (Submit logic not implemented)");
    setIsModalOpen(false);
    setNewEntry({
      date: "",
      company_name: "",
      vehicle_type: "",
      package: "",
      guest_name: "",
      type_of_duty: "",
      cab_no: "",
      kms: "",
      hours: "",
      toll_parking: "",
      driver_night_ta: "",
    });
  };

  const filteredData =
    selectedCompany === "All Companies"
      ? billingData
      : billingData.filter((b) => b.company_name === selectedCompany);

  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <main className="ml-64 flex-1 p-8 pt-16 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
        {/* ✅ Header */} <Header/>
        <div className="mb-6">
          <div className="flex pt-4 items-center gap-3 text-black mb-2">
            <ClipboardList size={28} className="text-black" />
            <h1 className="text-3xl font-bold">Billing Management</h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage trip records and billing entries efficiently.
          </p>
        </div>

        {/* ✅ Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-4 py-2 border rounded-md text-sm"
          >
            <option>All Companies</option>
            {companies.map((c, idx) => (
              <option key={idx} value={c.company_name}>
                {c.company_name}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              + Add Billing
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
              Upload Excel
            </button>
            <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm">
              Template
            </button>
          </div>
        </div>

        {/* ✅ Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Guest Name</th>
                <th className="px-4 py-3">Type of Duty</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Cab No</th>
                <th className="px-4 py-3">Company</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry) => (
                <tr key={entry._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{entry.date}</td>
                  <td className="px-4 py-2">{entry.guest_name}</td>
                  <td className="px-4 py-2">{entry.type_of_duty}</td>
                  <td className="px-4 py-2">{entry.vehicle_type}</td>
                  <td className="px-4 py-2">{entry.cab_no}</td>
                  <td className="px-4 py-2">{entry.company_name}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-6">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Add Billing Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[500px]">
              <h3 className="text-xl font-semibold mb-4">Add New Billing Entry</h3>
              <form onSubmit={handleNewEntrySubmit} className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={newEntry.date}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                />
                <select
                  name="company_name"
                  value={newEntry.company_name}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                >
                  <option value="">Select Company</option>
                  {companies.map((c, idx) => (
                    <option key={idx} value={c.company_name}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
                <select
                  name="vehicle_type"
                  value={newEntry.vehicle_type}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v, idx) => (
                    <option key={idx} value={v.vehicle_type}>
                      {v.vehicle_type}
                    </option>
                  ))}
                </select>
                <select
                  name="package"
                  value={newEntry.package}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                >
                  <option value="">Select Package</option>
                  {packages.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <input
                  name="guest_name"
                  placeholder="Guest Name"
                  value={newEntry.guest_name}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="type_of_duty"
                  placeholder="Type Of Duty"
                  value={newEntry.type_of_duty}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="cab_no"
                  placeholder="Cab No"
                  value={newEntry.cab_no}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="kms"
                  placeholder="Kms"
                  value={newEntry.kms}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="hours"
                  placeholder="Hours"
                  value={newEntry.hours}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="toll_parking"
                  placeholder="Toll Parking"
                  value={newEntry.toll_parking}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="driver_night_ta"
                  placeholder="Driver Night TA"
                  value={newEntry.driver_night_ta}
                  onChange={handleNewEntryChange}
                  className="border px-3 py-2 rounded-md"
                />
                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TripRecords;


