import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandPage from "./LandPage";
import Logs from "./Landing page/Logs";
import MainBlog from "./Landing page/MainBlog";
import MainService from "./Landing page/MainService";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/blogs" element={<MainBlog />} />
        <Route path="/services" element={<MainService />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/:userId"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
