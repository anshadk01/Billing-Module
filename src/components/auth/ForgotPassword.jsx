// src/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/forgot-password", { email });

      if (response.status === 200) {
        setMsg("Reset link sent to your email.");
      }
    } catch (error) {
      setMsg("Error sending reset email. Try again.");
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
          Forgot Password
        </h2>

        {msg && <p className="text-center text-blue-600">{msg}</p>}

        <div>
          <label className="text-sm text-gray-600">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg transition duration-300 ${
            loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
