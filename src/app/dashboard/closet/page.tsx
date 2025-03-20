"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaPlus,
  FaSearch,
  FaTshirt,
  FaShoePrints,
  FaHatCowboy,
  FaSocks,
  FaHeart,
  FaTimes,
  FaCamera,
  FaUpload,
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

interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  tags: string[];
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
  const [imageLoading, setImageLoading] = useState(false);

  const availableTags = [
    "Casual",
    "Formal",
    "Party",
    "Office",
    "Summer",
    "Winter",
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      try {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error(
            "File size too large. Please choose an image under 5MB."
          );
        }
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setImageLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(error instanceof Error ? error.message : "Error uploading image");
        setImageLoading(false);
      }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 max-h-screen overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-lg"
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 md:p-6 space-y-4 md:space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-bold">Add New Item</h2>
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
            <div className="flex justify-center p-4 border-2 border-dashed rounded-lg relative">
              {imageLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              )}
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={160}
                    height={160}
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
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
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
                  <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ClothingCategory>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/auth/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/clothing");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch clothing items"
          );
        }

        const { data } = await response.json();
        const transformedData = data.map((item: ClothingItem) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          tags: item.tags || [],
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const categories: { label: ClothingCategory; icon: React.ReactNode }[] = [
    { label: "All", icon: <FaTshirt /> },
    { label: "Tops", icon: <FaTshirt /> },
    { label: "Bottoms", icon: <FaSocks /> },
    { label: "Shoes", icon: <FaShoePrints /> },
    { label: "Accessories", icon: <FaHatCowboy /> },
    { label: "Outerwear", icon: <FaShoePrints /> },
  ];

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
    <div className="w-full min-h-screen bg-white">
      {/* Sticky Header Section */}
      <div className="sticky top-0 left-0 right-0 z-10 bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Smart Closet</h1>
          <button
            onClick={() => {
              /* handle menu toggle */
            }}
            className="text-gray-600 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        {/* Search Bar */}
        <div className="px-4 py-2 border-b border-gray-100 w-full">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your closet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="border-b border-gray-100 w-full">
          <div className="px-4 py-2 flex space-x-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => setSelectedCategory(category.label)}
                className={`flex-none px-4 py-2 rounded-full whitespace-nowrap text-sm
                  ${
                    selectedCategory === category.label
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full pb-20">
        <div className="p-4">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg my-4">
              {error}
            </div>
          )}

          {/* Clothing Grid */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={item.imageUrl}
                      width={500}
                      height={500}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />

                    {item.favorite && (
                      <div className="absolute top-2 right-2 text-red-500">
                        <FaHeart />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </h3>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                <FaTshirt className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Your closet is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first clothing item to get started
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Add New Item
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <FaPlus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Item Modal */}
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
