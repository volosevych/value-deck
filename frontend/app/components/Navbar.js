"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (route) => pathname === route;

  const handleSearch = () => {
    if (!searchQuery.trim()) return; // Prevent empty searches
    router.push(`/results?query=${encodeURIComponent(searchQuery)}`); // Navigate to results page
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change navbar style after scrolling 50px
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
              alt="Value Deck Logo"
            />
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 text-white text-lg ml-6">
            {[
              { name: "Home", path: "/" },
              { name: "Explore", path: "/explore" },
              { name: "About", path: "/about" },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`${
                    isActive(link.path)
                      ? "text-green font-bold"
                      : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Search Bar */}
        <div className="flex items-center flex-grow ml-28">
          <MagnifyingGlassIcon
            className="h-6 w-6 text-gray-500 mr-4"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find your favorite card..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            onKeyDown={handleKeyDown} // Handle Enter key
            aria-label="Search"
          />

          {/* Sign In and Log In Buttons */}
          <div className="flex items-center space-x-4 ml-8">
            <button
              className="whitespace-nowrap bg-green p-2 rounded-md text-lg hover:text-black hover:bg-white transition-colors"
              onClick={() => router.push("/signin")} // Redirect to Sign In
              aria-label="Sign In"
            >
              Sign In
            </button>

            <button
              className="whitespace-nowrap bg-green p-2 rounded-md text-lg hover:text-black hover:bg-white transition-colors"
              onClick={() => router.push("/login")} // Redirect to Log In
              aria-label="Log In"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
