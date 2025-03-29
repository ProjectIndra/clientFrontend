import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import { useState } from 'react';

function Navbar() {

   const [dropdown, setDropdown] = useState(false);

   const handleClick = () => {
      window.location.href = '/profile';
   }
   
   return (
      <div className='navbar'>
         <nav>
            <div className="logo">
               <Link to="/home">
               <h1 className='navbar-items-main-h1'>Indra</h1>
               </Link>
            </div>
            <div className="menu-icon"
               onMouseEnter={() => setDropdown(true)}>
               <h1 className='navbar-items-h1'>Services</h1>
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
            <div className="profile-pics">
               <img src='/img/user.png' alt='profilePic' onClick={handleClick}></img>
            </div>
         </nav>
         {dropdown &&
            <div className='dropdown'
               onMouseEnter={() => setDropdown(true)}
               onMouseLeave={() => setDropdown(false)}>
               <ul className="nav-items">
                  <li><Link to="/client/services">Compute-Engine</Link></li>
                  <li><Link to="/providersList">Providers</Link></li>
               </ul>
            </div>}

      </div>
   );
}

export default Navbar;