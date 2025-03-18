"use client";
import React, { useState, useEffect } from "react";
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
    <div className="min-h-screen h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 
                 bg-clip-text text-transparent mb-8"
      >
        Wardrobe Dashboard
      </motion.h1>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md 
                   transition-all duration-200 border border-gray-100"
        >
          <h3 className="text-gray-500 text-sm mb-2">Total Items</h3>
          <p
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 
                     bg-clip-text text-transparent"
          >
            {stats.totalItems}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md 
                   transition-all duration-200 border border-gray-100"
        >
          <h3 className="text-gray-500 text-sm mb-2">Favorites</h3>
          <p
            className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 
                     bg-clip-text text-transparent"
          >
            {stats.favoriteItems}
          </p>
        </motion.div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
      >
        {Object.entries(stats.categoryCount).map(([category, count], index) => (
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
        ))}
      </motion.div>

      {/* Recent Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md 
                 transition-all duration-200 p-6 mb-8 border border-gray-100"
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

      {/* Most Worn Items */}
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
    </div>
  );
}
