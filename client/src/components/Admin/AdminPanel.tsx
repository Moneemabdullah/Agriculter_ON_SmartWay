import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Overview from "./Overview"; 
import UsersPage from "./Users"; 
import Monitoring from "./Monitoring"; 
import Settings from "./Settings"; 

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("overview");

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <Overview />;
      case "users":
        return <UsersPage />
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
      <AdminSidebar active={activePage} onChange={setActivePage} />
      <main className="flex-1 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;