"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaTshirt, FaSocks, FaHatCowboy } from "react-icons/fa";
import { GiArmoredPants, GiMonclerJacket } from "react-icons/gi";

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

    // Check if at least one item is selected
    const hasSelectedItem = Object.values(selectedItems).some(
      (item) => item !== null
    );
    if (!hasSelectedItem) {
      setError("Please select at least one clothing item");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgressMessage("Preparing your virtual try-on...");
    setProgressPercent(0);
    setCurrentProcessingItem(null);
    setIntermediateImages([]);
    setGeneratedImage(null);

    try {
      // Prepare the data for the API request
      const selectedItemsArray = Object.values(selectedItems)
        .filter((item) => item !== null)
        .map((item) => ({
          category: item!.category,
          imageUrl: item!.imageUrl,
        }));

      // Send the request to your backend API
      const response = await fetch("/api/virtual-tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          humanImage: fullBodyImage,
          clothingItems: selectedItemsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate try-on image");
      }

      // Process the streaming response
      const reader = response.body?.getReader();
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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Virtual Try-On</h1>

      {!fullBodyImage ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Please upload a full body image in your settings to use the virtual
            try-on feature.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard/settings")}
            className="mt-2 text-sm font-medium text-yellow-700 underline"
          >
            Go to Settings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel - Categories and clothing items */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
            <div className="flex overflow-x-auto mb-4 pb-2">
              {categories.map((category) => (
                <button
                  key={category.label}
                  onClick={() => setSelectedCategory(category.label)}
                  className={`flex flex-col items-center justify-center p-3 mx-1 rounded-lg min-w-[80px] ${
                    selectedCategory === category.label
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-lg mb-1">{category.icon}</span>
                  <span className="text-xs">{category.label}</span>
                </button>
              ))}
            </div>

            <div className="h-[500px] overflow-y-auto">
              {clothingItems[selectedCategory].length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No {selectedCategory.toLowerCase()} found in your closet
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {clothingItems[selectedCategory].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                        selectedItems[selectedCategory as ClothingCategory]
                          ?.id === item.id
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
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle panel - User image and selected items */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Your Selections</h2>

            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="w-64 h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={fullBodyImage}
                  alt="Your full body"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-5 gap-2 w-full">
                {categories.map((category) => (
                  <div
                    key={category.label}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      {selectedItems[category.label] ? (
                        <img
                          src={selectedItems[category.label]!.imageUrl}
                          alt={selectedItems[category.label]!.name}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-gray-400">{category.icon}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {category.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={generateTryOn}
              disabled={isGenerating}
              className="w-full mt-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "Generate Try-On"}
            </button>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Right panel - Generated image */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">Result</h2>

            <div className="w-64 h-80 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  {currentProcessingItem && (
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Processing: {currentProcessingItem}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 text-center">
                    {progressMessage}
                  </p>

                  {/* Show the latest intermediate image if available */}
                  {generatedImage && (
                    <div className="mt-4 w-full h-48 overflow-hidden rounded">
                      <img
                        src={generatedImage}
                        alt="Current progress"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Virtual try-on result"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-sm text-gray-500 text-center px-4">
                  Select clothing items and click "Generate Try-On" to see the
                  result
                </p>
              )}
            </div>

            {/* Show intermediate images carousel if available */}
            {intermediateImages.length > 0 && (
              <div className="mt-4 w-full">
                <p className="text-sm font-medium mb-2">Progress Steps:</p>
                <div className="flex overflow-x-auto space-x-2 pb-2">
                  {intermediateImages.map((img, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-16 h-16 rounded overflow-hidden cursor-pointer"
                      onClick={() => setGeneratedImage(img)}
                    >
                      <img
                        src={img}
                        alt={`Step ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generatedImage && !isGenerating && (
              <button
                onClick={() => setIsFullSizeModalOpen(true)}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                View Full Size
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full Size Image Modal */}
      {isFullSizeModalOpen && generatedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setIsFullSizeModalOpen(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors z-10"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={generatedImage}
                alt="Virtual try-on result full size"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <a
                href={generatedImage}
                download="virtual-tryon-result.jpg"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors mr-4"
              >
                Download Image
              </a>
              <button
                onClick={() => setIsFullSizeModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
