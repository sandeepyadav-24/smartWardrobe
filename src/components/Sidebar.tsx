"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
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
import { GiHanger } from "react-icons/gi";

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

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
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </motion.button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-[40]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:sticky top-0 left-0 z-[50] w-[280px] h-screen 
                   bg-white/95 backdrop-blur-md shadow-xl
                   transform transition-transform duration-300 ease-in-out
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                   md:translate-x-0 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 5 }}
              className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 
                       rounded-lg flex items-center justify-center shadow-lg"
            >
              <GiHanger className="w-5 h-5 text-white" />
            </motion.div>
            <div className="relative">
              <span className="text-xl font-light tracking-tight">
                smart<span className="font-bold text-blue-600">wardrobe</span>
              </span>
              <div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 
                          transform origin-left scale-x-0 transition-transform 
                          duration-300 group-hover:scale-x-100"
              />
            </div>
          </Link>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative group flex items-center px-4 py-3 rounded-xl text-sm 
                       font-medium transition-all duration-200 mb-1
                       ${
                         pathname === link.href
                           ? "text-blue-600 bg-blue-50"
                           : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                       }`}
            >
              <motion.span
                className="mr-3"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
              </motion.span>
              <span className="font-semibold">{link.label}</span>
              {pathname === link.href && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-gradient-to-b from-blue-600 
                           to-blue-800 rounded-r-full my-auto top-0 bottom-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        {session?.user && (
          <div
            className="flex-shrink-0 p-4 border-t border-gray-200/50 
                       bg-gradient-to-r from-gray-50 to-white"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <div
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 
                             to-blue-800 flex items-center justify-center text-white 
                             font-bold shadow-lg"
                >
                  {session.user.name?.charAt(0) || "U"}
                </div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut()}
                className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 
                         hover:text-blue-600 transition-colors duration-200"
              >
                <FaSignOutAlt className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}
