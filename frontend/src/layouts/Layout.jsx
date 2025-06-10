import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { Menu, X } from "lucide-react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prevent body scroll when sidebar is open (mobile)
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-base-100 text-base-content">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 w-64 p-4 z-50 bg-transparent
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:h-auto md:translate-x-0
        `}
      >
        <Sidebar closeSidebar={closeSidebar} />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile top bar */}
        <header className="md:hidden p-4 flex items-center justify-between border-b">
          <h1 className="text-xl font-bold">Animal Kingdom</h1>
          <button onClick={toggleSidebar}>
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Page content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
