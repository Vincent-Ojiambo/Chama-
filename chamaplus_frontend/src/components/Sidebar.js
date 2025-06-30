import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import {
  Home,
  Briefcase,
  Wallet,
  Calendar,
  BarChart2,
  Settings,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  Users,
} from "lucide-react";

function Sidebar({ sidebarMinimized, setSidebarMinimized, isMobile = false, sidebarOpen = false, onToggle, className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
  const memberMenuItems = [
    { name: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "my-chamas", label: "My Chamas", icon: <Briefcase size={20} />, path: "/my-chamas" },
    { name: "contributions", label: "Contributions", icon: <Wallet size={20} />, path: "/contributions" },
    { name: "loans", label: "Loans", icon: <DollarSign size={20} />, path: "/loans" },
    { name: "meetings", label: "Meetings", icon: <Calendar size={20} />, path: "/meetings" },
    { name: "reports", label: "Reports", icon: <BarChart2 size={20} />, path: "/reports" },
    { name: "settings", label: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const adminMenuItems = [
    { name: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: "/admin/dashboard" },
    { name: "chamas", label: "Manage Chamas", icon: <Briefcase size={20} />, path: "/admin/chamas" },
    { name: "members", label: "Members", icon: <Users size={20} />, path: "/admin/members" },
    { name: "contributions", label: "Contributions", icon: <Wallet size={20} />, path: "/admin/contributions" },
    { name: "loans", label: "Loan Management", icon: <DollarSign size={20} />, path: "/admin/loans" },
    { name: "meetings", label: "Meetings", icon: <Calendar size={20} />, path: "/admin/meetings" },
    { name: "reports", label: "Reports", icon: <BarChart2 size={20} />, path: "/admin/reports" },
    { name: "settings", label: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  // Determine which menu items to show based on user role and current route
  let menuItems;
  if (isAdmin && location.pathname.startsWith('/admin')) {
    // Use admin menu items for admin routes
    menuItems = adminMenuItems;
  } else if (isAdmin) {
    // If admin is on non-admin route, still show admin menu
    menuItems = adminMenuItems;
  } else {
    // Regular member menu
    menuItems = memberMenuItems;
  }

  return (
    <aside
      className={`flex flex-col ${isMobile ? "w-56 h-full bg-gradient-to-b from-green-400 via-blue-300 to-purple-300 border-none fixed left-0 top-0 bottom-0 pt-16 z-50 shadow-2xl" : `${sidebarMinimized ? "w-20" : "w-56"} bg-gradient-to-b from-green-100 via-blue-50 to-purple-50 border-r border-gray-200 fixed left-0 top-16 bottom-0 pt-6 rounded-tr-3xl shadow-xl z-20`} ${className}`}
      style={isMobile ? { 
        borderRadius: '0 1.5rem 1.5rem 0', 
        boxShadow: '0 0 40px 0 rgba(80,80,180,0.12)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
      } : {}}
    >
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          onClick={() => onToggle(!sidebarOpen)}
          className="absolute right-0 top-8 bg-white shadow-lg rounded-full p-1 border border-gray-200 hover:bg-blue-50 z-30"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      )}

      {/* Minimize/Expand Button (desktop only) */}
      {!isMobile && (
        <button
          aria-label={sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
          onClick={() => setSidebarMinimized(!sidebarMinimized)}
          className="absolute -right-4 top-8 bg-white shadow-lg rounded-full p-1 border border-gray-200 hover:bg-blue-50 z-30"
        >
          {sidebarMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      )}
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-tr-2xl shadow-md mb-4">
          <img src="/logo512.png" alt="ChamaPlus Logo" className="h-10 w-10 rounded-full border-2 border-white shadow mr-3" />
          <span className="text-xl font-extrabold text-white tracking-wide drop-shadow">ChamaPlus</span>
          <button
            onClick={() => onToggle(false)}
            className="text-white hover:text-gray-200 transition-none"
          >
            <X size={20} />
          </button>
        </div>
      )}
      <nav className={`flex-1 ${isMobile ? "mt-2" : "mt-8"}`}>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => {
                  navigate(item.path);
                  if (isMobile && sidebarOpen) {
                    onToggle(false);
                  }
                }}
                className={`flex items-center ${sidebarMinimized && !isMobile ? "justify-center px-0" : "px-6 justify-start"} py-3 w-full text-left rounded-2xl group focus:outline-none focus:ring-2 focus:ring-green-300
                  ${
                    location.pathname.startsWith(item.path)
                      ? "bg-gradient-to-r from-green-200 via-blue-100 to-purple-100 text-green-700 font-bold shadow-lg border-l-4 border-green-500"
                      : isMobile
                        ? "text-white/90 hover:bg-white/10 hover:text-white"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }
                `}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <span className={`text-xl group-hover:scale-110 transition-none ${location.pathname.startsWith(item.path) ? (isMobile ? "text-white" : "text-green-700") : (isMobile ? "text-white/70" : "text-gray-400")}`}>{item.icon}</span>
                {(!sidebarMinimized || isMobile) && <span className="truncate ml-3 text-base font-semibold">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pb-6 px-6">
        <button
          onClick={async () => {
            try {
              // Wait for logout to complete
              await logout();
              // Then navigate to the landing page
              window.location.href = '/';
            } catch (error) {
              console.error('Logout error:', error);
              // Still navigate even if there's an error
              window.location.href = '/';
            }
          }}
          className={`flex items-center w-full justify-center py-3 text-white font-bold rounded-xl bg-gradient-to-r from-green-700 via-blue-700 to-purple-700 shadow-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white`}
        >
          <span className="text-xl">
            <LogOut size={20} />
          </span>
          {(!sidebarMinimized || isMobile) && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
