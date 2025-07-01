// src/components/ProjectDashboard.jsx
import React from 'react';
import ProjectCard from './ProjectCard';
import { FaPlus, FaChartPie } from 'react-icons/fa';

const ProjectDashboard = ({ projects, onSelectProject, setView }) => {
  // Calcular estadísticas generales
  const stats = projects.reduce((acc, project) => {
    acc.totalProjects += 1;
    acc.totalTasks += project.total || 0;
    acc.completedTasks += project.completadas || 0;
    return acc;
  }, { totalProjects: 0, totalTasks: 0, completedTasks: 0 });

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const handleCreateProject = () => {
    setView('create');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard de Proyectos</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <FaChartPie className="mr-2" /> Reportes
          </button>
          <button 
            onClick={handleCreateProject}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaPlus className="mr-2" /> Nuevo Proyecto
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Proyectos</h3>
          <p className="text-2xl font-bold">{stats.totalProjects}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Tareas Totales</h3>
          <p className="text-2xl font-bold">{stats.totalTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Tareas Completadas</h3>
          <p className="text-2xl font-bold">{stats.completedTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Progreso General</h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Todos los Proyectos</h2>
        </div>
        
        {projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No hay proyectos creados aún</p>
            <button 
              onClick={handleCreateProject}
              className="mt-4 text-blue-500 hover:underline"
            >
              Crear primer proyecto
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {projects.map((project, index) => {
              const projectId = project._id || `temp-${project.name?.replace(/\s+/g, '-').toLowerCase()}`;
              return (
                <ProjectCard 
                  key={projectId || `project-${index}`} 
                  project={project} 
                  onClick={onSelectProject}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;