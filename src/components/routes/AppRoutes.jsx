// src/routes/Routes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import AdminDashboard from "../admin/AdminDashboard";
import CompanyDashboard from "../company/CompanyDashboard";
import VendorDashboard from "../vendor/VendorDashboard";
import UserManagement from "../admin/UserManagement";
import CommissionOverview from "../admin/CommissionOverview";
import UploadInvoice from "../vendor/UploadInvoice";
import InvoiceEntries from "../vendor/InvoiceEntriesModal";
import ForgotPassword from "../auth/ForgotPassword";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/admin/users" element={<UserManagement/>}/>
        <Route path="/admin/commissions" element={<CommissionOverview/>}/>
        <Route path="/vendor/upload-invoice" element={<UploadInvoice/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;