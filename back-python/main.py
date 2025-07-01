from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
import json

app = FastAPI(title="Gestión de Proyectos API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URI = "mongodb+srv://keirmauz:Godzila23__@cluster0.yvdjajg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "gestion_proyectos"

try:
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    client.admin.command('ping')
except PyMongoError as e:
    client = None
    db = None
class TaskBase(BaseModel):
    descripcion: str
    prioridad: str = "media"
    estado: str = "pendiente"
    completada: bool = False
    usuario: Optional[str] = None
    project_id: str
    fecha_limite: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str = Field(alias="_id")
    creada_en: datetime
    
    class Config:
        populate_by_name = True

class ProjectBase(BaseModel):
    name: str
    description: str
    status: str = "Activo"
    users: int = 0

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    _id: str
    created_at: datetime
    total: int = 0
    completadas: int = 0
    pendientes: int = 0
    
    class Config:
        populate_by_name = True

class UserBase(BaseModel):
    name: str
    email: str
    role: str = "user"

class UserCreate(UserBase):
    pass

class User(UserBase):
    _id: str
    created_at: datetime
    
    class Config:
        populate_by_name = True

def get_db():
    if db is None:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")
    return db
@app.get("/api/projects")
async def get_projects():
    try:
        db = get_db()
        projects_raw = list(db.projects.find())
        projects = []
        
        for project in projects_raw:
            project_id = str(project["_id"])
            tasks = list(db.tasks.find({"project_id": project_id}))
            
            project_data = {
                "_id": project_id,
                "name": project.get("name", ""),
                "description": project.get("description", ""),
                "status": project.get("status", "Activo"),
                "users": project.get("users", 0),
                "created_at": project.get("created_at"),
                "total": len(tasks),
                "completadas": len([t for t in tasks if t.get("completada", False)]),
                "pendientes": len(tasks) - len([t for t in tasks if t.get("completada", False)])
            }
            
            projects.append(project_data)
        
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener proyectos: {str(e)}")

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    try:
        db = get_db()
        
        if not project_id or project_id == "undefined":
            raise HTTPException(status_code=400, detail="ID de proyecto inválido o no proporcionado")
        
        try:
            object_id = ObjectId(project_id)
        except Exception:
            raise HTTPException(status_code=400, detail=f"ID de proyecto inválido: {project_id}")
        
        project = db.projects.find_one({"_id": object_id})
        if not project:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
        tasks = list(db.tasks.find({"project_id": project_id}))
        project["total"] = len(tasks)
        project["completadas"] = len([t for t in tasks if t.get("completada", False)])
        project["pendientes"] = project["total"] - project["completadas"]
        project["_id"] = str(project["_id"])
        
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener proyecto: {str(e)}")

@app.post("/api/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    try:
        db = get_db()
        project_data = project.dict()
        project_data["created_at"] = datetime.utcnow()
        
        result = db.projects.insert_one(project_data)
        project_data["_id"] = str(result.inserted_id)
        
        return project_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear proyecto: {str(e)}")

@app.put("/api/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project: ProjectCreate):
    """Actualizar un proyecto"""
    try:
        db = get_db()
        project_data = project.dict()
        
        result = db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": project_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
        # Obtener el proyecto actualizado
        updated_project = db.projects.find_one({"_id": ObjectId(project_id)})
        updated_project["_id"] = str(updated_project["_id"])
        
        return updated_project
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar proyecto: {str(e)}")

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    """Eliminar un proyecto y sus tareas asociadas"""
    try:
        db = get_db()
        
        db.tasks.delete_many({"project_id": project_id})
        
        result = db.projects.delete_one({"_id": ObjectId(project_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
        return {"message": "Proyecto eliminado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar proyecto: {str(e)}")

@app.get("/api/projects/{project_id}/tasks", response_model=List[Task])
async def get_project_tasks(project_id: str):
    try:
        db = get_db()
        tasks = list(db.tasks.find({"project_id": project_id}))
        
        for task in tasks:
            task["id"] = str(task["_id"])
            task["_id"] = str(task["_id"])
        
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tareas: {str(e)}")

@app.post("/api/tasks", response_model=Task)
async def create_task(task: TaskCreate):
    try:
        db = get_db()
        task_data = task.dict()
        task_data["creada_en"] = datetime.utcnow()
        
        result = db.tasks.insert_one(task_data)
        task_data["id"] = str(result.inserted_id)
        task_data["_id"] = str(result.inserted_id)
        
        return task_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear tarea: {str(e)}")

@app.put("/api/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task: TaskCreate):
    try:
        db = get_db()
        task_data = task.dict()
        
        result = db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": task_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        
        updated_task = db.tasks.find_one({"_id": ObjectId(task_id)})
        updated_task["id"] = str(updated_task["_id"])
        updated_task["_id"] = str(updated_task["_id"])
        
        return updated_task
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar tarea: {str(e)}")

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    try:
        db = get_db()
        result = db.tasks.delete_one({"_id": ObjectId(task_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        
        return {"message": "Tarea eliminada exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar tarea: {str(e)}")

@app.get("/api/users")
async def get_users():
    try:
        db = get_db()
        users = list(db.users.find())
        
        for user in users:
            user["_id"] = str(user["_id"])
        
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios: {str(e)}")

@app.post("/api/users", response_model=User)
async def create_user(user: UserCreate):
    try:
        db = get_db()
        user_data = user.dict()
        user_data["created_at"] = datetime.utcnow()
        
        result = db.users.insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)
        
        return user_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear usuario: {str(e)}")

@app.put("/api/users/{user_id}")
async def update_user(user_id: str, user: UserCreate):
    try:
        db = get_db()
        user_data = user.dict()
        
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": user_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        updated_user = db.users.find_one({"_id": ObjectId(user_id)})
        updated_user["_id"] = str(updated_user["_id"])
        
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar usuario: {str(e)}")

@app.delete("/api/users/{user_id}")
async def delete_user(user_id: str):
    try:
        db = get_db()
        result = db.users.delete_one({"_id": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return {"message": "Usuario eliminado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {str(e)}")

@app.get("/")
async def root():
    return {"message": "API de Gestión de Proyectos funcionando correctamente"}

@app.get("/test")
async def test_endpoint():
    return {
        "status": "ok",
        "message": "Backend funcionando correctamente",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    try:
        if client:
            client.admin.command('ping')
            return {"status": "healthy", "database": "connected"}
        else:
            return {"status": "unhealthy", "database": "disconnected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "error", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 