import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandPage from "@/features/landing/pages/LandPage";
import Logs from "@/features/landing/pages/Logs";
import MainBlog from "@/features/landing/pages/MainBlog";
import MainService from "@/features/landing/pages/MainService";
import MainAbout from "@/features/landing/pages/MainAbout";
import MainContact from "@/features/landing/pages/MainContact";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import ProtectedRoute from "@/features/dashboard/components/ProtectedRoute";
import AdminPanel from "@/features/admin/pages/AdminPanel";
import TestPage from "@/components/TestPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/home" element={<LandPage />} />
        <Route path="/about" element={<MainAbout />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/blog" element={<MainBlog />} />
        <Route path="/blogs" element={<MainBlog />} />
        <Route path="/services" element={<MainService />} />
        <Route path="/contact" element={<MainContact />} />
        <Route path="/test" element={<TestPage />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/:userId"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin route */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
