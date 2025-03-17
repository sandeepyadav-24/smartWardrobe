"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaTshirt,
  FaCoins,
  FaCalendarAlt,
  FaStar,
  FaTrash,
  FaShoppingBag,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types
type AnalyticsMode =
  | "overview"
  | "most-worn"
  | "utilization"
  | "cost"
  | "seasonal"
  | "outfits";

interface ClothingAnalytics {
  id: string;
  name: string;
  wears: number;
  cost: number;
  lastWorn: Date;
  category: string;
}

interface OutfitAnalytics {
  id: string;
  name: string;
  timesWorn: number;
  rating: number;
  lastWorn: Date;
}

// Mock Data
const mockClothingData: ClothingAnalytics[] = [
  {
    id: "1",
    name: "Blue Oxford Shirt",
    wears: 25,
    cost: 50,
    lastWorn: new Date(),
    category: "Tops",
  },
  // Add more mock items...
];

export default function AnalyticsPage() {
  const [currentMode, setCurrentMode] = useState<AnalyticsMode>("overview");
  const [timeRange, setTimeRange] = useState<"30" | "90" | "365">("30");

  const features = [
    {
      id: "most-worn",
      title: "Most & Least Worn",
      icon: <FaTshirt />,
      description: "Track your wardrobe usage",
    },
    {
      id: "utilization",
      title: "Utilization Rate",
      icon: <FaChartLine />,
      description: "See how much you use your clothes",
    },
    {
      id: "cost",
      title: "Cost Analysis",
      icon: <FaCoins />,
      description: "Track cost per wear",
    },
    {
      id: "seasonal",
      title: "Seasonal Trends",
      icon: <FaCalendarAlt />,
      description: "View seasonal patterns",
    },
    {
      id: "outfits",
      title: "Outfit Analytics",
      icon: <FaStar />,
      description: "See your best outfits",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Wardrobe Analytics</h1>
        <div className="flex space-x-2">
          {["30", "90", "365"].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days as "30" | "90" | "365")}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeRange === days
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {features.map((feature) => (
          <motion.button
            key={feature.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentMode(feature.id as AnalyticsMode)}
            className={`p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all
                     ${
                       currentMode === feature.id ? "ring-2 ring-green-500" : ""
                     }`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-green-500 text-xl">{feature.icon}</div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {currentMode === "most-worn" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Most Worn Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockClothingData
                .sort((a, b) => b.wears - a.wears)
                .slice(0, 5)
                .map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Worn {item.wears} times
                        </p>
                      </div>
                      <div className="text-green-500">
                        <FaArrowUp className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Add other mode content here */}
      </div>

      {/* Mobile Quick Actions */}
      <div className="md:hidden fixed bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentMode("overview")}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center 
                   text-white shadow-lg"
        >
          <FaChartLine className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
