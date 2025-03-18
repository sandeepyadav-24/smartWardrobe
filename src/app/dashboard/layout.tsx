"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  FaHome,
  FaTshirt,
  FaCalendarAlt,
  FaRobot,
  FaChartLine,
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaMagic,
} from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const links = [
    { href: "/dashboard", icon: <FaHome />, label: "Dashboard" },
    { href: "/dashboard/closet", icon: <FaTshirt />, label: "Smart Closet" },
    {
      href: "/dashboard/planner",
      icon: <FaCalendarAlt />,
      label: "Outfit Planner",
    },
    { href: "/dashboard/stylist", icon: <FaRobot />, label: "AI Stylist" },
    {
      href: "/dashboard/virtual-tryon",
      icon: <FaMagic />,
      label: "Virtual Try-On",
    },
    { href: "/dashboard/analytics", icon: <FaChartLine />, label: "Analytics" },
    { href: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
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
        <div className="p-4 flex flex-col h-full">
          <h1 className="text-xl font-bold mb-8">smartWardrobe</h1>

          {/* User info at the top */}
          {session?.user && (
            <div className="mb-6 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-500 text-white">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          )}

          <nav className="space-y-2 flex-grow">
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

          {/* Logout button at the bottom */}
          <button
            onClick={handleSignOut}
            className="mt-auto flex items-center space-x-3 px-4 py-3 rounded-lg
                     text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="text-lg">
              <FaSignOutAlt />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="md:p-8 p-4 pt-16 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
