// import { Link } from 'react-router-dom';
// import '../css/Navbar.css';
// import { useState } from 'react';

// function Navbar() {

//    const [dropdown, setDropdown] = useState(false);

//    const handleClick = () => {
//       window.location.href = '/profile';
//    }

//    return (
//       <div className='navbar'>
//          <nav>
//             <div className="logo">
//                <Link to="/home">
//                   <h1 className='navbar-items-main-h1'>Indra</h1>
//                </Link>
//             </div>
//             <div className="menu-icon"
//                onMouseEnter={() => setDropdown(true)}>
//                <h1 className='navbar-items-h1'>Services</h1>

//             </div><div className="menu-icon"
//                onMouseEnter={() => setDropdown(true)}>
//                <h1 className='navbar-items-h1'>Manage</h1>
//             </div>

//             {/* <div className="nav-items">
//                <li><Link to="/home">Home</Link></li>
//                <li><Link to="/client/services">My Services</Link></li>
//                <li><Link to="/providersList">Providers</Link></li>
//             </div> */}
//             <form action="#">
//                <input type="search" className="search-data" placeholder="Search for providers, services and more" required />
//                <button type="submit">Search</button>
//             </form>
//             <div className="profile-pics">
//                <img src='/img/user.png' alt='profilePic' onClick={handleClick}></img>
//             </div>
//          </nav>
//          {dropdown &&
//             <div className='dropdown'
//                onMouseEnter={() => setDropdown(true)}
//                onMouseLeave={() => setDropdown(false)}>
//                <ul className="nav-items">
//                   <li><Link to="/client/services">Compute-Engine</Link></li>
//                   <li><Link to="/providersList">Providers</Link></li>
//                </ul>
               
//             </div>}
//          {dropdown &&
//             <div className='dropdown'
//                onMouseEnter={() => setDropdown(true)}
//                onMouseLeave={() => setDropdown(false)}>
//                <ul className="nav-items">
//                   <li><Link to="/client/services">Setup</Link></li>
//                   <li><Link to="/providersList"> Manage Providers</Link></li>
//                   <li><Link to="/client/services">Manage clients</Link></li>
//                </ul>

//             </div>}

//       </div>
//    );
// }

// export default Navbar;


import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import { useState } from 'react';

function Navbar() {
   const [activeDropdown, setActiveDropdown] = useState(null);

   const handleClick = () => {
      window.location.href = '/profile';
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
               onMouseEnter={() => setActiveDropdown("services")}
               // onMouseLeave={() => setActiveDropdown(null)}
            >
               <h1 className='navbar-items-h1'>Services</h1>
            </div>

            <div className="menu-icon"
               onMouseEnter={() => setActiveDropdown("manage")}
               // onMouseLeave={() => setActiveDropdown(null)}
            >
               <h1 className='navbar-items-h1'>Manage</h1>
               
            </div>

            <form action="#">
               <input type="search" className="search-data" placeholder="Search for providers, services and more" required />
               <button type="submit">Search</button>
            </form>

            <div className="profile-pics">
               <img src='/img/user.png' alt='profilePic' onClick={handleClick}></img>
               <button className="logout-button" onClick={() => {
                  window.location.href = '/login'
                  sessionStorage.removeItem('token');
               }}>Logout</button>
            </div>
         </nav>
         {activeDropdown === "services" && (
            <div className='dropdown'
               onMouseEnter={() => setActiveDropdown("services")}
               onMouseLeave={() => setActiveDropdown(null)} >
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
               onMouseLeave={() => setActiveDropdown(null)}
            >
               <ul className="nav-items">
                  <li><Link to="/client/services">Setup</Link></li>
                  <li><Link to="/manage/providers">Manage Providers</Link></li>
                  <li><Link to="/client/services">Manage Clients</Link></li>
               </ul>
            </div>
         )}
      </div>
   );
}

export default Navbar;
