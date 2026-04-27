import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAccount from "../hooks/useAccount";
import AvatarMenu from "./AvatarMenu";
import NavbarMenu from "./NavbarMenu";
import useNavbarScroll from "../hooks/useNavbarScroll";
import { getInitials } from "../utils/userUtils";
import useClickOutside from "../hooks/useClickOutside";
import {MenuIcon, CloseIcon, LogoNavbar} from "../utils/icons";

const Navbar = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navRef = useRef();
  const { account } = useAccount();
  const showNavbar = useNavbarScroll();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const initials = getInitials(account?.username);
  
  useClickOutside(navRef, () => {
    setActivePopup(null);
    setMobileMenuOpen(false);
  });

  const togglePopup = (popupName) => {
    setActivePopup((prev) => (prev === popupName ? null : popupName));
  };

  return (
    <header
      ref={navRef}
      className={`w-full px-6 py-4 md:px-20 bg-palette-navbar flex flex-col md:flex-row md:items-center md:justify-between fixed top-0 z-50 transition-transform duration-300 border-b border-lime-300 shadow ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >      
      {/* Left section */}
      <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto gap-4 md:gap-8">        
        {/* Logo + Hamburger */}
        <div className="w-full flex justify-between items-center">
          <Link
            className="text-2xl md:text-3xl font-bold"
            to="/home"
          >
            <LogoNavbar size={20} className="h-5 md:h-9 text-palette-brand0a dark:text-palette-textMuted" />
          </Link>

          {/* Right side controls (mobile) */}
          <div className="flex items-center gap-3 md:hidden">
            <AvatarMenu
              account={account}
              initials={initials}
              togglePopup={togglePopup}
              activePopup={activePopup}
            />

            <button
              className="text-palette-brand0a focus:outline-none"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              {mobileMenuOpen ? (
                <CloseIcon size={24} />
              ) : (
                <MenuIcon size={24} />
              )}
            </button>
          </div>
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
      <div className="hidden md:flex items-center gap-12 relative">
        {/* Search Box */}
        {/* <div className="relative w-full max-w-sm md:max-w-[300px]">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 pr-10 bg-[#f9fbfa] border border-palette-border text-sm rounded-md focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-palette-textMuted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
            </svg>
          </div>
        </div> */}
        {/* Theme Toggle Switch */}
        <button
          onClick={toggleTheme}
          className="relative w-10 h-5 rounded-full focus:outline-none transition-colors duration-300 bg-gray-300 dark:bg-gray-600"
          aria-label="Toggle theme"
        >
          {/* Sliding pill */}
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${
              theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
            }`}
          >
            {theme === 'light' ? (
              /* Sun icon */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              /* Moon icon */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </span>
        </button>

        {/* Avatar */}
        <AvatarMenu account={account} initials={initials} togglePopup={togglePopup} activePopup={activePopup} />

      </div>
    </header>
  )
};

export default Navbar;