// src/services/api.js
// Simulación de llamadas a la API que se conectarían con tu backend Python
export const fetchProjects = async () => {
    // Simulamos una llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            _id: "1",
            name: "Sistema de Gestión",
            description: "Desarrollo del sistema de gestión de proyectos",
            created_at: "2023-10-15T08:00:00Z",
            total: 12,
            completadas: 8,
            pendientes: 4,
            status: "activo",
            users: 3
          },
          {
            _id: "2",
            name: "Portal de Clientes",
            description: "Creación del nuevo portal para clientes",
            created_at: "2023-10-10T10:30:00Z",
            total: 7,
            completadas: 2,
            pendientes: 5,
            status: "activo",
            users: 2
          },
          {
            _id: "3",
            name: "Migración de Datos",
            description: "Migración de la base de datos a la nueva versión",
            created_at: "2023-09-20T14:15:00Z",
            total: 5,
            completadas: 5,
            pendientes: 0,
            status: "completado",
            users: 1
          }
        ]);
      }, 500);
    });
  };
  
  export const fetchProjectStatus = async (projectId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: projectId,
          name: "Sistema de Gestión",
          description: "Desarrollo del sistema de gestión de proyectos",
          created_at: "2023-10-15T08:00:00Z",
          total: 12,
          completadas: 8,
          pendientes: 4,
          status: "activo",
          users: 3,
          tareas: [
            {
              id: "101",
              descripcion: "Diseño de la base de datos",
              prioridad: "alta",
              estado: "completada",
              completada: true,
              creada_en: "2023-10-15T09:00:00Z",
              usuario: "Ana Martínez"
            },
            {
              id: "102",
              descripcion: "Implementación de API",
              prioridad: "alta",
              estado: "completada",
              completada: true,
              creada_en: "2023-10-16T10:00:00Z",
              usuario: "Carlos Ruiz"
            },
            {
              id: "103",
              descripcion: "Desarrollo del frontend",
              prioridad: "media",
              estado: "en progreso",
              completada: false,
              creada_en: "2023-10-17T11:00:00Z",
              usuario: "Juan Pérez"
            },
            {
              id: "104",
              descripcion: "Pruebas de integración",
              prioridad: "media",
              estado: "pendiente",
              completada: false,
              creada_en: "2023-10-18T12:00:00Z",
              usuario: null
            }
          ]
        });
      }, 500);
    });
  };