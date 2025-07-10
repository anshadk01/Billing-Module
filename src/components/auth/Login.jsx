import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // ✅ Auto-redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      if (user.role === "superadmin") {
        navigate("/admin-dashboard");
      } else if (user.role === "vendor") {
        navigate("/vendor-dashboard");
      } else if (user.role === "company") {
        navigate("/company-dashboard");
      } else {
        navigate("/");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", formData);

      if (response.status === 200 && response.data.status) {
        const { access_token, user } = response.data.data;

        // ✅ Save token and user info to localStorage
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Role-Based Redirect
        if (user.role === "superadmin") {
          navigate("/admin-dashboard");
        } else if (user.role === "vendor") {
          navigate("/vendor-dashboard");
        } else if (user.role === "company") {
          navigate("/company-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-md p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login to Your Account
        </h2>

        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        <div className="space-y-4">
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
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg transition duration-300 ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-sm text-gray-500">
            New here?{" "}
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Register
            </Link>
          </p>
          <p className="mt-2 text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-800 transition duration-200"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;

