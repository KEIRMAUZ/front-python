import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FaChartPie, FaChartBar, FaCalendarAlt, FaTasks, FaCheckCircle, FaClock } from 'react-icons/fa';
import { fetchProjectStats, fetchTaskTimeline } from '../services/api';

const Reports = () => {
  const [projectStats, setProjectStats] = useState([]);
  const [taskTimeline, setTaskTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pie');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, timeline] = await Promise.all([
        fetchProjectStats(),
        fetchTaskTimeline()
      ]);
      setProjectStats(stats);
      setTaskTimeline(timeline);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const pieData = projectStats
    .filter(project => project && project.name) // Filtrar proyectos válidos
    .map(project => ({
      name: project.name || 'Proyecto sin nombre',
      value: project.total_tasks || 0,
      completed: project.completed_tasks || 0,
      pending: project.pending_tasks || 0
    }));

  const barData = projectStats
    .filter(project => project && project.name) // Filtrar proyectos válidos
    .map(project => ({
      name: project.name || 'Proyecto sin nombre',
      Completadas: project.completed_tasks || 0,
      Pendientes: project.pending_tasks || 0
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label || 'Proyecto sin nombre'}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name || 'Sin nombre'}: ${entry.value || 0}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderGanttChart = () => {
    const projects = [...new Set(taskTimeline.map(task => task.project_name))];
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaCalendarAlt className="mr-2" />
          Cronograma de Tareas (Gantt)
        </h3>
        
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 gap-1 mb-2 text-xs font-medium text-gray-600">
              <div className="col-span-3">Proyecto/Tarea</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-8">Progreso</div>
            </div>
            
            {projects.map((projectName, projectIndex) => {
              const projectTasks = taskTimeline.filter(task => task.project_name === projectName);
              const projectColor = COLORS[projectIndex % COLORS.length];
              
              return (
                <div key={projectName} className="mb-4">
                  <div className="font-semibold text-gray-800 mb-2" style={{ color: projectColor }}>
                    {projectName}
                  </div>
                  
                  {projectTasks.map((task, taskIndex) => {
                    const progress = task.completed ? 100 : 
                      task.status === 'en progreso' ? 50 : 0;
                    
                    return (
                      <div key={task.task_id} className="grid grid-cols-12 gap-1 mb-1 items-center">
                        <div className="col-span-3 text-sm text-gray-700 pl-4">
                          {task.task_name}
                        </div>
                        <div className="col-span-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.completed 
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'en progreso'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <div className="col-span-8">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className="h-4 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${progress}%`,
                                backgroundColor: task.completed ? '#10B981' : 
                                  task.status === 'en progreso' ? '#F59E0B' : '#6B7280'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-2">Visualiza el progreso y estadísticas de tus proyectos</p>
        </div>
        
        <button 
          onClick={loadReportData}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaChartBar className="mr-2" /> Actualizar Datos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaTasks className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tareas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projectStats.reduce((sum, project) => sum + project.total_tasks, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projectStats.reduce((sum, project) => sum + project.completed_tasks, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projectStats.reduce((sum, project) => sum + project.pending_tasks, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pie')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'pie'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaChartPie className="mr-2" />
              Distribución de Tareas
            </button>
            <button
              onClick={() => setActiveTab('bar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'bar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaChartBar className="mr-2" />
              Progreso por Proyecto
            </button>
            <button
              onClick={() => setActiveTab('gantt')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'gantt'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCalendarAlt className="mr-2" />
              Cronograma Gantt
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pie' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaChartPie className="mr-2" />
                Distribución de Tareas por Proyecto
              </h3>
              {pieData.length === 0 ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>No hay proyectos con tareas para mostrar</p>
                    <p className="text-sm mt-2">Crea proyectos y agrega tareas para ver las estadísticas</p>
                  </div>
                </div>
              ) : (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name || 'Sin nombre'} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bar' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaChartBar className="mr-2" />
                Progreso de Tareas por Proyecto
              </h3>
              {barData.length === 0 ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>No hay proyectos con tareas para mostrar</p>
                    <p className="text-sm mt-2">Crea proyectos y agrega tareas para ver las estadísticas</p>
                  </div>
                </div>
              ) : (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="Completadas" fill="#10B981" />
                      <Bar dataKey="Pendientes" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gantt' && renderGanttChart()}
        </div>
      </div>
    </div>
  );
};

export default Reports; 