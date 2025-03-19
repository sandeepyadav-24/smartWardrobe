"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CREDIT_PACKAGES = [
  { credits: 50, price: 5 },
  { credits: 100, price: 9 },
  { credits: 200, price: 15 },
  { credits: 500, price: 35 },
];

export default function CreditPurchase() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (credits: number) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error initiating purchase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Purchase Credits
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CREDIT_PACKAGES.map((pkg) => (
          <motion.button
            key={pkg.credits}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePurchase(pkg.credits)}
            disabled={isLoading}
            className="p-4 border border-blue-100 rounded-xl hover:border-blue-300 
                     transition-colors duration-200"
          >
            <div className="text-2xl font-bold text-blue-600">
              {pkg.credits}
            </div>
            <div className="text-sm text-gray-600">Credits</div>
            <div className="text-lg font-semibold text-gray-900">
              ${pkg.price}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
