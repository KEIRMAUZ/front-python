// src/components/Header.jsx
import React from 'react';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar proyectos, tareas..."
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-1 text-gray-500 hover:text-gray-700">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center">
            <div className="mr-3 text-right">
              <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-blue-500 text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;