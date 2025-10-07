import React from 'react';
import { Facebook, Youtube, Linkedin } from 'lucide-react';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center space-y-6">

          {/* Logo */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Car<span className="text-orange-500">vo</span>
            </h2>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-300 transition-shadow duration-300 group"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
            </a>

            <a
              href="#"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-300 transition-shadow duration-300 group"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
            </a>

            <a
              href="#"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-300 transition-shadow duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-blue-700 transition-colors duration-300" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 font-semibold text-sm">
              Copyright © Carvo 2025. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
