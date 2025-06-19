
import React, { useState, useEffect } from 'react';
import './index.css'
import ProjectDashboard from './components/ProjectDashboard';
import ProjectDetail from './components/ProjectDetail';
import ProjectCreation from './components/ProjectCreation'; // Importación añadida
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './services/tailwindLoad'
import { fetchProjects, fetchProjectStatus } from './services/api';


function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('dashboard'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando proyectos:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSelectProject = async (projectId) => {
    setLoading(true);
    try {
      const projectData = await fetchProjectStatus(projectId);
      setSelectedProject(projectData);
      setView('detail');
    } catch (error) {
      console.error("Error cargando detalles del proyecto:", error);
    }
    setLoading(false);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setView('dashboard');
  };

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
    setView('dashboard');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar setView={setView} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : view === 'dashboard' ? (
            <ProjectDashboard 
              projects={projects} 
              onSelectProject={handleSelectProject}
              setView={setView} // Añadido para permitir navegación
            />
          ) : view === 'detail' && selectedProject ? (
            <ProjectDetail 
              project={selectedProject} 
              onBack={handleBackToDashboard}
            />
          ) : view === 'create' ? (
            <ProjectCreation onProjectCreated={handleProjectCreated} />
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default App;