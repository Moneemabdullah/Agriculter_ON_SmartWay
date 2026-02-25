import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import Overview from "../components/Overview";
import UsersPage from "../components/Users";
import Monitoring from "../components/Monitoring";
import Settings from "../components/Settings"; 

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
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar active={activePage} onChange={setActivePage} />
      <main className="flex-1 overflow-y-auto h-screen p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;