'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, ChevronDown, X, Menu, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearAuthCookies, getUserInfo } from '@/app/lib/cookies';

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export default function Navbar() {
    const [servicesOpen, setServicesOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Helper function to check if a path is active
    const isActive = (path: string) => {
        if (path === '/customer' || path === '/customer/dashboard') {
            return pathname === '/customer' || pathname === '/customer/dashboard';
        }
        return pathname?.startsWith(path);
    };

    useEffect(() => {
        // Get user info from cookie
        const storedUserInfo = getUserInfo();
        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
        }
    }, []);

    const handleLogout = () => {
        // Clear auth cookies
        clearAuthCookies();
        
        // Navigate to home page
        router.replace('/');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileServicesOpen(false);
    };

    return (
        <>
            <nav className="bg-[#1a1a1a] text-white py-4 px-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Car<span className="text-orange-500">vo</span>
                        </h2>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8 flex-1">
                        <Link
                            href="/customer/dashboard"
                            className={`${isActive('/customer/dashboard') || isActive('/customer') ? 'text-orange-500' : 'text-white'} hover:text-orange-400 transition-colors uppercase text-sm font-medium`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/customer/aboutus"
                            className={`${isActive('/customer/aboutus') ? 'text-orange-500' : 'text-white'} hover:text-orange-400 transition-colors uppercase text-sm font-medium`}
                        >
                            About
                        </Link>

                        {/* Services Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setServicesOpen(true)}
                            onMouseLeave={() => setServicesOpen(false)}
                        >
                            <button className={`flex items-center gap-1 ${isActive('/customer/shopServices') ? 'text-orange-500' : 'text-white'} hover:text-orange-400 transition-colors uppercase text-sm font-medium`}>
                                Services
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {servicesOpen && (
                                <div className="absolute top-full left-0 pt-2 w-48 z-50">
                                    <div className="bg-[#2a2a2a] rounded shadow-lg py-2">
                                        <Link href="/customer/shopServices/vehicleRepair" className="block px-4 py-2 hover:bg-orange-500 transition-colors text-sm">
                                            Vehicle Repair
                                        </Link>
                                        <Link href="/customer/shopServices/vehicleService" className="block px-4 py-2 hover:bg-orange-500 transition-colors text-sm">
                                            Vehicle Servicing
                                        </Link>
                                        <Link href="/customer/shopServices/collisionRepair" className="block px-4 py-2 hover:bg-orange-500 transition-colors text-sm">
                                            Collision Repair
                                        </Link>
                                        <Link href="/customer/shopServices/autoDetailing" className="block px-4 py-2 hover:bg-orange-500 transition-colors text-sm">
                                            Auto Detailing
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/customer/myAppointments"
                            className={`${isActive('/customer/myAppointments') ? 'text-orange-500' : 'text-white'} hover:text-orange-400 transition-colors uppercase text-sm font-medium`}
                        >
                            My Appointments
                        </Link>

                        <Link
                            href="/customer/vehicleProjects"
                            className={`${isActive('/customer/vehicleProjects') ? 'text-orange-500' : 'text-white'} hover:text-orange-400 transition-colors uppercase text-sm font-medium`}
                        >
                            My Vehicles
                        </Link>
                    </div>

                    {/* Desktop Right Section - Phone Button + Profile */}
                    <div className="hidden md:flex items-center gap-4 ml-auto">
                        {/* Phone Button */}
                        <Link
                            href="tel:+9441225678"
                            className="flex items-center gap-2 bg-transparent border border-gray-600 rounded-full px-4 py-2 hover:bg-orange-500 hover:border-orange-500 transition-all duration-200"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="text-sm font-medium">+94 412 25 678</span>
                        </Link>

                        {/* Profile Icon with Dropdown */}
                        {userInfo && (
                            <div
                                className="relative"
                                onMouseEnter={() => setProfileDropdownOpen(true)}
                                onMouseLeave={() => setProfileDropdownOpen(false)}
                            >
                                <button className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
                                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-white font-bold text-sm">
                                            {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-white">
                                        {userInfo.firstName} {userInfo.lastName}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute top-full right-0 pt-2 w-64 z-50">
                                        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-xl shadow-2xl py-2 border border-gray-700/50 overflow-hidden">
                                            <div className="px-5 py-4 border-b border-gray-700/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                                        <span className="text-white font-bold text-lg">
                                                            {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate">
                                                            {userInfo.firstName} {userInfo.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5 truncate">{userInfo.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 transition-all duration-200 text-sm text-left group"
                                            >
                                                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                                                <span className="text-gray-300 group-hover:text-white font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white z-50"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-[#1a1a1a] text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Car<span className="text-orange-500">vo</span>
                        </h2>
                    </div>
                    <button onClick={closeMobileMenu}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Sidebar Menu Items */}
                <div className="overflow-y-auto h-[calc(100%-80px)] p-6">
                    <div className="space-y-2">
                        <Link
                            href="/customer/dashboard"
                            className={`block px-4 py-3 ${isActive('/customer/dashboard') || isActive('/customer') ? 'text-orange-500 bg-[#2a2a2a]' : 'text-white'} hover:bg-[#2a2a2a] hover:text-orange-400 transition-colors uppercase text-sm font-medium rounded`}
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>

                        <Link
                            href="/customer/aboutus"
                            className={`block px-4 py-3 ${isActive('/customer/aboutus') ? 'text-orange-500 bg-[#2a2a2a]' : 'text-white'} hover:bg-[#2a2a2a] hover:text-orange-400 transition-colors uppercase text-sm font-medium rounded`}
                            onClick={closeMobileMenu}
                        >
                            About
                        </Link>

                        {/* Mobile Services Dropdown */}
                        <div>
                            <button
                                className={`w-full flex items-center justify-between px-4 py-3 ${isActive('/customer/shopServices') ? 'text-orange-500 bg-[#2a2a2a]' : 'text-white'} hover:bg-[#2a2a2a] hover:text-orange-400 transition-colors uppercase text-sm font-medium rounded`}
                                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                            >
                                Services
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-48' : 'max-h-0'}`}>
                                <div className="pl-4 py-1 space-y-1">
                                    <Link
                                        href="/customer/shopServices/vehicleRepair"
                                        className="block px-4 py-2 text-sm hover:text-orange-500 transition-colors rounded hover:bg-[#2a2a2a]"
                                        onClick={closeMobileMenu}
                                    >
                                        Vehicle Repair
                                    </Link>
                                    <Link
                                        href="/customer/shopServices/vehicleService"
                                        className="block px-4 py-2 text-sm hover:text-orange-500 transition-colors rounded hover:bg-[#2a2a2a]"
                                        onClick={closeMobileMenu}
                                    >
                                        Vehicle Servicing
                                    </Link>
                                    <Link
                                        href="/customer/shopServices/collisionRepair"
                                        className="block px-4 py-2 text-sm hover:text-orange-500 transition-colors rounded hover:bg-[#2a2a2a]"
                                        onClick={closeMobileMenu}
                                    >
                                        Collision Repair
                                    </Link>
                                    <Link
                                        href="/customer/shopServices/autoDetailing"
                                        className="block px-4 py-2 text-sm hover:text-orange-500 transition-colors rounded hover:bg-[#2a2a2a]"
                                        onClick={closeMobileMenu}
                                    >
                                        Auto Detailing
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/customer/myAppointments"
                            className={`block px-4 py-3 ${isActive('/customer/myAppointments') ? 'text-orange-500 bg-[#2a2a2a]' : 'text-white'} hover:bg-[#2a2a2a] hover:text-orange-400 transition-colors uppercase text-sm font-medium rounded`}
                            onClick={closeMobileMenu}
                        >
                            My Appointments
                        </Link>

                        <Link
                            href="/customer/vehicleProjects"
                            className={`block px-4 py-3 ${isActive('/customer/vehicleProjects') ? 'text-orange-500 bg-[#2a2a2a]' : 'text-white'} hover:bg-[#2a2a2a] hover:text-orange-400 transition-colors uppercase text-sm font-medium rounded`}
                            onClick={closeMobileMenu}
                        >
                            My Vehicles
                        </Link>

                        {/* Mobile Phone Button */}
                        <Link
                            href="tel:+9441225678"
                            className="flex items-center justify-center gap-2 mt-6 bg-orange-500 text-white rounded-full px-5 py-3 hover:bg-orange-600 transition-all"
                            onClick={closeMobileMenu}
                        >
                            <Phone className="w-4 h-4" />
                            <span className="text-sm font-medium">+94 412 25 678</span>
                        </Link>

                        {/* Mobile Profile Section */}
                        {userInfo && (
                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <div className="px-4 py-3 bg-[#2a2a2a] rounded-lg mb-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {userInfo.firstName} {userInfo.lastName}
                                            </p>
                                            <p className="text-xs text-gray-400">{userInfo.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMobileMenu();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white rounded-full px-5 py-3 hover:bg-red-700 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}