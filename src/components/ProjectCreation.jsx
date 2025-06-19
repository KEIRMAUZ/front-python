// src/components/ProjectCreation.jsx
import React, { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const ProjectCreation = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      description: projectDescription,
      created_at: new Date().toISOString(),
      status: 'Activo',
      total: 0,
      completadas: 0,
      pendientes: 0
    };
    
    onProjectCreated(newProject);
    resetForm();
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Crear Nuevo Proyecto</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectName">
            Nombre del Proyecto *
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectDescription">
            Descripción (opcional)
          </label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onProjectCreated(null)} // Cancelar creación
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <FaSave className="mr-2" /> Crear Proyecto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreation;