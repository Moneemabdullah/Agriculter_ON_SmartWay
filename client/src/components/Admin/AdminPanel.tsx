import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
// Protiti alada file theke component gulo import korun
import Overview from "./Overview"; 
import UsersPage from "./Users"; 
import Monitoring from "./Monitoring"; 
import Settings from "./Settings"; 

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("overview");

  // Dynamic content rendering logic
  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <Overview />;
      case "users":
        return <UsersPage /> // Ekhon white page ashbe na
      case "monitoring":
        return <Monitoring />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar fixed thakbe */}
      <AdminSidebar active={activePage} onChange={setActivePage} />
      
      {/* Main content area jekhane switch hobe */}
      <main className="flex-1 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;