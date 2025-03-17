"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaRobot,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

// Floating Background Element Component
const FloatingElement = ({
  size,
  color,
  position,
  delay,
}: {
  size: number;
  color: string;
  position: { top: string; left: string };
  delay: number;
}) => (
  <motion.div
    className={`absolute rounded-full mix-blend-multiply filter blur-xl ${color}`}
    style={{
      width: size,
      height: size,
      top: position.top,
      left: position.left,
    }}
    animate={{
      y: [0, 50, 0],
      x: [0, 30, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const FeatureCard = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -10 }}
      className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-lg hover:shadow-xl 
                 transition-all border border-gray-100/20 relative overflow-hidden
                 group"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.2 + 0.3 }}
        className="text-4xl mb-6 text-green-500 bg-green-50/50 p-4 rounded-2xl inline-block
                   group-hover:bg-green-100/80 transition-colors"
      >
        {icon}
      </motion.div>

      <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>

      <div
        className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-50/50 
                    rounded-full opacity-50 blur-2xl group-hover:opacity-70 transition-opacity"
      />
    </motion.div>
  );
};

export const Feature = () => {
  const features = [
    {
      icon: <FaCloudUploadAlt />,
      title: "Smart Closet",
      description: "Upload, organize, and tag your clothes in minutes.",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Outfit Planner",
      description: "Plan your week or pack for travel effortlessly.",
    },
    {
      icon: <FaRobot />,
      title: "AI Stylist",
      description: "Get daily outfit ideas tailored to your style & weather.",
    },
    {
      icon: <FaChartLine />,
      title: "Wardrobe Tracker",
      description: "Declutter and optimize with usage and cost insights.",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingElement
        size={400}
        color="#E1E8FF"
        position={{ top: "10%", left: "-5%" }}
        delay={0}
      />
      <FloatingElement
        size={300}
        color="#E1E8FF"
        position={{ top: "60%", left: "60%" }}
        delay={1}
      />
      <FloatingElement
        size={200}
        color="#E1E8FF"
        position={{ top: "30%", left: "80%" }}
        delay={2}
      />

      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#E1E8FF_1px,transparent_1px)] 
                    [background-size:20px_20px] opacity-30"
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent 
                       bg-gradient-to-r from-gray-800 to-gray-600"
          >
            Revolutionize Your Wardrobe
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of fashion management with our intelligent
            features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {features.map((feature, index) => (
            <FeatureCard key={index} index={index} {...feature} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <button
            className="px-8 py-4 bg-black text-white rounded-full 
                           hover:bg-gray-800 transition-colors shadow-lg
                           hover:shadow-xl transform hover:-translate-y-1"
          >
            Try All Features
          </button>
        </motion.div>
      </div>
    </section>
  );
};
