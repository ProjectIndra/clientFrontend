import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [activePopup, setActivePopup] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = (popupName) => {
    setActivePopup((prev) => (prev === popupName ? null : popupName));
  };

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY < lastScrollY) {
        setShowNavbar(true); // Scroll Up
      } else {
        setShowNavbar(false); // Scroll Down
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <header
      ref={navRef}
      className={`w-full px-6 md:px-12 py-4 bg-white flex flex-col md:flex-row justify-between items-start md:items-center fixed top-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Left section: Logo + Nav Items */}
      <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
        {/* Logo + Hamburger */}
        <div className="w-full flex justify-between items-center md:mr-10">
          <Link
            className="text-2xl md:text-3xl font-bold text-[#0a1d39]"
            to="/home"
          >
            Indra
          </Link>
          <button
            className="md:hidden text-[#0a1d39] focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          ref={navRef}
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 text-sm mt-4 md:mt-0 ml-12`}
        >
          <button
            onClick={() => {
              if (window.location.pathname !== "/home" && activePopup !== "home") {
                window.location.href = "/home";
                togglePopup("home")
              }
              togglePopup("home")
            }}
            className={`${
              activePopup === "home"
                ? "text-[#0a1d39] font-semibold"
                : "text-[#475569]"
            } hover:text-[#0a1d39] text-left w-full whitespace-nowrap`}
          >
            Home
          </button>
          {/* Services */}
          <div className="relative group">
            <button
              onClick={() => togglePopup("services")}
              className={`${
                activePopup === "services"
                  ? "text-[#0a1d39] font-semibold"
                  : "text-[#475569]"
              } hover:text-[#0a1d39] text-left w-full`}
            >
              Services
            </button>
            {activePopup === "services" && showNavbar && (
              <div className="absolute top-full left-0 mt-2 w-56 p-4 bg-white rounded-lg shadow-md z-50 flex flex-col">
                <Link
                  className="text-sm text-left w-full hover:bg-gray-100 px-2 py-1 rounded"
                  to="/client/services"
                >
                  Compute-Engine
                </Link>
                <Link
                  className="text-sm text-left w-full hover:bg-gray-100 px-2 py-1 rounded"
                  to="/providersList"
                >
                  Providers
                </Link>

                <Link
                  className="text-sm text-left w-full hover:bg-gray-100 px-2 py-1 rounded"
                  to="/buckets"
                >
                  Buckets
                </Link>
              </div>
            )}
          </div>

          {/* Manage */}
          <div className="relative group">
            <button
              onClick={() => togglePopup("manage")}
              className={`${
                activePopup === "manage"
                  ? "text-[#0a1d39] font-semibold"
                  : "text-[#475569]"
              } hover:text-[#0a1d39] text-left w-full`}
            >
              Manage
            </button>
            {activePopup === "manage" && showNavbar && (
              <div className="absolute top-full left-0 mt-2 w-56 p-4 bg-white rounded-lg shadow-md z-50 flex flex-col">
                <Link
                  className="text-sm text-left w-full hover:bg-gray-100 px-2 py-1 rounded"
                  to="/client/services"
                >
                  Setup
                </Link>

                <Link
                  className="text-sm text-left w-full hover:bg-gray-100 px-2 py-1 rounded"
                  to="/manage/providers"
                >
                  Manage Providers
                </Link>
                <Link
                  className="text-sm text-left w-full hover:bg-gray-100 px-2 py-1 rounded"
                  to="/client/services"
                >
                  Manage Clients
                </Link>
              </div>
            )}
          </div>

          {/* Installation Guide */}
          <button
            onClick={() => togglePopup("installation")}
            className={`${
              activePopup === "installation"
                ? "text-[#0a1d39] font-semibold"
                : "text-[#475569]"
            } hover:text-[#0a1d39] text-left w-full whitespace-nowrap`}
          >
            Installation Guide
          </button>
        </nav>
      </div>

      {/* Right Section: Search + Avatar */}
      <div className="w-full md:w-auto flex justify-between md:justify-end items-center mt-4 md:mt-0 space-x-4 md:space-x-16 relative">
        {/* Search Box */}
        <div className="relative w-full max-w-sm md:max-w-[300px]">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 pr-10 bg-[#f9fbfa] border border-gray-200 text-sm rounded-md focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Avatar with Dropdown */}
        <div className="relative">
          <div
            className="w-10 aspect-square bg-[#004d3c] text-white flex items-center justify-center rounded-full font-bold shrink-0 cursor-pointer"
            onClick={() => togglePopup("avatar")}
          >
            DS
          </div>
          {activePopup === "avatar" && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  window.location.href = "/profile";
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.755 6.879 2.046M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Profile
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l.564 1.737a1 1 0 00.95.69h1.824c.969 0 1.371 1.24.588 1.81l-1.475 1.073a1 1 0 00-.364 1.118l.564 1.737c.3.921-.755 1.688-1.538 1.118L12 11.347l-1.475 1.073c-.783.57-1.838-.197-1.538-1.118l.564-1.737a1 1 0 00-.364-1.118L7.712 7.164c-.783-.57-.38-1.81.588-1.81h1.824a1 1 0 00.95-.69l.564-1.737z"
                  />
                </svg>
                Settings
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  window.location.href = "/login";
                  sessionStorage.removeItem("token");
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
