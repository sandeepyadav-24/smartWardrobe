"use client";
import React, { useState, useEffect } from "react";
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
  FaSave,
  FaEdit,
} from "react-icons/fa";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

// Types
interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  notes?: string;
  occasion?: string;
  date?: Date;
}

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  favorite?: boolean;
}

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateOutfitOpen, setIsCreateOutfitOpen] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [wardrobe, setWardrobe] = useState<Record<string, ClothingItem[]>>({
    Tops: [],
    Bottoms: [],
    Outerwear: [],
    Shoes: [],
    Accessories: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("Tops");
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState("");
  const [outfitNotes, setOutfitNotes] = useState("");
  const [outfitOccasion, setOutfitOccasion] = useState("");
  const [isViewingOutfit, setIsViewingOutfit] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  // Fetch user's wardrobe
  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const response = await fetch("/api/clothing");
        if (response.ok) {
          const data = await response.json();

          // Organize items by category
          const categorizedItems: Record<string, ClothingItem[]> = {
            Tops: [],
            Bottoms: [],
            Outerwear: [],
            Shoes: [],
            Accessories: [],
          };

          data.data.forEach((item: ClothingItem) => {
            if (categorizedItems[item.category]) {
              categorizedItems[item.category].push(item);
            } else {
              categorizedItems[item.category] = [item];
            }
          });

          setWardrobe(categorizedItems);
        }
      } catch (error) {
        console.error("Error fetching wardrobe:", error);
      }
    };

    fetchWardrobe();
  }, []);

  // Fetch saved outfits
  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        // This would be replaced with an actual API call in a real implementation
        // For now, we'll use localStorage as a simple storage mechanism
        const savedOutfits = localStorage.getItem("savedOutfits");
        if (savedOutfits) {
          const parsedOutfits = JSON.parse(savedOutfits);
          // Convert date strings back to Date objects
          const outfitsWithDates = parsedOutfits.map((outfit: any) => ({
            ...outfit,
            date: outfit.date ? new Date(outfit.date) : undefined,
          }));
          setOutfits(outfitsWithDates);
        }
      } catch (error) {
        console.error("Error fetching outfits:", error);
      }
    };

    fetchOutfits();
  }, []);

  // Calendar Navigation
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get days for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Handle item selection
  const toggleItemSelection = (item: ClothingItem) => {
    if (selectedItems.some((selected) => selected.id === item.id)) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Open create outfit modal with date
  const openCreateOutfit = (date: Date) => {
    setSelectedDate(date);

    // Check if an outfit already exists for this date
    const existingOutfit = outfits.find(
      (outfit) => outfit.date && isSameDay(new Date(outfit.date), date)
    );

    if (existingOutfit) {
      setCurrentOutfit(existingOutfit);
      setOutfitName(existingOutfit.name);
      setOutfitNotes(existingOutfit.notes || "");
      setOutfitOccasion(existingOutfit.occasion || "");
      setSelectedItems(existingOutfit.items);
      setIsViewingOutfit(true);
    } else {
      resetOutfitForm();
      setIsViewingOutfit(false);
    }

    setIsCreateOutfitOpen(true);
  };

  // Reset outfit form
  const resetOutfitForm = () => {
    setOutfitName("");
    setOutfitNotes("");
    setOutfitOccasion("");
    setSelectedItems([]);
  };

  // Save outfit
  const saveOutfit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!outfitName || selectedItems.length === 0 || !selectedDate) {
      alert("Please provide an outfit name and select at least one item");
      return;
    }

    const newOutfit: Outfit = {
      id: currentOutfit?.id || Date.now().toString(),
      name: outfitName,
      items: selectedItems,
      notes: outfitNotes,
      occasion: outfitOccasion,
      date: selectedDate,
    };

    // Update or add the outfit
    const updatedOutfits = currentOutfit
      ? outfits.map((outfit) =>
          outfit.id === currentOutfit.id ? newOutfit : outfit
        )
      : [...outfits, newOutfit];

    setOutfits(updatedOutfits);

    // Save to localStorage (would be replaced with an API call)
    localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits));

    setIsCreateOutfitOpen(false);
    resetOutfitForm();
  };

  // Delete outfit
  const deleteOutfit = () => {
    if (!currentOutfit) return;

    const updatedOutfits = outfits.filter(
      (outfit) => outfit.id !== currentOutfit.id
    );
    setOutfits(updatedOutfits);

    // Save to localStorage (would be replaced with an API call)
    localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits));

    setIsCreateOutfitOpen(false);
    resetOutfitForm();
  };

  // Get outfit for a specific date
  const getOutfitForDate = (date: Date) => {
    return outfits.find(
      (outfit) => outfit.date && isSameDay(new Date(outfit.date), date)
    );
  };

  // Calendar day component with enhanced UI
  const CalendarDay = ({ day }: { day: Date }) => {
    const outfitForDay = getOutfitForDate(day);
    const isToday = isSameDay(day, new Date());

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => openCreateOutfit(day)}
        className={`
          relative aspect-square rounded-lg p-2 text-sm
          ${isToday ? "ring-2 ring-green-500" : ""}
          ${outfitForDay ? "bg-green-50" : "hover:bg-gray-50"}
          transition-all duration-200
        `}
      >
        <div className="flex flex-col h-full">
          {/* Date number */}
          <span
            className={`
            ${isToday ? "font-bold text-green-500" : ""}
            ${outfitForDay ? "font-semibold" : ""}
          `}
          >
            {format(day, "d")}
          </span>

          {/* Outfit indicator */}
          {outfitForDay && (
            <div className="mt-1 flex flex-col gap-1">
              <div className="text-xs font-medium truncate text-green-700">
                {outfitForDay.name}
              </div>
              {outfitForDay.occasion && (
                <div className="text-xs truncate text-green-600">
                  {outfitForDay.occasion}
                </div>
              )}

              {/* Edit button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCreateOutfit(day);
                }}
                className="absolute bottom-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <FaEdit className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          )}

          {/* Empty state indicator */}
          {!outfitForDay && (
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-xs text-gray-400">Click to plan outfit</div>
            </div>
          )}
        </div>
      </motion.button>
    );
  };

  // First-time user guide
  const UserGuide = () => (
    <AnimatePresence>
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                📅 Plan Your Outfits
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-500" />
                  Click on any date to plan your outfit
                </li>
                <li className="flex items-center gap-2">
                  <FaTshirt className="text-green-500" />
                  Select clothes from your wardrobe
                </li>
                <li className="flex items-center gap-2">
                  <FaSuitcase className="text-green-500" />
                  Add occasion details and notes
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Outfit Planner</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetOutfitForm();
            setIsViewingOutfit(false);
            setIsCreateOutfitOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg
                   hover:bg-green-600 transition-colors md:px-6"
        >
          <FaPlus />
          <span className="hidden md:inline">Create Outfit</span>
        </motion.button>
      </div>

      {/* User Guide */}
      <UserGuide />

      {/* Calendar View */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
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
            <CalendarDay key={day.toString()} day={day} />
          ))}
        </div>
      </div>

      {/* Upcoming Outfits */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-medium mb-4">Upcoming Outfits</h2>

        {outfits.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FaTshirt className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">
              No outfits planned yet. Click on a date to start planning!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {outfits
              .filter(
                (outfit) => outfit.date && new Date(outfit.date) >= new Date()
              )
              .sort(
                (a, b) =>
                  new Date(a.date!).getTime() - new Date(b.date!).getTime()
              )
              .map((outfit) => (
                <motion.div
                  key={outfit.id}
                  whileHover={{ scale: 1.01 }}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setCurrentOutfit(outfit);
                    setOutfitName(outfit.name);
                    setOutfitNotes(outfit.notes || "");
                    setOutfitOccasion(outfit.occasion || "");
                    setSelectedItems(outfit.items);
                    setSelectedDate(outfit.date || null);
                    setIsViewingOutfit(true);
                    setIsCreateOutfitOpen(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{outfit.name}</h3>
                      <p className="text-sm text-gray-500">
                        {outfit.date &&
                          format(new Date(outfit.date), "EEEE, MMMM d, yyyy")}
                      </p>
                      {outfit.occasion && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Occasion:</span>{" "}
                          {outfit.occasion}
                        </p>
                      )}
                    </div>
                    <div className="flex -space-x-2">
                      {outfit.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {outfit.items.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                          +{outfit.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Create/View Outfit Modal */}
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
                  <h2 className="text-xl font-bold">
                    {isViewingOutfit ? "View/Edit Outfit" : "Create New Outfit"}
                  </h2>
                  <button
                    onClick={() => setIsCreateOutfitOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Outfit Form */}
                <form onSubmit={saveOutfit} className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <div className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>
                        {selectedDate
                          ? format(selectedDate, "EEEE, MMMM d, yyyy")
                          : "Select a date"}
                      </span>
                    </div>
                  </div>

                  {/* Outfit Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outfit Name
                    </label>
                    <input
                      type="text"
                      value={outfitName}
                      onChange={(e) => setOutfitName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g., Business Casual"
                      required
                    />
                  </div>

                  {/* Occasion */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <input
                      type="text"
                      value={outfitOccasion}
                      onChange={(e) => setOutfitOccasion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g., Work Meeting, Date Night, Casual Friday"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Items
                    </label>
                    <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
                      {Object.keys(wardrobe).map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-full whitespace-nowrap ${
                            selectedCategory === category
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Clothing Items Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2">
                      {wardrobe[selectedCategory]?.length > 0 ? (
                        wardrobe[selectedCategory].map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleItemSelection(item)}
                            className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                              selectedItems.some(
                                (selected) => selected.id === item.id
                              )
                                ? "border-green-500"
                                : "border-transparent"
                            }`}
                          >
                            <div className="h-32 bg-gray-100">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <p className="text-sm font-medium truncate">
                                {item.name}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="col-span-3 text-center text-gray-500 py-4">
                          No items in this category
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Selected Items Preview */}
                  {selectedItems.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Items ({selectedItems.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-100 rounded-full px-3 py-1 flex items-center space-x-2"
                          >
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm">{item.name}</span>
                            <button
                              type="button"
                              onClick={() => toggleItemSelection(item)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={outfitNotes}
                      onChange={(e) => setOutfitNotes(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:outline-none"
                      rows={3}
                      placeholder="Add any notes about this outfit..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-green-500 text-white rounded-lg 
                             hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <FaSave />
                      <span>Save Outfit</span>
                    </button>

                    {isViewingOutfit && (
                      <button
                        type="button"
                        onClick={deleteOutfit}
                        className="py-3 px-4 bg-red-500 text-white rounded-lg 
                               hover:bg-red-600 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
