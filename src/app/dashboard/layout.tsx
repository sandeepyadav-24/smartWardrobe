"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaTshirt,
  FaCalendarAlt,
  FaRobot,
  FaChartLine,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", icon: <FaHome />, label: "Dashboard" },
    { href: "/dashboard/closet", icon: <FaTshirt />, label: "Smart Closet" },
    {
      href: "/dashboard/planner",
      icon: <FaCalendarAlt />,
      label: "Outfit Planner",
    },
    { href: "/dashboard/stylist", icon: <FaRobot />, label: "AI Stylist" },
    { href: "/dashboard/analytics", icon: <FaChartLine />, label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg z-50
                   transform transition-transform duration-300 ease-in-out
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                   md:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8">smartWardrobe</h1>
          <nav className="space-y-2">
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ x: 5 }}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(link.href);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg
                          transition-colors ${
                            pathname === link.href
                              ? "bg-green-500 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </motion.a>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="md:p-8 p-4 pt-16 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
