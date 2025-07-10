// src/components/vendor/TripRecords.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorSidebar from "./VendorSidebar";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.status) {
        setBillingData(res.data.data);
      }
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

  const handleNewEntrySubmit = async (e) => {
    e.preventDefault();
    // Submit logic goes here
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
      <main className="ml-64 flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Billing Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage trip records and billing information
            </p>
          </div>
          <div className="flex gap-3">
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              + Add Billing
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">
              Upload Excel
            </button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm">
              Template
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto bg-white shadow rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Guest Name</th>
                <th className="px-4 py-2">Type of Duty</th>
                <th className="px-4 py-2">Vehicle Type</th>
                <th className="px-4 py-2">Cab No</th>
                <th className="px-4 py-2">Company</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry) => (
                <tr key={entry._id} className="border-t">
                  <td className="px-4 py-2">{entry.date}</td>
                  <td className="px-4 py-2">{entry.guest_name}</td>
                  <td className="px-4 py-2">{entry.type_of_duty}</td>
                  <td className="px-4 py-2">{entry.vehicle_type}</td>
                  <td className="px-4 py-2">{entry.cab_no}</td>
                  <td className="px-4 py-2">{entry.company_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Billing Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-[500px] shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Billing Entry</h3>
              <form
                onSubmit={handleNewEntrySubmit}
                className="grid grid-cols-2 gap-4"
              >
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
                  value={newEntry.guest_name}
                  onChange={handleNewEntryChange}
                  placeholder="Guest Name"
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="type_of_duty"
                  value={newEntry.type_of_duty}
                  onChange={handleNewEntryChange}
                  placeholder="Type Of Duty"
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="cab_no"
                  value={newEntry.cab_no}
                  onChange={handleNewEntryChange}
                  placeholder="Cab No"
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="kms"
                  value={newEntry.kms}
                  onChange={handleNewEntryChange}
                  placeholder="Kms"
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="hours"
                  value={newEntry.hours}
                  onChange={handleNewEntryChange}
                  placeholder="Hours"
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="toll_parking"
                  value={newEntry.toll_parking}
                  onChange={handleNewEntryChange}
                  placeholder="Toll Parking"
                  className="border px-3 py-2 rounded-md"
                />
                <input
                  name="driver_night_ta"
                  value={newEntry.driver_night_ta}
                  onChange={handleNewEntryChange}
                  placeholder="Driver Night Ta"
                  className="border px-3 py-2 rounded-md"
                />
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Save
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

