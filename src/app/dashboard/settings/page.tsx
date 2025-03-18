"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaCamera, FaEdit, FaCheck } from "react-icons/fa";

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <div className="space-y-6">
          {/* Name */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              {isEditingName ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              ) : (
                <p className="font-medium">
                  {session?.user?.name || "Not set"}
                </p>
              )}
            </div>
            <button
              onClick={handleNameEdit}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full"
            >
              {isEditingName ? <FaCheck /> : <FaEdit />}
            </button>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{session?.user?.email || "Not set"}</p>
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Full Body Image</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload a full body image for virtual try-on features
        </p>

        <div className="flex flex-col items-center">
          <div
            className="w-64 h-80 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {fullBodyImage ? (
              <img
                src={fullBodyImage}
                alt="Full body"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <FaCamera className="text-4xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload image</p>
              </>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="loader"></div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            {fullBodyImage ? "Change Image" : "Upload Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
