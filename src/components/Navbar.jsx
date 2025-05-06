import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/EclipseTV.png'; // adjust if needed

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Show</Link></li>
        <li><Link to="/actors">Actors</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
      </ul>

      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="EclipseTV" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
