// src/services/api.js
// API service para conectar con el backend Python

import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Función helper para manejar errores de la API
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(`Error ${error.response.status}: ${error.response.data?.detail || error.response.statusText}`);
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
  } else {
    throw new Error('Error inesperado en la aplicación.');
  }
};

// Función helper para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`🌐 Enviando request a: ${url}`);
    console.log(`📤 Datos enviados:`, options.body ? JSON.parse(options.body) : 'No body');
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ Error ${response.status}:`, errorData);
      throw new Error(JSON.stringify(errorData) || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Respuesta exitosa:`, data);
    return data;
  } catch (error) {
    console.error(`💥 Error en apiRequest:`, error);
    handleApiError(error);
  }
};

// ===== PROYECTOS =====

export const fetchProjects = async () => {
  try {
    const projects = await apiRequest('/projects');
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchProjectStatus = async (projectId) => {
  try {
    console.log('🔍 fetchProjectStatus - projectId recibido:', projectId);
    
    // Obtener el proyecto
    const project = await apiRequest(`/projects/${projectId}`);
    console.log('🔍 fetchProjectStatus - proyecto obtenido:', project);
    console.log('🔍 fetchProjectStatus - project._id:', project._id);
    
    // Obtener las tareas del proyecto
    const tasks = await apiRequest(`/projects/${projectId}/tasks`);
    console.log('🔍 fetchProjectStatus - tareas obtenidas:', tasks);
    
    // Combinar proyecto con tareas
    const result = {
      ...project,
      tareas: tasks
    };
    
    console.log('🔍 fetchProjectStatus - resultado final:', result);
    console.log('🔍 fetchProjectStatus - resultado._id:', result._id);
    
    return result;
  } catch (error) {
    console.error('Error fetching project status:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const newProject = await apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: projectData.name,
        description: projectData.description,
        status: projectData.status || 'Activo',
        users: projectData.users || 0
      }),
    });
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const updatedProject = await apiRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        users: projectData.users
      }),
    });
    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    await apiRequest(`/projects/${projectId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// ===== TAREAS =====

export const fetchProjectTasks = async (projectId) => {
  try {
    const tasks = await apiRequest(`/projects/${projectId}/tasks`);
    return tasks;
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    console.log('🔍 Datos de tarea recibidos en createTask:', taskData);
    
    const taskPayload = {
      descripcion: taskData.descripcion,
      prioridad: taskData.prioridad,
      estado: taskData.estado || 'pendiente',
      completada: taskData.completada || false,
      usuario: taskData.usuario || null,
      project_id: taskData.project_id,
      fecha_limite: taskData.fecha_limite || null
    };
    
    console.log('📤 Payload a enviar al backend:', taskPayload);
    
    const newTask = await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskPayload),
    });
    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const updatedTask = await apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({
        descripcion: taskData.descripcion,
        prioridad: taskData.prioridad,
        estado: taskData.estado,
        completada: taskData.completada,
        usuario: taskData.usuario,
        project_id: taskData.project_id
      }),
    });
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// ===== USUARIOS =====

export const fetchUsers = async () => {
  try {
    const users = await apiRequest('/users');
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const newUser = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user'
      }),
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const updatedUser = await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        role: userData.role
      }),
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ===== UTILIDADES =====

export const checkApiHealth = async () => {
  try {
    const baseUrl = API_BASE_URL.replace('/api', '');
    const response = await fetch(`${baseUrl}/health`);
    if (response.ok) {
      return await response.json();
    }
    return { status: 'unhealthy', database: 'error' };
  } catch (error) {
    return { status: 'unhealthy', database: 'disconnected' };
  }
};