// src/components/ProjectCard.jsx
import React from 'react';
import { FaTasks, FaUserAlt, FaCalendarAlt } from 'react-icons/fa';

const ProjectCard = ({ project, onClick }) => {
  const completionPercentage = project.total > 0 
    ? Math.round((project.completadas / project.total) * 100) 
    : 0;

  return (
    <div 
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{project.description || "Sin descripción"}</p>
          
          <div className="flex items-center mt-3 space-x-4">
            <div className="flex items-center text-gray-500 text-sm">
              <FaTasks className="mr-1" />
              <span>{project.completadas}/{project.total} tareas</span>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              <FaUserAlt className="mr-1" />
              <span>{project.users || 0} usuarios</span>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              <FaCalendarAlt className="mr-1" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-blue-600">{completionPercentage}%</span>
          <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              project.status === 'Activo' 
                ? 'bg-green-100 text-green-800' 
                : project.status === 'pausado'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status || 'Activo'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;