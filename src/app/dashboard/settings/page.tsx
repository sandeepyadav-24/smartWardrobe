"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaCamera, FaEdit, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [fullBodyImage, setFullBodyImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameEdit = async () => {
    if (isEditingName) {
      // Save the name
      try {
        // Here you would typically update the name in your database
        // For now, we'll just update the session
        await update({ name });
        setIsEditingName(false);
      } catch (error) {
        console.error("Failed to update name:", error);
      }
    } else {
      setIsEditingName(true);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "fullBody");

      // Send the file to your API
      const response = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFullBodyImage(data.imageUrl);

      // Update the user's profile with the full body image URL
      // This would typically be stored in your database
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#f8fafc]">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0  bg-white/80 backdrop-blur-sm border-b 
                 border-gray-100 px-4 sm:px-8 py-4"
      >
        <div className="max-w-[1200px] mx-auto">
          <h1
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 
                       to-gray-600 bg-clip-text text-transparent"
          >
            Settings
          </h1>
        </div>
      </motion.div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="max-w-[1200px] mx-auto space-y-4 sm:space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 
                     overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Profile Settings
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Manage your personal information and preferences
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Name Setting */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Display Name
                  </p>
                  {isEditingName ? (
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 
                                 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNameEdit}
                        className="p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 
                                 transition-all duration-200 flex-shrink-0"
                      >
                        <FaCheck size={18} />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base text-gray-900">
                        {session?.user?.name || "Not set"}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNameEdit}
                        className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 
                                 transition-all duration-200 flex-shrink-0"
                      >
                        <FaEdit size={18} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Setting */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  Email Address
                </p>
                <p className="text-base text-gray-900 break-all">
                  {session?.user?.email || "Not set"}
                </p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>
          </motion.div>

          {/* Virtual Try-On Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 
                     overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Virtual Try-On Settings
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Configure your virtual try-on experience
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-6">
                {/* Full Body Image Upload */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    Full Body Image
                  </p>
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-start 
                               space-y-4 sm:space-y-0 sm:space-x-6"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative w-full sm:w-64 h-[500px] bg-gray-50 rounded-xl 
                               overflow-hidden shadow-sm group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {fullBodyImage ? (
                        <>
                          <img
                            src={fullBodyImage}
                            alt="Full body"
                            className="w-full h-full object-contain bg-gray-100"
                          />
                          <div
                            className="absolute inset-0 bg-black/50 opacity-0 
                                       group-hover:opacity-100 transition-opacity duration-200 
                                       flex items-center justify-center"
                          >
                            <FaCamera className="text-white text-2xl" />
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-4">
                          <FaCamera className="text-3xl text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 text-center">
                            Click to upload your full body image
                          </p>
                        </div>
                      )}

                      {isUploading && (
                        <div
                          className="absolute inset-0 bg-black/50 flex items-center 
                                     justify-center"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-6 h-6 border-2 border-white/30 border-t-white 
                                     rounded-full"
                          />
                        </div>
                      )}
                    </motion.div>

                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-gray-600">
                        Upload a clear, well-lit full body photo for the best
                        virtual try-on results.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Stand against a plain background</li>
                        <li>• Ensure good lighting</li>
                        <li>• Wear fitted clothing</li>
                        <li>• Face the camera directly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 
                     overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Preferences
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Customize your app experience
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Email Notifications */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between 
                           space-y-2 sm:space-y-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Receive updates about new features and recommendations
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative inline-flex h-6 w-11 items-center rounded-full 
                           bg-gray-200 transition-colors duration-200"
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white 
                                 transition-transform duration-200 translate-x-1"
                  />
                </motion.button>
              </div>

              {/* Theme Preference */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between 
                           space-y-2 sm:space-y-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">Theme</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose your preferred color theme
                  </p>
                </div>
                <select
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                               text-sm text-gray-700 focus:outline-none focus:ring-2 
                               focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
