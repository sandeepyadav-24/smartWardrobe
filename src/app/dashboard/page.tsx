"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTshirt,
  FaHeart,
  FaSocks,
  FaShoePrints,
  FaHatCowboy,
} from "react-icons/fa";
import Image from "next/image";

interface ClothingStats {
  totalItems: number;
  categoryCount: {
    Tops: number;
    Bottoms: number;
    Outerwear: number;
    Shoes: number;
    Accessories: number;
  };
  favoriteItems: number;
  recentlyAdded: ClothingItem[];
  mostWorn: ClothingItem[];
}

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  favorite?: boolean;
  wears?: number;
  lastWorn?: Date;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ClothingStats>({
    totalItems: 0,
    categoryCount: {
      Tops: 0,
      Bottoms: 0,
      Outerwear: 0,
      Shoes: 0,
      Accessories: 0,
    },
    favoriteItems: 0,
    recentlyAdded: [],
    mostWorn: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClothingStats = async () => {
      try {
        const response = await fetch("/api/clothing");
        if (response.ok) {
          const { data } = await response.json();

          // Calculate statistics
          const categoryCount = {
            Tops: 0,
            Bottoms: 0,
            Outerwear: 0,
            Shoes: 0,
            Accessories: 0,
          };

          let favoriteCount = 0;

          data.forEach((item: ClothingItem) => {
            if (item.category in categoryCount) {
              categoryCount[item.category as keyof typeof categoryCount]++;
            }
            if (item.favorite) favoriteCount++;
          });

          setStats({
            totalItems: data.length,
            categoryCount,
            favoriteItems: favoriteCount,
            recentlyAdded: data.slice(0, 5), // Last 5 added items
            mostWorn: data
              .sort(
                (a: ClothingItem, b: ClothingItem) =>
                  (b.wears || 0) - (a.wears || 0)
              )
              .slice(0, 5), // Top 5 most worn
          });
        }
      } catch (error) {
        console.error("Error fetching clothing stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClothingStats();
  }, []);

  const categoryIcons = {
    Tops: <FaTshirt className="w-6 h-6" />,
    Bottoms: <FaSocks className="w-6 h-6" />,
    Outerwear: <FaTshirt className="w-6 h-6" />,
    Shoes: <FaShoePrints className="w-6 h-6" />,
    Accessories: <FaHatCowboy className="w-6 h-6" />,
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0  bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 md:px-8 py-4"
      >
        <div className="max-w-[1800px] mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-between">
              <motion.h1
                className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 
                                  bg-clip-text text-transparent"
              >
                Wardrobe Dashboard
              </motion.h1>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 
                          px-3 mr-10 py-1.5 rounded-lg border border-red-100 shadow-sm"
              >
                <span className="text-sm font-bold text-red-600">
                  {stats.favoriteItems}
                </span>
                <FaHeart className="h-4 w-4 text-red-500" />
              </motion.div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 
                          px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm"
              >
                <span className="text-sm text-blue-600 font-medium">
                  Total Items
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {stats.totalItems}
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 
                          px-3 py-1.5 rounded-lg border border-purple-100 shadow-sm"
              >
                <span className="text-sm text-purple-600 font-medium">
                  Categories
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {Object.keys(stats.categoryCount).length}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <motion.h1
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 
                       bg-clip-text text-transparent"
            >
              Wardrobe Dashboard
            </motion.h1>
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 
                         px-4 py-2 rounded-xl border border-blue-100 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-blue-600 font-medium">
                    Total Items
                  </span>
                  <span
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
                               bg-clip-text text-transparent"
                  >
                    {stats.totalItems}
                  </span>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 
                         px-4 py-2 rounded-xl border border-red-100 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-red-600 font-medium">
                    Favorites
                  </span>
                  <span
                    className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 
                               bg-clip-text text-transparent"
                  >
                    {stats.favoriteItems}
                  </span>
                </div>
                <FaHeart className="h-5 w-5 text-red-500" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-[1800px] mx-auto space-y-8"
        >
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {Object.entries(stats.categoryCount).map(
              ([category, count], index) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md 
                         transition-all duration-200 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-blue-600">
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </div>
                    <span
                      className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 
                               bg-clip-text text-transparent"
                    >
                      {count}
                    </span>
                  </div>
                  <h3 className="text-gray-600 font-medium">{category}</h3>
                </motion.div>
              )
            )}
          </motion.div>

          {/* Recent Items Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md 
                     transition-all duration-200 p-6 border border-gray-100"
          >
            <h2
              className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 
                         bg-clip-text text-transparent mb-4"
            >
              Recently Added
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.recentlyAdded.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div
                    className="aspect-square rounded-lg overflow-hidden shadow-sm 
                               group-hover:shadow-md transition-all duration-200"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover transform group-hover:scale-105 
                               transition-transform duration-200"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 truncate">
                    {item.name}
                  </p>
                  {item.favorite && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <FaHeart className="w-5 h-5 drop-shadow-md" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Most Worn Items Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md 
                     transition-all duration-200 p-6 border border-gray-100"
          >
            <h2
              className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 
                         bg-clip-text text-transparent mb-4"
            >
              Most Worn
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.mostWorn.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div
                    className="aspect-square rounded-lg overflow-hidden shadow-sm 
                               group-hover:shadow-md transition-all duration-200"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover transform group-hover:scale-105 
                               transition-transform duration-200"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {item.wears || 0} wears
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
