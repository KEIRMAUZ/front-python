// src/components/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaCheck, FaUserAlt, FaTimes, FaSave } from 'react-icons/fa';
import { createTask, updateTask, deleteTask, updateProject } from '../services/api';

const ProjectDetail = ({ project, onBack, onDeleteProject }) => {
  
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [tasks, setTasks] = useState(project.tareas || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Calcular estadísticas para este proyecto
  const completedTasks = tasks.filter(task => task.completada).length;
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;
  
  const priorities = {
    alta: { text: 'Alta', color: 'bg-red-500' },
    media: { text: 'Media', color: 'bg-yellow-500' },
    baja: { text: 'Baja', color: 'bg-green-500' }
  };

  const handleAddTask = async (newTask) => {
    setLoading(true);
    setError(null);
    try {
      const taskData = {
        ...newTask,
        project_id: project._id,
        estado: 'pendiente',
        completada: false
      };
      
      const createdTask = await createTask(taskData);
      setTasks([...tasks, createdTask]);
      setShowAddTaskForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const task = tasks.find(t => t.id === taskId || t._id === taskId);
      if (!task) return;

      const updatedTaskData = {
        ...task,
        completada: true,
        estado: 'completada'
      };

      const updatedTask = await updateTask(taskId, updatedTaskData);
      setTasks(tasks.map(t => 
        (t.id === taskId || t._id === taskId) ? updatedTask : t
      ));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId && t._id !== taskId));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"? Esta acción también eliminará todas las tareas asociadas y no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onDeleteProject(project._id);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = () => {
    setEditingProject({
      _id: project._id,
      name: project.name,
      description: project.description || '',
      status: project.status || 'Activo',
      users: project.users || 0
    });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updatedProject = await updateProject(editingProject._id, editingProject);
      // Actualizar el proyecto en el estado local
      Object.assign(project, updatedProject);
      setEditingProject(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <button 
          onClick={onBack}
          className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Volver a proyectos
        </button>
        
        <div className="flex justify-between items-start">
          {editingProject ? (
            // Formulario de edición
            <form onSubmit={handleUpdateProject} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectName">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectStatus">
                    Estado
                  </label>
                  <select
                    id="projectStatus"
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Completado">Completado</option>
                    <option value="Pausado">Pausado</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectDescription">
                  Descripción
                </label>
                <textarea
                  id="projectDescription"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  disabled={loading}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 flex items-center"
                >
                  <FaTimes className="mr-2" /> Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !editingProject.name.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  <FaSave className="mr-2" /> Guardar Cambios
                </button>
              </div>
            </form>
          ) : (
            // Vista normal del proyecto
            <>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
                <p className="text-gray-600 mt-2">{project.description || "Sin descripción"}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">Estado: </span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    project.status === 'Activo' ? 'bg-green-100 text-green-800' :
                    project.status === 'Completado' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleEditProject}
                  disabled={loading}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md flex items-center disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <FaEdit className="mr-2" /> Editar
                </button>
                <button 
                  onClick={handleDeleteProject}
                  disabled={loading}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md flex items-center disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <FaTrash className="mr-2" /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Tareas Totales</h3>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Tareas Completadas</h3>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Progreso del Proyecto</h3>
          <div className="flex items-center mt-1">
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

     
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Tareas del Proyecto</h2>
        <button 
          onClick={() => setShowAddTaskForm(true)}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Agregar Tarea
        </button>
      </div>

      {showAddTaskForm && (
        <AddTaskForm 
          onAddTask={handleAddTask} 
          onCancel={() => setShowAddTaskForm(false)}
          loading={loading}
        />
      )}

      
      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No hay tareas en este proyecto</p>
          <button 
            onClick={() => setShowAddTaskForm(true)}
            className="text-green-500 hover:text-green-700 font-medium"
          >
            Agregar primera tarea
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 text-gray-500 text-sm font-medium px-4 py-3 border-b">
            <div className="col-span-1">Estado</div>
            <div className="col-span-4">Descripción</div>
            <div className="col-span-2">Prioridad</div>
            <div className="col-span-2">Asignado</div>
            <div className="col-span-3">Acciones</div>
          </div>
          
          <div className="divide-y">
            {tasks.map(task => (
              <div key={task.id || task._id} className="grid grid-cols-12 px-4 py-3 items-center">
                <div className="col-span-1">
                  {task.completada ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Completada
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Pendiente
                    </span>
                  )}
                </div>
                <div className="col-span-4 font-medium">{task.descripcion}</div>
                <div className="col-span-2">
                  <span className={`${priorities[task.prioridad]?.color || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full`}>
                    {priorities[task.prioridad]?.text || task.prioridad}
                  </span>
                </div>
                <div className="col-span-2">
                  {task.usuario ? (
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <FaUserAlt className="text-blue-500 text-xs" />
                      </div>
                      <span>{task.usuario}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Sin asignar</span>
                  )}
                </div>
                <div className="col-span-3 flex space-x-2">
                  {!task.completada && (
                    <button 
                      onClick={() => handleCompleteTask(task.id || task._id)}
                      disabled={loading}
                      className="bg-green-100 hover:bg-green-200 disabled:bg-gray-100 text-green-700 px-3 py-1 rounded-md flex items-center text-sm"
                    >
                      <FaCheck className="mr-1" /> Completar
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteTask(task.id || task._id)}
                    disabled={loading}
                    className="bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <FaTrash className="mr-1" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Procesando...</span>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;