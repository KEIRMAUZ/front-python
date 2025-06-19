// src/components/ProjectDetail.jsx
import React, { useState } from 'react';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaCheck, FaUserAlt } from 'react-icons/fa';

const ProjectDetail = ({ project, onBack }) => {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [tasks, setTasks] = useState(project.tareas || []);
  
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

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowAddTaskForm(false);
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completada: true, estado: 'completada' } : task
    ));
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
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-gray-600 mt-2">{project.description || "Sin descripción"}</p>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md flex items-center">
              <FaEdit className="mr-2" /> Editar
            </button>
            <button className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md flex items-center">
              <FaTrash className="mr-2" /> Eliminar
            </button>
          </div>
        </div>
      </div>

      
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
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Agregar Tarea
        </button>
      </div>

      {showAddTaskForm && (
        <AddTaskForm 
          onAddTask={handleAddTask} 
          onCancel={() => setShowAddTaskForm(false)} 
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
            <div className="col-span-5">Descripción</div>
            <div className="col-span-2">Prioridad</div>
            <div className="col-span-2">Asignado</div>
            <div className="col-span-2">Acciones</div>
          </div>
          
          <div className="divide-y">
            {tasks.map(task => (
              <div key={task.id} className="grid grid-cols-12 px-4 py-3 items-center">
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
                <div className="col-span-5 font-medium">{task.descripcion}</div>
                <div className="col-span-2">
                  <span className={`${priorities[task.prioridad].color} text-white text-xs px-2 py-1 rounded-full`}>
                    {priorities[task.prioridad].text}
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
                <div className="col-span-2">
                  {!task.completada && (
                    <button 
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md flex items-center text-sm"
                    >
                      <FaCheck className="mr-1" /> Completar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;