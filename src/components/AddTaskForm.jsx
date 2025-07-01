// src/components/AddTaskForm.jsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AddTaskForm = ({ onAddTask, onCancel, loading = false }) => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTask = {
      descripcion: description,
      prioridad: priority,
      fecha_limite: dueDate || null,
      usuario: assignedTo || null,
      completada: false,
      estado: 'pendiente'
    };
    
    onAddTask(newTask);
    resetForm();
  };

  const resetForm = () => {
    setDescription('');
    setPriority('media');
    setDueDate('');
    setAssignedTo('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Agregar Nueva Tarea</h3>
        <button 
          onClick={onCancel}
          disabled={loading}
          className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
        >
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
            Descripción de la tarea *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
            disabled={loading}
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="priority">
              Prioridad
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="dueDate">
              Fecha Límite (opcional)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="assignedTo">
              Asignar a (opcional)
            </label>
            <input
              type="text"
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del usuario"
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Creando...
              </>
            ) : (
              'Agregar Tarea'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;