"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter for navigation
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  const isActive = (route) => pathname === route;

  const handleSearch = () => {
    if (!searchQuery.trim()) return; // Prevent empty searches
    router.push(`/results?query=${encodeURIComponent(searchQuery)}`); // Redirect with query parameter
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50); // Detect if the user has scrolled 50px or more
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`px-4 sticky top-0 z-[100] ${
        isScrolled ? "bg-black shadow-md" : "bg-gray"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between">
        {/* Logo and Nav Links */}
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/">
            <img
              src="/nav/logo.png"
              className="w-[170px] h-auto"
              alt="Logo"
            />
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 text-white text-lg ml-6">
            <li>
              <Link
                href="/"
                className={`${
                  isActive("/") ? "text-green font-bold" : "text-white"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/explore"
                className={`${
                  isActive("/explore") ? "text-green font-bold" : "text-white"
                }`}
              >
                Explore
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`${
                  isActive("/about") ? "text-green font-bold" : "text-white"
                }`}
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Search Bar */}
        <div className="flex items-center flex-grow ml-28">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 mr-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find your favorite card..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            onKeyDown={handleKeyDown} // Listen for the Enter key
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
