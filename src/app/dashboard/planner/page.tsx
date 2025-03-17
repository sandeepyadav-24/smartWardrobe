"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaCalendarAlt,
  FaTshirt,
  FaSuitcase,
  FaBell,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

// Types
interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  notes?: string;
  date?: Date;
}

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

// Mock data
const mockOutfits: Outfit[] = [
  {
    id: "1",
    name: "Business Casual",
    items: [
      {
        id: "1",
        name: "Blue Oxford Shirt",
        category: "Tops",
        imageUrl: "/mock/shirt1.jpg",
      },
      {
        id: "2",
        name: "Black Jeans",
        category: "Bottoms",
        imageUrl: "/mock/pants1.jpg",
      },
    ],
    notes: "Perfect for office meetings",
  },
  // Add more mock outfits...
];

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateOutfitOpen, setIsCreateOutfitOpen] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);

  // Calendar Navigation
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get days for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Outfit Planner</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateOutfitOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg
                   hover:bg-green-600 transition-colors md:px-6"
        >
          <FaPlus />
          <span className="hidden md:inline">Create Outfit</span>
        </motion.button>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-lg font-medium">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day) => (
            <motion.button
              key={day.toString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square rounded-lg p-2 text-sm ${
                selectedDate?.toDateString() === day.toDateString()
                  ? "bg-green-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex flex-col h-full">
                <span>{format(day, "d")}</span>
                {/* Outfit indicator */}
                {outfits.some(
                  (outfit) => outfit.date?.toDateString() === day.toDateString()
                ) && (
                  <div className="mt-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto" />
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateOutfitOpen(true)}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center 
                   text-white shadow-lg"
        >
          <FaPlus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Create Outfit Modal */}
      <AnimatePresence>
        {isCreateOutfitOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Create New Outfit</h2>
                  <button
                    onClick={() => setIsCreateOutfitOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Outfit Creation Form */}
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outfit Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g., Business Casual"
                    />
                  </div>

                  {/* Clothing Items Grid */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Items
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {/* Add clothing items here */}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:outline-none"
                      rows={3}
                      placeholder="Add any notes about this outfit..."
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-green-500 text-white rounded-lg 
                             hover:bg-green-600 transition-colors font-medium"
                  >
                    Save Outfit
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
