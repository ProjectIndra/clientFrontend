import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAccount from "../hooks/useAccount";
import AvatarMenu from "./AvatarMenu";
import NavbarMenu from "./NavbarMenu";
import useNavbarScroll from "../hooks/useNavbarScroll";
import { getInitials } from "../utils/userUtils";
import useClickOutside from "../hooks/useClickOutside";

import { apiCall } from "../Api";
import { AuthHandler } from "../utils/authHandler";

const Navbar = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef();
  const { account } = useAccount();
  const showNavbar = useNavbarScroll();

  const initials = getInitials(account?.username);
  
  useClickOutside(navRef, () => setActivePopup(null));


  const togglePopup = (popupName) => {
    setActivePopup((prev) => (prev === popupName ? null : popupName));
  };

  return (
    <header ref={navRef} className={`w-full px-6 md:px-20 py-4 bg-white flex flex-col md:flex-row justify-between items-start md:items-center fixed top-0 z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
      
      {/* Left section */}
      <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
        
        {/* Logo + Hamburger */}
        <div className="w-full flex justify-between items-center md:mr-10">
          <Link
            className="text-2xl md:text-3xl font-bold text-[#0a1d39]"
            to="/home"
          >
            <img src="/img/logo-Navbar.svg" alt="" className="h-4 md:h-8" />
          </Link>

          <button
            className="md:hidden text-[#0a1d39] focus:outline-none"
            onClick={() => setMobileMenuOpen(prev => !prev)}
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

        {/* Navigation */}
        <NavbarMenu
          mobileMenuOpen={mobileMenuOpen}
          activePopup={activePopup}
          togglePopup={togglePopup}
          showNavbar={showNavbar}
        />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-auto flex justify-between md:justify-end items-center mt-4 md:mt-0 space-x-4 md:space-x-16 relative">

        {/* Search Box */}
        {/* <div className="relative w-full max-w-sm md:max-w-[300px]">
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
        </div> */}

        {/* Avatar */}
        <AvatarMenu account={account} initials={initials} togglePopup={togglePopup} activePopup={activePopup} />

        <div className="relative">
          <div
            className="w-10 aspect-square bg-[#004d3c] text-white flex items-center justify-center rounded-full font-bold shrink-0 cursor-pointer overflow-hidden"
            onClick={() => togglePopup('avatar')}
          >
            {account.profile_image ? (
              <img
                src={account?.profile_image}
                alt="Avatar"
                className="w-full h-full object-cover border-2 border-lime-300 rounded-full"
              />
            ) : (
              initials
            )}
          </div>
          {activePopup === 'avatar' && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-lime-100"
                onClick={() => (window.location.href = '/profile')}
              >
                Profile
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                 AuthHandler.logout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
};

export default Navbar;