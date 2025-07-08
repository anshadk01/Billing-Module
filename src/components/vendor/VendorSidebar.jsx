import React from "react";
import { Home, Upload, FileText, Wallet, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const VendorSidebar = () => {
  const location = useLocation();

  const navItems = [
    { to: "/vendor-dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { to: "/vendor/upload-invoice", icon: <Upload size={18} />, label: "Upload Invoice" },
    { to: "/vendor/trip-records", icon: <FileText size={18} />, label: "Trip Records" },
    { to: "/vendor/payout-history", icon: <Wallet size={18} />, label: "Payout History" },
    { to: "/vendor/rate-cards", icon: <Tag size={18} />, label: "Rate Cards" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md fixed left-0 top-0 h-full z-50">
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-blue-600">Billing Software</h1>
        <p className="text-xs text-gray-500">Vendor Portal</p>
      </div>

      <nav className="mt-6 space-y-2 px-4">
        {navItems.map(({ to, icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium
                ${isActive ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {icon}
              <span>{label}</span>
              {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-blue-600"></span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default VendorSidebar;