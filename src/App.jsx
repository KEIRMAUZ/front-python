import React, { useState, useEffect } from 'react';
import './index.css'
import ProjectDashboard from './components/ProjectDashboard';
import ProjectDetail from './components/ProjectDetail';
import ProjectCreation from './components/ProjectCreation';
import UserManagement from './components/UserManagement';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './services/tailwindLoad'
import { fetchProjects, fetchProjectStatus, createProject, deleteProject, checkApiHealth } from './services/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('dashboard'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  // Verificar estado de la API al cargar
  useEffect(() => {
    const checkApi = async () => {
      const status = await checkApiHealth();
      setApiStatus(status);
      
      if (status.status === 'healthy') {
        loadProjects();
      } else {
        setError('No se puede conectar con el backend. Verifica que esté ejecutándose en http://localhost:8000');
        setLoading(false);
      }
    };
    
    checkApi();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      console.log('Proyectos cargados:', data);
      console.log('Estructura del primer proyecto:', JSON.stringify(data[0], null, 2));
      
      // Verificar si el _id está presente en cada proyecto
      data.forEach((project, index) => {
        console.log(`Proyecto ${index + 1}:`, {
          name: project.name,
          hasId: '_id' in project,
          id: project._id,
          keys: Object.keys(project)
        });
      });
      
      setProjects(data);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (projectId) => {
    console.log('Seleccionando proyecto con ID:', projectId);
    setLoading(true);
    setError(null);
    try {
      const projectData = await fetchProjectStatus(projectId);
      setSelectedProject(projectData);
      setView('detail');
    } catch (error) {
      console.error("Error cargando detalles del proyecto:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setView('dashboard');
    setError(null);
  };

  const handleDeleteProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p._id !== projectId));
      setSelectedProject(null);
      setView('dashboard');
    } catch (error) {
      console.error("Error deleting project:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = async (newProject) => {
    if (!newProject) {
      setView('dashboard');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const createdProject = await createProject(newProject);
      setProjects([...projects, createdProject]);
      setView('dashboard');
    } catch (error) {
      console.error("Error creando proyecto:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadProjects();
  };

  // Mostrar error de conexión
  if (apiStatus && apiStatus.status === 'unhealthy') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar setView={setView} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">
                    Error de Conexión
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                    <div className="mt-4">
                      <h4 className="font-medium">Para solucionar:</h4>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Asegúrate de que el backend Python esté ejecutándose</li>
                        <li>Verifica que esté en el puerto 8000: <code className="bg-red-100 px-1 rounded">http://localhost:8000</code></li>
                        <li>Revisa la consola del backend para errores</li>
                        <li>Verifica la conexión a MongoDB Atlas</li>
                      </ol>
                    </div>
                    <button 
                      onClick={handleRefresh}
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      Reintentar Conexión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar setView={setView} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
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

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando...</p>
              </div>
            </div>
          ) : view === 'dashboard' ? (
            <ProjectDashboard 
              projects={projects} 
              onSelectProject={handleSelectProject}
              setView={setView}
            />
          ) : view === 'detail' && selectedProject ? (
            <ProjectDetail 
              project={selectedProject} 
              onBack={handleBackToDashboard}
              onDeleteProject={handleDeleteProject}
            />
          ) : view === 'create' ? (
            <ProjectCreation onProjectCreated={handleProjectCreated} />
          ) : view === 'users' ? (
            <UserManagement />
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default App;