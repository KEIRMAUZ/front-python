# Frontend - Gestión de Proyectos

Frontend desarrollado en React con Vite que se conecta al backend Python para gestionar proyectos, tareas y usuarios.

## 🚀 Características

- **React 18** con Vite para desarrollo rápido
- **Tailwind CSS** para estilos modernos y responsivos
- **React Icons** para iconografía
- **Conexión con backend Python** a través de API REST
- **Manejo de errores** robusto
- **Interfaz intuitiva** para gestión de proyectos

## 📋 Requisitos

- Node.js 16 o superior
- Backend Python ejecutándose en `http://localhost:8000`
- Conexión a MongoDB Atlas configurada en el backend

## 🛠️ Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar el backend**:
   - Asegúrate de que el backend Python esté ejecutándose
   - Verifica que esté en `http://localhost:8000`
   - Si necesitas cambiar la URL, edita `src/config.js`

3. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

El frontend estará disponible en: `http://localhost:5173`

## 🔧 Configuración

### Cambiar URL del Backend

Edita el archivo `src/config.js`:

```javascript
const config = {
  API_BASE_URL: 'http://localhost:8000/api', // Cambia esta URL
  // ... otras configuraciones
};
```

### Variables de Entorno

Para producción, puedes usar variables de entorno:

```bash
REACT_APP_API_URL=https://tu-backend.com/api
```

## 📱 Funcionalidades

### Dashboard de Proyectos
- Vista general de todos los proyectos
- Estadísticas de tareas completadas/pendientes
- Creación de nuevos proyectos
- Navegación a detalles de proyectos

### Detalles de Proyecto
- Lista de tareas del proyecto
- Creación de nuevas tareas
- Marcado de tareas como completadas
- Eliminación de tareas
- Estadísticas del proyecto

### Gestión de Tareas
- Crear tareas con prioridad y asignación
- Actualizar estado de tareas
- Eliminar tareas
- Filtrado por estado

## 🔗 Conexión con el Backend

El frontend se conecta al backend Python a través de los siguientes endpoints:

### Proyectos
- `GET /api/projects` - Obtener todos los proyectos
- `GET /api/projects/{id}` - Obtener proyecto específico
- `POST /api/projects` - Crear nuevo proyecto
- `PUT /api/projects/{id}` - Actualizar proyecto
- `DELETE /api/projects/{id}` - Eliminar proyecto

### Tareas
- `GET /api/projects/{id}/tasks` - Obtener tareas de un proyecto
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/{id}` - Actualizar tarea
- `DELETE /api/tasks/{id}` - Eliminar tarea

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear nuevo usuario

## 🐛 Solución de Problemas

### Error de Conexión al Backend
- Verifica que el backend esté ejecutándose en `http://localhost:8000`
- Revisa la consola del navegador para errores de CORS
- Asegúrate de que el backend tenga CORS configurado correctamente

### Error de CORS
Si ves errores de CORS, verifica que el backend tenga configurado:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Datos no se cargan
- Verifica la conexión a MongoDB Atlas en el backend
- Revisa los logs del backend para errores
- Asegúrate de que la base de datos tenga datos iniciales

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── AddTaskForm.jsx
│   ├── Header.jsx
│   ├── ProjectCard.jsx
│   ├── ProjectCreation.jsx
│   ├── ProjectDashboard.jsx
│   ├── ProjectDetail.jsx
│   ├── Sidebar.jsx
│   └── TaskList.jsx
├── services/           # Servicios de API
│   ├── api.js         # Funciones de comunicación con el backend
│   └── tailwindLoad.jsx
├── config.js          # Configuración de la aplicación
├── App.jsx           # Componente principal
├── main.jsx          # Punto de entrada
└── index.css         # Estilos globales
```

## 🚀 Scripts Disponibles

- `npm run dev` - Ejecutar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

## 📝 Notas de Desarrollo

- El frontend usa `fetch` nativo para las peticiones HTTP
- Los errores se manejan de forma centralizada en `src/services/api.js`
- La configuración está centralizada en `src/config.js`
- Los componentes usan Tailwind CSS para estilos
- El estado se maneja con React hooks

## 🔄 Flujo de Datos

1. **Carga inicial**: El frontend verifica la salud del backend
2. **Dashboard**: Carga la lista de proyectos desde la API
3. **Detalles**: Al seleccionar un proyecto, carga sus tareas
4. **Creación**: Los formularios envían datos al backend
5. **Actualización**: Los cambios se reflejan inmediatamente en la UI

## 📊 Estado de la Aplicación

- **Proyectos**: Lista de todos los proyectos con estadísticas
- **Proyecto seleccionado**: Proyecto actual con sus tareas
- **Vista actual**: Dashboard, detalles o creación
- **Estado de carga**: Indicadores de carga y errores
