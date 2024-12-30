"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (route) => pathname === route;

  return (
    <nav className="bg-gray px-4 py-3">
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <div>
          <img src="/nav/logo.svg" className="w-[130px] h-[130px]" alt="Logo" />
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-white focus:outline-none z-50"
          onClick={toggleMenu}
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          className={`md:flex text-white md:space-x-6 md:items-center absolute md:static left-0 w-full md:w-auto bg-black md:bg-transparent ${
            isOpen ? "top-0 opacity-100" : "top-[-200px] opacity-0 md:opacity-100 md:top-0"
          } transition-all duration-300 ease-in-out z-40`}
        >
          <li className="nav-item">
            <Link href="/" className={`nav-link ${isActive("/") ? "text-blue-500" : "text-white"}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/explore"
              className={`nav-link ${isActive("/explore") ? "text-blue-500" : "text-white"}`}
            >
              Explore
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/about"
              className={`nav-link ${isActive("/about") ? "text-blue-500" : "text-white"}`}
            >
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
