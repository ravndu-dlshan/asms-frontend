import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <footer className=" text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-18">

          {/* About Us Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">
              ABOUT US
              <div className="w-12 h-0.5 bg-orange-500 mt-2"></div>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Carvo is a customer- and employee-focused automobile service management app. 
              We provide professional maintenance, diagnostic, and repair services to ensure 
              your vehicle stays in top condition. Trusted by car owners and service centers alike.
            </p>
            
            {/* Logo */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Car<span className="text-orange-500">vo</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">
              QUICK LINKS
              <div className="w-12 h-0.5 bg-orange-500 mt-2"></div>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">Home</a>
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">Services</a>
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">Book Service</a>
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">About Us</a>
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">Contact</a>
              </div>
              <div className="space-y-3">
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">Testimonials</a>
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">FAQ</a>
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">Pricing</a>
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-white hover:text-orange-500 transition-colors">Terms & Conditions</a>
              </div>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">
              CONTACT US
              <div className="w-12 h-0.5 bg-orange-500 mt-2"></div>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  15 Carvo Street, Negombo, Sri Lanka
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <a href="tel:+94776909756" className="text-white hover:text-orange-500 transition-colors">
                  +94 44 122 5678
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <a href="mailto:info@carvo.com" className="text-white hover:text-orange-500 transition-colors">
                  info@carvo.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default ContactSection;
