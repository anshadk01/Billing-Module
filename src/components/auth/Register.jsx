import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company_name: "",
    role: "vendor",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/register", {
        ...formData,
        status: "active",
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMsg("Registered successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          company_name: "",
          role: "vendor",
        });
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Register Your Account
        </h2>

        {successMsg && (
          <p className="text-green-600 text-center">{successMsg}</p>
        )}
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jaanvi Sharma"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="ManavGuleria"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vendor@gmail.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="987653245"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            >
              <option value="vendor">Vendor</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg transition duration-300 ${loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {loading ? "Registering..." : "Submit"}
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Already a user?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;

