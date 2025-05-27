// src/layouts/Layout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { Menu, X } from "lucide-react";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 w-64 p-4 fixed z-40 top-0 left-0 h-full shadow-lg transform transition-transform duration-300 ease-in-out 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-48 px-4 relative z-10 flex flex-col">
        {/* Top bar for mobile */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Animal Kingdom</h1>
          <button onClick={toggleSidebar}>
            {showSidebar ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* This will show the page-specific content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
