// src/components/ProjectCreation.jsx
import React, { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const ProjectCreation = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);
    
    const newProject = {
      name: projectName.trim(),
      description: projectDescription.trim(),
      status: 'Activo',
      users: 0
    };
    
    try {
      await onProjectCreated(newProject);
      resetForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setError(null);
  };

  const handleCancel = () => {
    if (loading) return;
    onProjectCreated(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Crear Nuevo Proyecto</h3>
        <button 
          onClick={handleCancel}
          disabled={loading}
          className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
        >
          <FaTimes />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
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
            disabled={loading}
            placeholder="Ej: Sistema de Gestión"
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
            disabled={loading}
            placeholder="Describe brevemente el proyecto..."
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !projectName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Creando...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Crear Proyecto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreation;