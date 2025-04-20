import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import { useState } from 'react';

function Navbar() {
   const [activeDropdown, setActiveDropdown] = useState(null);

   const handleClick = () => {
      window.location.href = '/profile';
   };

   const setWindowLocation = (location) => {
      window.location.href = location;
   };

   return (
      <div className='navbar'>
         <nav>
            <div className="logo">
               <Link to="/home">
                  <h1 className='navbar-items-main-h1'>Indra</h1>
               </Link>
            </div>

            <div className="menu-icon"
               onMouseEnter={() => setActiveDropdown("services")}>
               <h1 className='navbar-items-h1'>Services</h1>
            </div>

            <div className="menu-icon"
               onMouseEnter={() => setActiveDropdown("manage")}>
               <h1 className='navbar-items-h1'>Manage</h1>
            </div>

            <div className="menu-icon"
               onMouseEnter={() => setActiveDropdown("docs")}>
               <h1 className='navbar-items-h1'>Documentation</h1>
            </div>

            <form action="#">
               <input
                  type="search"
                  className="search-data"
                  placeholder="Search for providers, services and more"
                  required
               />
               <button type="submit">Search</button>
            </form>

            <div className="profile-pics">
               <img src='/img/user.png' alt='profilePic' onClick={handleClick} />
               <button className="logout-button" onClick={() => {
                  sessionStorage.removeItem('token');
                  window.location.href = '/login';
               }}>Logout</button>
            </div>
         </nav>

         {activeDropdown === "services" && (
            <div className='dropdown'
               onMouseEnter={() => setActiveDropdown("services")}
               onMouseLeave={() => setActiveDropdown(null)}>
               <ul className="nav-items">
                  <li><Link to="/client/services">Compute-Engine</Link></li>
                  <li><Link to="/providersList">Providers</Link></li>
                  <li><Link to="/buckets">Buckets</Link></li>
               </ul>
            </div>
         )}

         {activeDropdown === "manage" && (
            <div className='dropdown'
               onMouseEnter={() => setActiveDropdown("manage")}
               onMouseLeave={() => setActiveDropdown(null)}>
               <ul className="nav-items">
                  <li><Link to="/client/services">Setup</Link></li>
                  <li><Link to="/manage/providers">Manage Providers</Link></li>
                  <li><Link to="/client/services">Manage Clients</Link></li>
               </ul>
            </div>
         )}

         {activeDropdown === "docs" && (
            <div className='dropdown'
               onMouseEnter={() => setActiveDropdown("docs")}
               onMouseLeave={() => setActiveDropdown(null)}
               onClick={() => setWindowLocation('/docs')}>
               <ul className="nav-items">
                  <li>Go to Documentation</li>
               </ul>
            </div>
         )}
      </div>
   );
}

export default Navbar;
