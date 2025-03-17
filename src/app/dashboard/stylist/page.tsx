"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaTshirt,
  FaChartLine,
  FaShoppingBag,
  FaSun,
  FaCloud,
  FaCalendarAlt,
  FaCamera,
  FaUpload,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

// Types
type StylistMode = "chat" | "outfit" | "style" | "insights" | "trends";
type WeatherType = "sunny" | "rainy" | "cloudy" | "cold";

interface AIOutfitSuggestion {
  id: string;
  items: ClothingItem[];
  occasion: string;
  weatherType: WeatherType;
}

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

interface WardrobeInsight {
  type: "most-worn" | "least-worn" | "missing" | "trend";
  title: string;
  description: string;
  actionable: string;
}

export default function AIStylistPage() {
  const [currentMode, setCurrentMode] = useState<StylistMode>("chat");
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      id: "outfit",
      title: "Daily Outfit",
      icon: <FaTshirt className="w-6 h-6" />,
      description:
        "Get AI-powered outfit suggestions based on weather & events",
    },
    {
      id: "style",
      title: "Style an Item",
      icon: <FaCamera className="w-6 h-6" />,
      description: "Learn how to style a specific piece multiple ways",
    },
    {
      id: "insights",
      title: "Wardrobe Insights",
      icon: <FaChartLine className="w-6 h-6" />,
      description: "Get AI analysis of your wardrobe usage and gaps",
    },
    {
      id: "trends",
      title: "Trend Suggestions",
      icon: <FaShoppingBag className="w-6 h-6" />,
      description: "Discover trending pieces that match your style",
    },
  ];

  const mockInsights: WardrobeInsight[] = [
    {
      type: "most-worn",
      title: "Most Worn Items",
      description: "Your blue jeans and white t-shirt are your go-to pieces",
      actionable: "Consider getting similar versatile basics",
    },
    {
      type: "missing",
      title: "Missing Essentials",
      description: "Your wardrobe lacks neutral colored pants",
      actionable: "Add some versatile pants to complete your wardrobe",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">AI Stylist</h1>
        <div className="flex items-center space-x-2">
          <FaRobot className="text-green-500 text-xl" />
          <span className="text-sm text-gray-600">
            Your Personal Style Assistant
          </span>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {features.map((feature) => (
          <motion.button
            key={feature.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentMode(feature.id as StylistMode)}
            className={`p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all
                     ${
                       currentMode === feature.id ? "ring-2 ring-green-500" : ""
                     }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-green-500">{feature.icon}</div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {currentMode === "chat" && (
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                Hi! I'm your AI Stylist. How can I help you today?
              </p>
            </div>
            {/* Chat input */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask me anything about your style..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {currentMode === "insights" && (
          <div className="space-y-6">
            {mockInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h3 className="font-medium mb-2">{insight.title}</h3>
                <p className="text-gray-600 mb-2">{insight.description}</p>
                <p className="text-sm text-green-600">{insight.actionable}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add other mode content here */}
      </div>

      {/* Mobile Quick Actions */}
      <div className="md:hidden fixed bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentMode("chat")}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center 
                   text-white shadow-lg"
        >
          <FaRobot className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
