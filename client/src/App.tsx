import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandPage from "./LandPage";
import Logs from "./Landing page/Logs";
import MainBlog from "./Landing page/MainBlog";
import MainService from "./Landing page/MainService";
import MainAbout from "./Landing page/MainAbout";
import MainContact from "./Landing page/MainContact";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./components/Admin/AdminPanel"; // <-- import new component

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
