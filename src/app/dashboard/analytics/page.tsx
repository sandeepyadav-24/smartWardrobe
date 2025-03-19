"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaTshirt,
  FaCoins,
  FaCalendarAlt,
  FaStar,
  FaShoppingBag,
  FaArrowUp,
  FaHistory,
} from "react-icons/fa";

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

// Mock data - replace with real data
const hasData = false;
const daysOfData: number = 3; // Add explicit number type

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
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0  bg-white/80 backdrop-blur-sm border-b 
                 border-gray-100 px-4 md:px-8 py-4"
      >
        <div className="max-w-[1800px] mx-auto">
          <h1
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 
                       to-gray-600 bg-clip-text text-transparent"
          >
            Wardrobe Analytics
          </h1>
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
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
                         currentMode === feature.id
                           ? "ring-2 ring-blue-500"
                           : ""
                       }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-blue-600 text-xl">{feature.icon}</div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        {!hasData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1800px] mx-auto"
          >
            <div
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 
                         text-center"
            >
              <div className="max-w-md mx-auto space-y-6">
                <div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full 
                               w-20 h-20 mx-auto flex items-center justify-center 
                               shadow-inner"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <FaChartLine className="text-3xl text-gray-400" />
                  </motion.div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Not Enough Data Yet
                </h2>

                <p className="text-gray-600">
                  We need at least a week of wardrobe usage data to generate
                  meaningful insights. You've been using the app for{" "}
                  {daysOfData} {daysOfData === 1 ? "day" : "days"}.
                </p>

                <div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 
                             space-y-4"
                >
                  <h3 className="font-medium text-gray-800">
                    Here&apos;s how to get started:
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { icon: <FaTshirt />, text: "Log your daily outfits" },
                      {
                        icon: <FaHistory />,
                        text: "Track what you wear regularly",
                      },
                      {
                        icon: <FaShoppingBag />,
                        text: "Add items to your wardrobe",
                      },
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center gap-3 text-gray-600 bg-white p-3 
                                 rounded-lg shadow-sm"
                      >
                        <div className="text-blue-500 flex-shrink-0">
                          {item.icon}
                        </div>
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = "/dashboard/closet")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600  
                           text-white rounded-xl shadow-sm hover:shadow-md 
                           transition-all duration-200"
                >
                  Go to My Wardrobe
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* Time Range Selector */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end space-x-2"
            >
              {["30", "90", "365"].map((days) => (
                <motion.button
                  key={days}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeRange(days as "30" | "90" | "365")}
                  className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 
                           ${
                             timeRange === days
                               ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                               : "bg-white text-gray-600 hover:bg-gray-50"
                           }`}
                >
                  {days} Days
                </motion.button>
              ))}
            </motion.div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Most Worn Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Most Worn Items
                </h2>
                <div className="space-y-4">
                  {mockClothingData
                    .sort((a, b) => b.wears - a.wears)
                    .slice(0, 5)
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Worn {item.wears} times
                          </p>
                        </div>
                        <div className="text-green-500">
                          <FaArrowUp className="w-5 h-5" />
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>

              {/* Cost Per Wear */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cost Per Wear
                </h2>
                {/* Add your cost per wear chart here */}
              </motion.div>

              {/* Seasonal Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Seasonal Trends
                </h2>
                {/* Add your seasonal analysis chart here */}
              </motion.div>
            </div>
          </div>
        )}
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
