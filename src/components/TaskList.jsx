import React from 'react';
import { FaCheck, FaUserAlt, FaEdit, FaTrash } from 'react-icons/fa';

const TaskList = ({ 
  tasks, 
  onCompleteTask, 
  onEditTask, 
  onDeleteTask, 
  onAssignTask 
}) => {
  // Definición de prioridades
  const priorities = {
    alta: { text: 'Alta', color: 'bg-red-500' },
    media: { text: 'Media', color: 'bg-yellow-500' },
    baja: { text: 'Baja', color: 'bg-green-500' }
  };

  // Definición de estados
  const statusClasses = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    'en progreso': 'bg-blue-100 text-blue-800',
    completada: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      
      <div className="grid grid-cols-12 bg-gray-50 text-gray-500 text-sm font-medium px-4 py-3 border-b">
        <div className="col-span-1">Estado</div>
        <div className="col-span-4">Descripción</div>
        <div className="col-span-2">Prioridad</div>
        <div className="col-span-3">Asignado</div>
        <div className="col-span-2">Acciones</div>
      </div>
      
      
      {tasks.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No hay tareas en este proyecto
        </div>
      ) : (
        <div className="divide-y">
          {tasks.map(task => (
            <div key={task.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
            
              <div className="col-span-1">
                <span className={`${statusClasses[task.estado]} text-xs px-2 py-1 rounded-full`}>
                  {task.estado}
                </span>
              </div>
             
              <div className="col-span-4 font-medium">
                <p className="truncate">{task.descripcion}</p>
                {task.fecha_limite && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(task.fecha_limite).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              
              <div className="col-span-2">
                <span className={`${priorities[task.prioridad].color} text-white text-xs px-2 py-1 rounded-full`}>
                  {priorities[task.prioridad].text}
                </span>
              </div>
              
              
              <div className="col-span-3">
                {task.usuario ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <FaUserAlt className="text-blue-500 text-xs" />
                    </div>
                    <span>{task.usuario}</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => onAssignTask(task.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Asignar usuario
                  </button>
                )}
              </div>
              
              
              <div className="col-span-2 flex space-x-2">
                {!task.completada && (
                  <button 
                    onClick={() => onCompleteTask(task.id)}
                    className="p-2 text-green-500 hover:text-green-700"
                    title="Marcar como completada"
                  >
                    <FaCheck />
                  </button>
                )}
                
                <button 
                  onClick={() => onEditTask(task.id)}
                  className="p-2 text-blue-500 hover:text-blue-700"
                  title="Editar tarea"
                >
                  <FaEdit />
                </button>
                
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                  title="Eliminar tarea"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;