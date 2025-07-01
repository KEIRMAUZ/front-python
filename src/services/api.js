import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

const handleApiError = (error) => {
  if (error.response) {
    throw new Error(`Error ${error.response.status}: ${error.response.data?.detail || error.response.statusText}`);
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
  } else {
    throw new Error('Error inesperado en la aplicación.');
  }
};

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
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData) || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchProjects = async () => {
  try {
    const projects = await apiRequest('/projects');
    return projects;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectStatus = async (projectId) => {
  try {
    const project = await apiRequest(`/projects/${projectId}`);
    const tasks = await apiRequest(`/projects/${projectId}/tasks`);
    
    const result = {
      ...project,
      tareas: tasks
    };
    
    return result;
  } catch (error) {
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
    throw error;
  }
};

export const fetchProjectTasks = async (projectId) => {
  try {
    const tasks = await apiRequest(`/projects/${projectId}/tasks`);
    return tasks;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const taskPayload = {
      descripcion: taskData.descripcion,
      prioridad: taskData.prioridad,
      estado: taskData.estado || 'pendiente',
      completada: taskData.completada || false,
      usuario: taskData.usuario || null,
      project_id: taskData.project_id,
      fecha_limite: taskData.fecha_limite || null
    };
    
    const newTask = await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskPayload),
    });
    return newTask;
  } catch (error) {
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
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const users = await apiRequest('/users');
    return users;
  } catch (error) {
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
    throw error;
  }
};

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

export const fetchProjectStats = async () => {
  try {
    const stats = await apiRequest('/reports/project-stats');
    return stats;
  } catch (error) {
    throw error;
  }
};

export const fetchTaskTimeline = async () => {
  try {
    const timeline = await apiRequest('/reports/task-timeline');
    return timeline;
  } catch (error) {
    throw error;
  }
};