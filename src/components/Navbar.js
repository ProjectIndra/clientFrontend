import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../Api";

const Navbar = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [account, setAccount] = useState({
    profile_image: "/img/profile.png",
  });
  const navRef = useRef();

  const [user, setUser] = useState(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  });

  const [initials, setInitials] = useState(() => {
    if (user?.username) return user.username.slice(0, 2).toUpperCase();
    return "";
  });

  useEffect(() => {
    const fetchAccountDetails = async () => {
      const cachedProfile = localStorage.getItem("indra_profile");
  
      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        setAccount(parsed);
        return;
      }
  
      try {
        const data = await apiCall("get", "/ui/profile/getUserDetails");
        console.log("Account Data:", data);
  
        const newAccount = {
          profile_image: data.profile_image,
          username: data.username,
          profile_name: data.profile_name,
          email: data.email,
        };
  
        setAccount(newAccount);
        localStorage.setItem("indra_profile", JSON.stringify(newAccount));
      } catch (error) {
        console.error("Error fetching account details:", error);
        alert("Error: " + error);
      }
    };
  
    fetchAccountDetails();
  }, []);

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
      if (window.scrollY < lastScrollY) setShowNavbar(true);
      else setShowNavbar(false);
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY]);

  return (
    <header
      ref={navRef}
      className={`w-full px-6 md:px-12 py-4 bg-white flex flex-col md:flex-row justify-between items-start md:items-center fixed top-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Left section */}
      <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
        {/* Logo + Hamburger */}
        <div className="w-full flex justify-between items-center md:mr-10">
          <Link className="text-2xl md:text-3xl font-bold text-[#0a1d39]" to="/home">
            ComputeKart
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-16 text-sm mt-4 md:mt-0 ml-12`}
        >
          {/* Services */}
          <div className="relative group">
            <button
              onMouseOver={() => togglePopup("services")}
              className={`${
                activePopup === "services" ? "text-[#0a1d39] font-semibold" : "text-[#475569]"
              } hover:text-[#0a1d39] text-left w-full`}
            >
              Services
            </button>
            {activePopup === "services" && showNavbar && (
              <div className="absolute top-full left-0 mt-2 w-56 p-2 bg-white rounded-lg shadow-md z-50 flex flex-col">
                <Link className="text-sm hover:bg-lime-300 px-2 py-1 rounded" to="/client/services">
                  Compute-Engine
                </Link>
                <Link className="text-sm hover:bg-lime-300 px-2 py-1 rounded" to="/providersList">
                  Providers
                </Link>
                <Link className="text-sm hover:bg-lime-300 px-2 py-1 rounded" to="/buckets">
                  Buckets
                </Link>
              </div>
            )}
          </div>

          {/* Manage */}
          <div className="relative group">
            <button
              onMouseOver={() => togglePopup("manage")}
              className={`${
                activePopup === "manage" ? "text-[#0a1d39] font-semibold" : "text-[#475569]"
              } hover:text-[#0a1d39] text-left w-full`}
            >
              Manage
            </button>
            {activePopup === "manage" && showNavbar && (
              <div className="absolute top-full left-0 mt-2 w-56 p-2 bg-white rounded-lg shadow-md z-50 flex flex-col">
                {/* <Link className="text-sm hover:bg-lime-300 px-2 py-1 rounded" to="/docs">
                  Setup
                </Link> */}
                <Link className="text-sm hover:bg-lime-300 px-2 py-1 rounded" to="/manage/providers">
                  Manage Providers
                </Link>
                <Link className="text-sm hover:bg-lime-300 px-2 py-1 rounded" to="/manage/clients">
                  Manage Clients
                </Link>
              </div>
            )}
          </div>

          {/* Documentation */}
          <button
            onClick={() => (window.location.href = "/docs")}
            className={`${
              activePopup === "docs" ? "text-[#0a1d39] font-semibold" : "text-[#475569]"
            } hover:text-[#0a1d39] text-left w-full whitespace-nowrap`}
          >
            Documentation
          </button>
        </nav>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-auto flex justify-between md:justify-end items-center mt-4 md:mt-0 space-x-4 md:space-x-16 relative">
        {/* Search Box
        // <div className="relative w-full max-w-sm md:max-w-[300px]">
        //   <input
        //     type="text"
        //     placeholder="Search"
        //     className="w-full px-4 py-2 pr-10 bg-[#f9fbfa] border border-gray-200 text-sm rounded-md focus:outline-none"
        //   />
        //   <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       className="h-4 w-4 text-gray-500"
        //       fill="none"
        //       viewBox="0 0 24 24"
        //       stroke="currentColor"
        //     >
        //       <circle cx="11" cy="11" r="8" strokeWidth="2" />
        //       <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
        //     </svg>
        //   </div>
        // </div> */}

        {/* Avatar */}
        <div className="relative">
          <div
            className="w-10 aspect-square bg-[#004d3c] text-white flex items-center justify-center rounded-full font-bold shrink-0 cursor-pointer overflow-hidden"
            onClick={() => togglePopup("avatar")}
          >
            {account.profile_image ? (
              <img
                src={account.profile_image}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          {activePopup === "avatar" && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => (window.location.href = "/profile")}
              >
                Profile
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  sessionStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
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