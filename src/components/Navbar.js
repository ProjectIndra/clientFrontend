import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import { useState } from 'react';

function Navbar() {
   const [dropdown, setDropdown] = useState(false);
   return (
      <div className='navbar'>
         <nav>
            <div className="menu-icon"
               onMouseEnter={() => setDropdown(true)}>
               <img src='/img/menu.png' alt='menuIcon'>
               </img>
            </div>
            <div className="logo">
               <Link to="/home">
                  Indra
               </Link>
            </div>
            {/* <div className="nav-items">
               <li><Link to="/home">Home</Link></li>
               <li><Link to="/client/services">My Services</Link></li>
               <li><Link to="/providersList">Providers</Link></li>
            </div> */}
            <form action="#">
               <input type="search" className="search-data" placeholder="Search for providers, services and more" required />
               <button type="submit">Search</button>
            </form>
            <div className="profile-details">
               <img src='/img/user.png' alt='profilePic'></img>
            </div>
         </nav>
         {dropdown &&
            <div className='dropdown'
               onMouseEnter={() => setDropdown(true)}
               onMouseLeave={() => setDropdown(false)}>
               <ul className="nav-items">
                  <li><Link to="/home">Home</Link></li>
                  <li><Link to="/client/services">My Services</Link></li>
                  <li><Link to="/providersList">Providers</Link></li>
               </ul>
            </div>}

      </div>
   );
}

export default Navbar;