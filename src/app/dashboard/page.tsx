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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Wardrobe Dashboard
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Total Items</h3>
          <p className="text-3xl font-bold">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Favorites</h3>
          <p className="text-3xl font-bold text-red-500">
            {stats.favoriteItems}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {Object.entries(stats.categoryCount).map(([category, count]) => (
          <div key={category} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-green-500">
                {categoryIcons[category as keyof typeof categoryIcons]}
              </div>
              <span className="text-2xl font-bold">{count}</span>
            </div>
            <h3 className="text-gray-600">{category}</h3>
          </div>
        ))}
      </div>

      {/* Recent Items */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.recentlyAdded.map((item) => (
            <div key={item.id} className="relative">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm font-medium truncate">{item.name}</p>
              {item.favorite && (
                <FaHeart className="absolute top-2 right-2 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Most Worn Items */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Most Worn</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.mostWorn.map((item) => (
            <div key={item.id} className="relative">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm font-medium truncate">{item.name}</p>
              <p className="text-sm text-gray-500">{item.wears || 0} wears</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
