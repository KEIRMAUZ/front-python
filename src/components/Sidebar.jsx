// src/components/Sidebar.jsx
import React from 'react';
import { FaHome, FaTasks, FaChartBar, FaCog, FaUserFriends } from 'react-icons/fa';

const Sidebar = ({ setView }) => {
  return (
    <div className="bg-gray-800 text-gray-100 w-64 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Gestor de Proyectos</h1>
      </div>
      
      <nav className="flex-1 p-2 mt-4">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaHome className="mr-3" />
          <span>Dashboard</span>
        </button>
        
        <button 
          onClick={() => setView('create')}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaTasks className="mr-3" />
          <span>Crear Proyecto</span>
        </button>
        
        <button 
          onClick={() => setView('users')}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaUserFriends className="mr-3" />
          <span>Usuarios</span>
        </button>
        
        <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <FaChartBar className="mr-3" />
          <span>Reportes</span>
        </button>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <FaCog className="mr-3" />
          <span>Configuración</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;