"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf } from "react-icons/fa";

interface CardProps {
  color: string;
  delay: number;
  label: string;
  imageUrl?: string;
  index: number;
}

const Card = ({ color, delay, label, imageUrl, index }: CardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={`relative ${
        index === 0 ? "ml-0" : "-ml-[100px] md:-ml-[140px]"
      }`}
      style={{
        zIndex: isHovered ? 50 : index,
      }}
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className={`w-[320px] h-[200px] md:w-[320px] md:h-[200px] 
                   sm:w-[240px] sm:h-[150px] rounded-[20px] shadow-xl 
                   cursor-pointer overflow-hidden
                   ${!imageUrl ? color : ""}`}
        whileHover={{
          scale: 1.1,
          y: -20,
          transition: { duration: 0.3 },
          zIndex: 50,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Card Content */}
        <div className="relative w-full h-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800/10 to-black/20 p-4" />
          )}
        </div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -70, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg
                     hidden md:block" // Hide tooltip on mobile
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 60,
            }}
          >
            <div className="relative">
              <div className="text-gray-800 font-medium whitespace-nowrap">
                {label}
              </div>
              <div
                className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 
                          border-[8px] border-transparent border-t-white/90"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const LandingPage = () => {
  const cards = [
    {
      color: "bg-gradient-to-br from-red-500 to-red-600",
      delay: 0,
      label: "Design Collection",
    },
    {
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      delay: 0.1,

      label: "Art Series",
    },
    {
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      delay: 0.2,
      label: "Digital Prints",
    },
    {
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      delay: 0.3,
      label: "Limited Edition",
    },
    {
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      delay: 0.4,
      label: "Special Release",
    },
    {
      color: "bg-gradient-to-br from-green-500 to-green-600",
      delay: 0.5,
      label: "Creator Series",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section with Background Dots */}
      <div className="relative pt-20 md:pt-32 pb-10 md:pb-20 px-4">
        {/* Background Dots Pattern */}
        <div
          className="absolute -(z-10) inset-0 bg-[radial-gradient(#7cb9e7_1px,transparent_1px)] 
                     [background-size:20px_20px]"
          style={{
            opacity: 0.4,
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-10 md:mb-20"
          >
            Unlock Your Perfect <br />
            Wardrobe - Effortlessly!
          </motion.h1>

          {/* Cards Container with horizontal scroll on mobile */}
          <div className="relative overflow-x-auto md:overflow-x-visible py-10">
            <div
              className="flex justify-start md:justify-center items-center mb-10 md:mb-20 
                          min-w-full px-4 md:px-0"
            >
              <div className="flex items-center transform scale-75 md:scale-100 origin-left md:origin-center">
                {cards.map((card, index) => (
                  <Card
                    key={index}
                    color={card.color}
                    delay={card.delay}
                    label={card.label}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mx-auto mb-8"
          >
            Organize your closet, plan stunning outfits, and style smarter with
            AI-powered tools. From daily looks to sustainable fashion, your
            wardrobe works harder for you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 px-4"
          >
            <button className="px-6 md:px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
              Join for $9.99/m
            </button>
            <button className="px-6 md:px-8 py-3 rounded-full border border-gray-200 hover:border-gray-400 transition-colors">
              Read more
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute rounded-full mix-blend-multiply filter blur-xl bg-blue-100/70 w-[500px] h-[500px] left-[-100px] top-[10%]"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute rounded-full mix-blend-multiply filter blur-xl bg-green-100/70 w-[600px] h-[600px] right-[-200px] top-[20%]"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute rounded-full mix-blend-multiply filter blur-xl bg-purple-100/70 w-[400px] h-[400px] left-[30%] top-[60%]"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};
