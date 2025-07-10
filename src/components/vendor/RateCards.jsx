import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorSidebar from "./VendorSidebar";

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
      company_name: form.company_name,
      vehicle_type: form.vehicle_type,
      package_name: form.package_name,
      base_rate: Number(form.base_rate) || 0,
      included_km: Number(form.included_km) || 0,
      included_hours: Number(form.included_hours) || 0,
      extra_km_rate: Number(form.extra_km_rate) || 0,
      extra_hour_rate: Number(form.extra_hour_rate) || 0,
      waiting_charge_per_minute: Number(form.waiting_charge_per_minute) || 0,
      buffer_minutes: Number(form.buffer_minutes) || 0,
      status: form.status || "active",
    };

    console.log("Submitting payload:", payload); // Debugging

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
      alert("Failed to save rate card. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rate card?")) return;
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
      <main className="ml-64 flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Rate Cards</h2>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Add Rate Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rateCards.map((card) => (
            <div
              key={card._id}
              className="relative bg-white p-4 border rounded-lg shadow hover:shadow-md transition"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => openModal(card)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>

              <h3 className="text-lg font-bold mb-1">{card.company_name}</h3>
              <p className="text-sm text-gray-700 mb-1">
                {card.vehicle_type} • {card.package_name}
              </p>
              <p className="text-sm">Base Rate: ₹{card.base_rate}</p>
              <p className="text-sm">
                Included: {card.included_km} km / {card.included_hours} hr
              </p>
              <p className="text-sm">
                Extra: ₹{card.extra_km_rate}/km | ₹{card.extra_hour_rate}/hr
              </p>
              <p className="text-sm">
                Waiting: ₹{card.waiting_charge_per_minute}/min
              </p>
              <p className="text-sm">Buffer: {card.buffer_minutes} min</p>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h3 className="text-xl font-semibold mb-4">
                {editingId ? "Edit Rate Card" : "Add New Rate Card"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Corporate Client *</label>
                  <select
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="">Select Client</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c.company_name}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm">Package Name *</label>
                  <input
                    name="package_name"
                    value={form.package_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm">Vehicle Type *</label>
                  <select
                    name="vehicle_type"
                    value={form.vehicle_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="">Select Type</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v.vehicle_type}>
                        {v.vehicle_type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm">Base Rate (₹) *</label>
                  <input
                    type="number"
                    name="base_rate"
                    value={form.base_rate}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Included KM *</label>
                  <input
                    type="number"
                    name="included_km"
                    value={form.included_km}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Included Hours *</label>
                  <input
                    type="number"
                    name="included_hours"
                    value={form.included_hours}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Extra KM Rate (₹) *</label>
                  <input
                    type="number"
                    name="extra_km_rate"
                    value={form.extra_km_rate}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Extra Hour Rate (₹) *</label>
                  <input
                    type="number"
                    name="extra_hour_rate"
                    value={form.extra_hour_rate}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Waiting Charge Per Minute (₹)</label>
                  <input
                    type="number"
                    name="waiting_charge_per_minute"
                    value={form.waiting_charge_per_minute}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Buffer Minutes</label>
                  <input
                    type="number"
                    name="buffer_minutes"
                    value={form.buffer_minutes}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-full flex justify-end mt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
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


