# Backend Python - Gestión de Proyectos

Backend desarrollado en Python con FastAPI que se conecta a MongoDB Atlas para gestionar proyectos, tareas y usuarios.

## 🚀 Características

- **FastAPI**: Framework web moderno y rápido para Python
- **MongoDB Atlas**: Base de datos en la nube
- **CORS habilitado**: Para comunicación con el frontend React
- **API RESTful**: Endpoints para gestionar proyectos, tareas y usuarios
- **Validación de datos**: Con Pydantic
- **Documentación automática**: Swagger UI en `/docs`

## 📋 Requisitos

- Python 3.8 o superior
- Conexión a internet para MongoDB Atlas
- Contraseña de la base de datos MongoDB Atlas

## 🛠️ Instalación

1. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar la conexión a MongoDB**:
   - Editar el archivo `main.py`
   - Reemplazar `<db_password>` con tu contraseña real de MongoDB Atlas
   - La URL de conexión es: `mongodb+srv://keirmauz:<db_password>@cluster0.yvdjajg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

3. **Inicializar la base de datos** (opcional):
   ```bash
   python init_db.py
   ```

## 🚀 Ejecución

### Desarrollo
```bash
python main.py
```

### Producción con Uvicorn
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

El servidor estará disponible en: `http://localhost:8000`

## 📚 Documentación de la API

Una vez ejecutado el servidor, puedes acceder a:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔗 Endpoints Disponibles

### Proyectos
- `GET /api/projects` - Obtener todos los proyectos
- `GET /api/projects/{project_id}` - Obtener un proyecto específico
- `POST /api/projects` - Crear un nuevo proyecto
- `PUT /api/projects/{project_id}` - Actualizar un proyecto
- `DELETE /api/projects/{project_id}` - Eliminar un proyecto

### Tareas
- `GET /api/projects/{project_id}/tasks` - Obtener tareas de un proyecto
- `POST /api/tasks` - Crear una nueva tarea
- `PUT /api/tasks/{task_id}` - Actualizar una tarea
- `DELETE /api/tasks/{task_id}` - Eliminar una tarea

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear un nuevo usuario

### Utilidades
- `GET /` - Mensaje de bienvenida
- `GET /health` - Estado de salud del servidor y base de datos

## 📊 Estructura de la Base de Datos

### Colección: `projects`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "created_at": "datetime",
  "status": "string (Activo/Completado/Pausado)",
  "users": "number"
}
```

### Colección: `tasks`
```json
{
  "_id": "ObjectId",
  "descripcion": "string",
  "prioridad": "string (baja/media/alta)",
  "estado": "string (pendiente/en progreso/completada)",
  "completada": "boolean",
  "creada_en": "datetime",
  "usuario": "string (opcional)",
  "project_id": "string"
}
```

### Colección: `users`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "role": "string",
  "created_at": "datetime"
}
```

## 🔧 Configuración del Frontend

Para conectar el frontend React con este backend, actualiza el archivo `src/services/api.js` para que haga llamadas reales a la API en lugar de simular datos.

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que la contraseña en la URL de conexión sea correcta
- Asegurar que la IP esté en la lista blanca de MongoDB Atlas
- Verificar que el cluster esté activo

### Error de CORS
- El backend está configurado para aceptar conexiones desde `http://localhost:5173` (Vite)
- Si usas un puerto diferente, actualizar la configuración en `main.py`

## 📝 Notas

- La base de datos se llama `gestion_proyectos`
- Las colecciones son: `projects`, `tasks`, `users`
- El script `init_db.py` crea datos de ejemplo basados en el archivo `api.js` del frontend
- Todas las fechas se almacenan en UTC 