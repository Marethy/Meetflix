import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaUserAlt, FaFilm, FaShoppingCart, FaTicketAlt, FaClipboardList, FaCog } from "react-icons/fa";

const NavMenu = () => {
  return (
    <div className="h-screen w-64 bg-black text-white flex flex-col justify-between p-4">
      {/* Logo and Project Name */}
      <div>
        <div className="flex items-center mb-6">
          <div className="text-red-600 text-3xl">
            <FaUserAlt />
          </div>
          <h1 className="ml-3 text-xl font-bold">MTM Project.</h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4">
          <NavLink to="/" className="flex items-center p-2 hover:bg-gray-700 rounded-lg" activeClassName="bg-gray-700">
            <FaHome className="mr-3" />
            Home
          </NavLink>
          <NavLink to="/employees" className="flex items-center p-2 hover:bg-gray-700 rounded-lg" activeClassName="bg-gray-700">
            <FaUserAlt className="mr-3" />
            Employees
          </NavLink>
          <NavLink to="/movies" className="flex items-center p-2 hover:bg-gray-700 rounded-lg" activeClassName="bg-gray-700">
            <FaFilm className="mr-3" />
            Movies
          </NavLink>
          <NavLink to="/products" className="flex items-center p-2 hover:bg-gray-700 rounded-lg" activeClassName="bg-gray-700">
            <FaShoppingCart className="mr-3" />
            Products
          </NavLink>
          <NavLink to="/theaters" className="flex items-center p-2 hover:bg-gray-700 rounded-lg" activeClassName="bg-gray-700">
            <FaTicketAlt className="mr-3" />
            Theaters
          </NavLink>
          <NavLink to="/receipts" className="flex items-center p-2 hover:bg-gray-700 rounded-lg" activeClassName="bg-gray-700">
            <FaClipboardList className="mr-3" />
            Receipts
          </NavLink>
        </nav>
      </div>

      {/* Thoughts Time Section */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <h2 className="text-lg font-bold mb-2">Thoughts Time</h2>
          <p className="text-sm mb-3">Tips of the day or some notifications will be shown here.</p>
          <button className="bg-red-600 text-white px-3 py-2 rounded-lg">Write a message</button>
        </div>
      </div>

      {/* Settings Section */}
      <div className="border-t border-gray-700 pt-4">
        <NavLink to="/settings" className="flex items-center p-2 hover:bg-gray-700 rounded-lg" activeClassName="bg-gray-700">
          <FaCog className="mr-3" />
          Settings
        </NavLink>
        <p className="text-sm text-gray-400 mt-3">App developed by group 7.</p>
      </div>
    </div>
  );
};

export default NavMenu;
