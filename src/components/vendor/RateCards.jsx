import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorSidebar from "./VendorSidebar";
import { Tag } from "lucide-react"; // ✅ Icon added
import Header from "../admin/Header";

const initialForm = {
  company_name: "",
  vehicle_type: "",
  package_name: "",
  base_rate: "",
  included_km: "",
  included_hours: "",
  extra_km_rate: "",
  extra_hour_rate: "",
  waiting_charge_per_minute: "",
  buffer_minutes: "",
  status: "active",
};

const RateCards = () => {
  const [companies, setCompanies] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [rateCards, setRateCards] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCompanies();
    fetchVehicles();
    fetchRateCards();
  }, []);

  const fetchCompanies = async () => {
    const res = await axios.get("http://127.0.0.1:8000/master/company", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCompanies(res.data || []);
  };

  const fetchVehicles = async () => {
    const res = await axios.get("http://127.0.0.1:8000/master/vehicle", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVehicles(res.data || []);
  };

  const fetchRateCards = async () => {
    const res = await axios.get("http://127.0.0.1:8000/rate-cards", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRateCards(res.data || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (card = null) => {
    if (card) {
      setForm(card);
      setEditingId(card._id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      base_rate: Number(form.base_rate),
      included_km: Number(form.included_km),
      included_hours: Number(form.included_hours),
      extra_km_rate: Number(form.extra_km_rate),
      extra_hour_rate: Number(form.extra_hour_rate),
      waiting_charge_per_minute: Number(form.waiting_charge_per_minute),
      buffer_minutes: Number(form.buffer_minutes),
    };

    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/rate-cards/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://127.0.0.1:8000/rate-cards", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchRateCards();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Submit failed:", error.response?.data || error.message);
      alert("Failed to save rate card.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rate card?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/rate-cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRateCards();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <main className="ml-64 flex-1 p-8 pt-16 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
        {/* ✅ Header */}<Header/>
        <div className="mb-6">
          <div className="flex pt-4 items-center gap-3 text-black mb-2">
            <Tag size={28} className="text-black" />
            <h1 className="text-3xl font-bold">Rate Cards</h1>
          </div>
          <p className="text-sm text-gray-500">
            Define corporate rates by vehicle and duty package.
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Add Rate Card
          </button>
        </div>

        {/* ✅ Rate Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {rateCards.map((card) => (
            <div
              key={card._id}
              className="relative bg-white border rounded-lg p-5 shadow hover:shadow-md transition"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => openModal(card)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card._id)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Delete
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{card.company_name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                {card.vehicle_type} | {card.package_name}
              </p>
              <p className="text-sm text-gray-700">Base Rate: ₹{card.base_rate}</p>
              <p className="text-sm text-gray-700">
                Included: {card.included_km} km / {card.included_hours} hrs
              </p>
              <p className="text-sm text-gray-700">
                Extra: ₹{card.extra_km_rate}/km | ₹{card.extra_hour_rate}/hr
              </p>
              <p className="text-sm text-gray-700">
                Waiting: ₹{card.waiting_charge_per_minute}/min
              </p>
              <p className="text-sm text-gray-700">Buffer: {card.buffer_minutes} mins</p>
            </div>
          ))}
        </div>

        {/* ✅ Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Edit" : "Add"} Rate Card</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Company</label>
                  <select
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">-- Select Company --</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c.company_name}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm">Vehicle Type</label>
                  <select
                    name="vehicle_type"
                    value={form.vehicle_type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">-- Select Vehicle --</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v.vehicle_type}>
                        {v.vehicle_type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm">Package Name</label>
                  <input
                    name="package_name"
                    value={form.package_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm">Base Rate (₹)</label>
                  <input
                    name="base_rate"
                    type="number"
                    value={form.base_rate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm">Included KM</label>
                  <input
                    name="included_km"
                    type="number"
                    value={form.included_km}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Included Hours</label>
                  <input
                    name="included_hours"
                    type="number"
                    value={form.included_hours}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Extra KM Rate (₹)</label>
                  <input
                    name="extra_km_rate"
                    type="number"
                    value={form.extra_km_rate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Extra Hour Rate (₹)</label>
                  <input
                    name="extra_hour_rate"
                    type="number"
                    value={form.extra_hour_rate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Waiting/Min (₹)</label>
                  <input
                    name="waiting_charge_per_minute"
                    type="number"
                    value={form.waiting_charge_per_minute}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Buffer Minutes</label>
                  <input
                    name="buffer_minutes"
                    type="number"
                    value={form.buffer_minutes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-full flex justify-end mt-4 gap-3">
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
                    Save Rate Card
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

export default RateCards;




