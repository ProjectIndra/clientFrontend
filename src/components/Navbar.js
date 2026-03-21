import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAccount from "../hooks/useAccount";
import AvatarMenu from "./AvatarMenu";
import NavbarMenu from "./NavbarMenu";
import useNavbarScroll from "../hooks/useNavbarScroll";
import { getInitials } from "../utils/userUtils";
import useClickOutside from "../hooks/useClickOutside";
import {MenuIcon, CloseIcon} from "../utils/icons";

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
            className="text-2xl md:text-3xl font-bold text-palette-brand0a"
            to="/home"
          >
            <img src="/img/logo-Navbar.svg" alt="" className="h-5 md:h-9" />
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
        <button
          onClick={toggleTheme}
          className="px-4 py-2 font-medium  text-palette-textPrimary rounded-md focus:outline-none"
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>

        {/* Avatar */}
        <AvatarMenu account={account} initials={initials} togglePopup={togglePopup} activePopup={activePopup} />

      </div>
    </header>
  )
};

export default Navbar;