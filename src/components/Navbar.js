import { Link } from 'react-router-dom';
import '../css/Navbar.css';

function Navbar() {
  return (
    <div className='navbar'>
    <nav>
      <div className="menu-icon">
            <span className="fas fa-bars"></span>
         </div>
         <div className="logo">
            Indra
         </div>
         <div className="nav-items">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/client/services">My Services</Link></li>
            <li><Link to="/providersList">Providers</Link></li>
         </div>
         <div className="search-icon">
            <span className="fas fa-search"></span>
         </div>
         <div className="cancel-icon">
            <span className="fas fa-times"></span>
         </div>
         <form action="#">
            <input type="search" className="search-data" placeholder="Search" required />
            <button type="submit" className="fas fa-search"></button>
         </form>
         </nav>
    </div>
  );
}

export default Navbar;