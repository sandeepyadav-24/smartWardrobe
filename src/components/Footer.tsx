"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: string[];
}) => (
  <div className="mb-8 md:mb-0">
    <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <a
            href="#"
            className="text-gray-600 hover:text-green-500 transition-colors"
          >
            {link}
          </a>
        </motion.li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Use Cases", "Updates"],
    },
    {
      title: "Resources",
      links: ["Blog", "Style Guide", "Documentation", "Help Center"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Contact"],
    },
  ];

  const socialLinks = [
    { icon: <FaTwitter />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaLinkedin />, href: "#" },
    { icon: <FaGithub />, href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex items-center space-x-2 mb-4">
                <FaLeaf className="text-green-500 text-2xl" />
                <span className="text-xl font-bold">EcoWardrobe</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-sm">
                Revolutionizing your wardrobe with AI-powered organization and
                styling. Join us in making fashion more sustainable.
              </p>
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ y: -3 }}
                    className="text-gray-600 hover:text-green-500 transition-colors"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <FooterSection
              key={index}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 mt-8 border-t border-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2024 EcoWardrobe. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-green-500 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-green-500 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-green-500 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
