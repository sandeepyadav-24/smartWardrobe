"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLeaf } from "react-icons/fa";
//import { signInWithGoogle, signOut } from "@/lib/supabase";
//import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  //const { user, loading } = useAuth();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  {
    /**const handleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (!error) {
      router.push("/dashboard");
    } else {
      console.error("Error signing in:", error);
    }
  }; */
  }

  {
    /**const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }; */
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
                ${
                  scrolled
                    ? "bg-white/70 backdrop-blur-lg shadow-sm"
                    : "bg-transparent"
                }`}
    >
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <FaLeaf className="text-green-500 text-2xl" />
          <span className="text-xl font-bold">tryon</span>
        </div>

        <div className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="hover:text-green-500 transition-colors"
          >
            Get Started
          </a>
          <a href="#create" className="hover:text-green-500 transition-colors">
            Create Strategy
          </a>
          <a href="#pricing" className="hover:text-green-500 transition-colors">
            Pricing
          </a>
          <a href="#contact" className="hover:text-green-500 transition-colors">
            Contact
          </a>
          <a
            href="#solution"
            className="hover:text-green-500 transition-colors"
          >
            Solution
          </a>
        </div>

        {/**<div className="flex items-center space-x-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleSignOut}
                    className="px-6 py-2 rounded-full bg-black text-white 
                             hover:bg-gray-800 transition-colors"
                  >
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSignIn}
                  className="px-6 py-2 rounded-full bg-black text-white 
                           hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </motion.button>
              )}
            </>
          )}
          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div> */}
      </div>
    </nav>
  );
};
