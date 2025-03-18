"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaSearch,
  FaTshirt,
  FaShoePrints,
  FaHatCowboy,
  FaSocks,
  FaHeart,
  FaFilter,
  FaTimes,
  FaCamera,
  FaUpload,
  FaWindowClose,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//import { useAuth } from "@/context/AuthContext";

// Types
type ClothingCategory =
  | "All"
  | "Tops"
  | "Bottoms"
  | "Shoes"
  | "Accessories"
  | "Outerwear";
type ClothingTag =
  | "Casual"
  | "Formal"
  | "Party"
  | "Office"
  | "Summer"
  | "Winter";

interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  tags: ClothingTag[];
  imageUrl: string;
  favorite: boolean;
  lastWorn?: Date;
}

interface AddItemModalProps {
  onClose: () => void;
  onAddItem: (item: ClothingItem) => void;
  categories: { label: ClothingCategory; icon: React.ReactNode }[];
}

const AddItemModal = ({
  onClose,
  onAddItem,
  categories,
}: AddItemModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("Tops");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const availableTags = [
    "Casual",
    "Formal",
    "Party",
    "Office",
    "Summer",
    "Winter",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !name) {
      alert("Please select an image and provide a name");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("name", name);
      formData.append("category", category);
      formData.append("favorite", favorite.toString());

      // Add all selected tags to the form data
      selectedTags.forEach((tag) => {
        formData.append("tags", tag);
      });

      const response = await fetch("/api/clothing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { data } = await response.json();
      onAddItem(data);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Failed to add item. Please try again.";
      if (error instanceof Error) {
        errorMessage += ` (${error.message})`;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Add New Item</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="flex justify-center p-4 border-2 border-dashed rounded-lg">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-40 w-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                    <FaCamera className="text-gray-600" />
                    <span>Take Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                    <FaUpload className="text-gray-600" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.label} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favorite"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="mr-2 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="favorite"
              className="text-sm font-medium text-gray-700"
            >
              Mark as favorite
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !image || !name}
            className={`w-full py-3 rounded-lg font-medium transition-colors
              ${
                loading || !image || !name
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default function ClosetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ClothingCategory>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //const { user } = useAuth();

  const categories: { label: ClothingCategory; icon: React.ReactNode }[] = [
    { label: "All", icon: <FaTshirt /> },
    { label: "Tops", icon: <FaTshirt /> },
    { label: "Bottoms", icon: <FaSocks /> },
    { label: "Shoes", icon: <FaShoePrints /> },
    { label: "Accessories", icon: <FaHatCowboy /> },
    { label: "Outerwear", icon: <FaShoePrints /> },
  ];

  // Fetch clothing items from the API
  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/clothing");

        if (!response.ok) {
          throw new Error("Failed to fetch clothing items");
        }

        const { data } = await response.json();

        // Transform the data to match our ClothingItem interface
        const transformedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category as ClothingCategory,
          tags: item.tags || [], // Handle if tags are not present
          imageUrl: item.imageUrl,
          favorite: item.favorite,
          lastWorn: item.lastWorn ? new Date(item.lastWorn) : undefined,
        }));

        setClothingItems(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching clothing items:", err);
        setError("Failed to load your closet items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClothingItems();
  }, []);

  const handleAddItem = (newItem: ClothingItem) => {
    setClothingItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
  };

  const filteredItems = clothingItems.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory)
      return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="h-full bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden md:block border-b bg-white">
        <div className="max-w-[100rem] mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Smart Closet</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white 
                       rounded-lg hover:bg-green-600 transition-colors"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus />
              <span>Add New Item</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center 
                     text-white shadow-lg hover:bg-green-600 transition-colors"
        >
          <FaPlus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="max-w-[100rem] mx-auto px-4">
        {/* Search and Filters */}
        <div className="my-6">
          <div className="flex space-x-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your closet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <FaFilter className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category.label}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedCategory(category.label)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg 
                       transition-colors ${
                         selectedCategory === category.label
                           ? "bg-green-500 text-white"
                           : "bg-white text-gray-600 hover:bg-gray-50"
                       }`}
            >
              {category.icon}
              <span className="whitespace-nowrap">{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg my-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">
              <FaTshirt className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Your closet is empty
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory !== "All"
                ? "No items match your current filters"
                : "Add your first clothing item to get started"}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add New Item
            </button>
          </div>
        )}

        {/* Clothing Grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="aspect-square relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {item.favorite && (
                    <div className="absolute top-2 right-2 text-red-500">
                      <FaHeart className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 truncate">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags &&
                      item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddItemModal
            onClose={() => setIsAddModalOpen(false)}
            onAddItem={handleAddItem}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
