// src/components/admin/Header.jsx
import React, { useState } from "react";
import { LogOut } from "lucide-react";

const Header = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shadow-sm z-50">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-500 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;


