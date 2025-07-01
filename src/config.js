// src/config.js
// Configuración del frontend

const config = {
  // URL del backend Python
  API_BASE_URL: 'http://localhost:8000/api',
  
  // URL del servidor de desarrollo
  DEV_SERVER_URL: 'http://localhost:5173',
  
  // Configuración de la aplicación
  APP_NAME: 'Gestión de Proyectos',
  APP_VERSION: '1.0.0',
  
  // Configuración de paginación
  DEFAULT_PAGE_SIZE: 10,
  
  // Configuración de timeouts
  API_TIMEOUT: 10000, // 10 segundos
  
  // Configuración de reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// Configuración para diferentes entornos
const env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  // En producción, usar la URL del servidor de producción
  config.API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tu-backend.com/api';
}

export default config; 