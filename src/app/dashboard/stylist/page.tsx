"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaTshirt,
  FaSun,
  FaCloud,
  FaSnowflake,
  FaUmbrella,
  FaArrowRight,
} from "react-icons/fa";

type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
  options?: string[];
};

type ConversationStage =
  | "initial"
  | "purpose"
  | "occasion"
  | "weather"
  | "style"
  | "recommendations";

export default function AIStylistPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm your AI Stylist. Let me help you find the perfect outfit. What's the purpose of your outfit today?",
      options: ["Work", "Casual", "Special Event", "Date Night"],
    },
  ]);
  const [currentStage, setCurrentStage] =
    useState<ConversationStage>("initial");
  const [isTyping, setIsTyping] = useState(false);

  const handleOptionSelect = async (option: string) => {
    // Add user's selection to messages
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: option,
      },
    ]);

    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add AI's response based on the current stage
    let nextMessage: Message = { id: "", type: "ai", content: "" };

    switch (currentStage) {
      case "initial":
        nextMessage = {
          id: Date.now().toString(),
          type: "ai",
          content: "Great! Could you tell me more about the specific occasion?",
          options: ["Meeting", "Presentation", "Dinner", "Party", "Wedding"],
        };
        setCurrentStage("occasion");
        break;
      case "occasion":
        nextMessage = {
          id: Date.now().toString(),
          type: "ai",
          content: "What's the weather like for this occasion?",
          options: ["Sunny", "Rainy", "Cold", "Hot"],
        };
        setCurrentStage("weather");
        break;
      case "weather":
        nextMessage = {
          id: Date.now().toString(),
          type: "ai",
          content: "Let me curate the perfect outfit for you...",
        };
        setCurrentStage("recommendations");
        // Simulate outfit generation
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: "ai",
              content: "I've selected these pieces for you:",
            },
          ]);
        }, 2000);
        break;
    }

    setIsTyping(false);
    setMessages((prev) => [...prev, nextMessage]);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#f8fafc]">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0  bg-white/80 backdrop-blur-sm border-b 
                 border-gray-100 px-4 md:px-8 py-4"
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <h1
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 
                       to-gray-600 bg-clip-text text-transparent"
          >
            AI Stylist
          </h1>
          <div className="flex items-center gap-2">
            <FaRobot className="text-green-500 text-xl" />
            <span className="text-sm text-gray-600 hidden sm:inline">
              Your Personal Style Assistant
            </span>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-[800px] mx-auto">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.type === "user"
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-100 shadow-sm"
                    }`}
                  >
                    <p className="text-sm md:text-base">{message.content}</p>

                    {message.options && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 grid grid-cols-2 gap-2"
                      >
                        {message.options.map((option) => (
                          <motion.button
                            key={option}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionSelect(option)}
                            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 
                                     rounded-xl text-sm text-gray-700 transition-all 
                                     duration-200"
                          >
                            {option}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 px-4 py-2 bg-gray-100 rounded-full w-16"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
