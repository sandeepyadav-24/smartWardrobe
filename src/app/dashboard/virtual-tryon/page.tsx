"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaTshirt,
  FaSocks,
  FaHatCowboy,
  FaTimes,
  FaDownload,
} from "react-icons/fa";
import { GiArmoredPants, GiMonclerJacket } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import CreditPurchase from "@/components/CreditPurchase";

type ClothingCategory =
  | "Tops"
  | "Bottoms"
  | "Outerwear"
  | "Shoes"
  | "Accessories";

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  favorite: boolean;
}

export default function VirtualTryOnPage() {
  const { data: session } = useSession();
  const [fullBodyImage, setFullBodyImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<ClothingCategory>("Tops");
  const [clothingItems, setClothingItems] = useState<
    Record<ClothingCategory, ClothingItem[]>
  >({
    Tops: [],
    Bottoms: [],
    Outerwear: [],
    Shoes: [],
    Accessories: [],
  });
  const [selectedItems, setSelectedItems] = useState<
    Record<ClothingCategory, ClothingItem | null>
  >({
    Tops: null,
    Bottoms: null,
    Outerwear: null,
    Shoes: null,
    Accessories: null,
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentProcessingItem, setCurrentProcessingItem] = useState<
    string | null
  >(null);
  const [intermediateImages, setIntermediateImages] = useState<string[]>([]);
  const [isFullSizeModalOpen, setIsFullSizeModalOpen] =
    useState<boolean>(false);
  const [credits, setCredits] = useState<number>(0);
  const [isCheckingCredits, setIsCheckingCredits] = useState(false);

  // Fetch user's full body image
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setFullBodyImage(data.fullBodyImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  // Fetch clothing items
  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        const response = await fetch("/api/clothing");
        if (response.ok) {
          const data = await response.json();

          // Group items by category
          const groupedItems: Record<ClothingCategory, ClothingItem[]> = {
            Tops: [],
            Bottoms: [],
            Outerwear: [],
            Shoes: [],
            Accessories: [],
          };

          data.data.forEach((item: ClothingItem) => {
            if (item.category in groupedItems) {
              groupedItems[item.category as ClothingCategory].push(item);
            }
          });

          setClothingItems(groupedItems);
        }
      } catch (error) {
        console.error("Error fetching clothing items:", error);
      }
    };

    if (session) {
      fetchClothingItems();
    }
  }, [session]);

  // Fetch user's credits
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/user/credits");
        if (response.ok) {
          const data = await response.json();
          setCredits(data.credits);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };

    if (session) {
      fetchCredits();
    }
  }, [session]);

  const handleItemSelect = (item: ClothingItem) => {
    setSelectedItems({
      ...selectedItems,
      [item.category]: item,
    });
  };

  const generateTryOn = async () => {
    if (!fullBodyImage) {
      setError("Please upload a full body image in your settings first");
      return;
    }

    const selectedItemsCount = Object.values(selectedItems).filter(
      (item) => item !== null
    ).length;

    if (selectedItemsCount === 0) {
      setError("Please select at least one clothing item");
      return;
    }

    // Calculate total credits needed (10 credits per item)
    const creditsNeeded = selectedItemsCount * 10;

    if (credits < creditsNeeded) {
      setError(
        `Insufficient credits. You need ${creditsNeeded} credits but have ${credits}`
      );
      return;
    }

    setIsCheckingCredits(true);
    try {
      // Attempt to deduct credits (10 per item)
      const response = await fetch("/api/user/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: creditsNeeded }),
      });

      if (!response.ok) {
        throw new Error("Failed to deduct credits");
      }

      const { credits: updatedCredits } = await response.json();
      setCredits(updatedCredits);

      // Continue with the existing try-on logic
      setIsGenerating(true);
      setError(null);
      setProgressMessage("Preparing your virtual try-on...");
      setProgressPercent(0);
      setCurrentProcessingItem(null);
      setIntermediateImages([]);
      setGeneratedImage(null);

      // Prepare the data for the API request
      const selectedItemsArray = Object.values(selectedItems)
        .filter((item) => item !== null)
        .map((item) => ({
          category: item!.category,
          imageUrl: item!.imageUrl,
        }));

      // Send the request to your backend API
      const tryOnResponse = await fetch("/api/virtual-tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          humanImage: fullBodyImage,
          clothingItems: selectedItemsArray,
        }),
      });

      if (!tryOnResponse.ok) {
        throw new Error("Failed to generate try-on image");
      }

      // Process the streaming response
      const reader = tryOnResponse.body?.getReader();
      if (!reader) {
        throw new Error("Failed to read response stream");
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        // Process each line
        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            // Update UI based on message type
            switch (data.type) {
              case "progress":
                setProgressMessage(data.message);
                setProgressPercent((data.progress / data.totalItems) * 100);
                setCurrentProcessingItem(data.currentItem || null);
                break;

              case "modelProgress":
                setProgressMessage(data.message);
                break;

              case "itemComplete":
                setProgressMessage(data.message);
                setProgressPercent((data.progress / data.totalItems) * 100);
                if (data.intermediateImage) {
                  setIntermediateImages((prev) => [
                    ...prev,
                    data.intermediateImage,
                  ]);
                  // Also show the latest intermediate image
                  setGeneratedImage(data.intermediateImage);
                }
                break;

              case "complete":
                setProgressMessage("Virtual try-on complete!");
                setProgressPercent(100);
                setCurrentProcessingItem(null);
                setGeneratedImage(data.resultImage);
                break;

              case "error":
                throw new Error(data.message);
            }
          } catch (e) {
            console.error("Error parsing stream data:", e, line);
          }
        }
      }
    } catch (error) {
      console.error("Error generating try-on:", error);
      setError(
        typeof error === "string"
          ? error
          : "Failed to generate try-on image. Please try again."
      );
    } finally {
      setIsGenerating(false);
      setIsCheckingCredits(false);
    }
  };

  const categories: { label: ClothingCategory; icon: React.ReactNode }[] = [
    { label: "Tops", icon: <FaTshirt /> },
    { label: "Bottoms", icon: <GiArmoredPants /> },
    { label: "Outerwear", icon: <GiMonclerJacket /> },
    { label: "Shoes", icon: <FaSocks /> },
    { label: "Accessories", icon: <FaHatCowboy /> },
  ];

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#f8fafc]">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0  bg-white/80 backdrop-blur-sm border-b 
                 border-gray-100 px-4 md:px-8 py-4"
      >
        <div className="max-w-[1800px] mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-3">
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 
                          bg-clip-text text-transparent"
            >
              Virtual Try-On Studio
            </h1>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm bg-blue-50 px-3 py-1.5 rounded-lg text-blue-600 font-medium">
                1 Try-on = 10 Credits
              </span>
              <div
                className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 
                            px-3 py-2 rounded-xl border border-blue-100 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-blue-600 font-medium">
                    Credits
                  </span>
                  <span
                    className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
                                 bg-clip-text text-transparent"
                  >
                    {credits}
                  </span>
                </div>
                <div
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 
                              flex items-center justify-center shadow-md"
                >
                  <span className="text-white text-base">💎</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <h1
              className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 
                          bg-clip-text text-transparent"
            >
              Virtual Try-On Studio
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="bg-blue-50 px-3 py-1.5 rounded-lg">
                  1 Try-on = 10 Credits
                </span>
              </div>
              <div
                className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 
                            px-4 py-2 rounded-xl border border-blue-100 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-blue-600 font-medium">
                    Available Credits
                  </span>
                  <span
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
                                 bg-clip-text text-transparent"
                  >
                    {credits}
                  </span>
                </div>
                <div
                  className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 
                              flex items-center justify-center shadow-md"
                >
                  <span className="text-white text-lg">💎</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-[1800px] mx-auto"
        >
          {!fullBodyImage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-l-4 border-blue-500 p-8 rounded-2xl shadow-lg mb-6"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Complete Your Profile
                  </h2>
                  <p className="text-gray-600">
                    Upload a full body image to start creating amazing virtual
                    try-ons
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = "/dashboard/settings")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                           text-white rounded-xl shadow-md hover:shadow-xl 
                           transition-all duration-200"
                >
                  Go to Settings
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - User Image and Clothing Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* User Image */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Your Photo
                  </h2>
                  <div
                    className="h-[calc(100vh-400px)] min-h-[500px] rounded-xl overflow-hidden 
                               shadow-inner bg-gradient-to-br from-gray-50 to-gray-100"
                  >
                    <img
                      src={fullBodyImage}
                      alt="Your full body"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex overflow-x-auto space-x-3 mb-6 pb-2 scrollbar-hide">
                    {categories.map((category) => (
                      <motion.button
                        key={category.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category.label)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl 
                                 min-w-[90px] transition-all duration-300 ${
                                   selectedCategory === category.label
                                     ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                                     : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                 }`}
                      >
                        <span className="text-2xl mb-2">{category.icon}</span>
                        <span className="text-sm font-medium">
                          {category.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Clothing Items Grid */}
                  <div className="h-[400px] overflow-y-auto rounded-xl">
                    {clothingItems[selectedCategory].length === 0 ? (
                      <div
                        className="flex flex-col items-center justify-center h-full 
                                   bg-gray-50 rounded-xl p-8 text-center"
                      >
                        <span className="text-5xl mb-4 text-gray-400">
                          {
                            categories.find((c) => c.label === selectedCategory)
                              ?.icon
                          }
                        </span>
                        <p className="text-gray-600">
                          No {selectedCategory.toLowerCase()} found in your
                          wardrobe
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {clothingItems[selectedCategory].map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleItemSelect(item)}
                            className={`cursor-pointer rounded-xl overflow-hidden 
                                     transition-all duration-300 ${
                                       selectedItems[selectedCategory]?.id ===
                                       item.id
                                         ? "ring-2 ring-blue-500 shadow-lg"
                                         : "hover:shadow-md border border-gray-100"
                                     }`}
                          >
                            <div className="aspect-square bg-gray-50">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {item.name}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Preview
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateTryOn}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                             text-white rounded-xl shadow-md hover:shadow-lg 
                             transition-all duration-200 disabled:from-gray-400 
                             disabled:to-gray-500 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      "Generate Preview"
                    )}
                  </motion.button>
                </div>

                <div
                  className="h-[calc(100vh-400px)] min-h-[500px] rounded-xl overflow-hidden 
                             shadow-inner bg-gradient-to-br from-gray-50 to-gray-100 mb-6"
                >
                  {isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
                      <div className="w-full max-w-md">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      {currentProcessingItem && (
                        <div className="text-center space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Processing: {currentProcessingItem}
                          </p>
                          <p className="text-sm text-gray-500">
                            {progressMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Virtual try-on result"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div
                      className="h-full flex flex-col items-center justify-center p-6 
                                 text-gray-400"
                    >
                      <FaTshirt className="text-6xl mb-4" />
                      <p className="text-center text-sm">
                        Select items and click Generate Preview to see the
                        result
                      </p>
                    </div>
                  )}
                </div>

                {/* Selected Items Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Selected Items
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {categories.map((category) => (
                      <motion.div
                        key={category.label}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-xl bg-gray-50 p-2 relative 
                                 group transition-all duration-300"
                      >
                        {selectedItems[category.label] ? (
                          <img
                            src={selectedItems[category.label]!.imageUrl}
                            alt={selectedItems[category.label]!.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center 
                                         text-gray-400"
                          >
                            {category.icon}
                          </div>
                        )}
                        <div
                          className="absolute inset-0 bg-black/60 rounded-xl opacity-0 
                                     group-hover:opacity-100 transition-opacity duration-300 
                                     flex items-center justify-center"
                        >
                          <span className="text-white text-xs font-medium">
                            {category.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Full Size Modal */}
      <AnimatePresence>
        {isFullSizeModalOpen && generatedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center 
                     justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full bg-white 
                       rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={generatedImage}
                  download="virtual-tryon-result.jpg"
                  className="p-2 bg-blue-600 text-white rounded-full shadow-lg 
                           hover:bg-blue-700 transition-colors"
                >
                  <FaDownload className="w-5 h-5" />
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullSizeModalOpen(false)}
                  className="p-2 bg-white text-gray-900 rounded-full shadow-lg 
                           hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </motion.button>
              </div>

              <img
                src={generatedImage}
                alt="Virtual try-on result full size"
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
