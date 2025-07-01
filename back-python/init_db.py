from pymongo import MongoClient
from datetime import datetime

MONGODB_URI = "mongodb+srv://keirmauz:Godzila23__@cluster0.yvdjajg.mongodb.net/gestion_proyectos?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGODB_URI)
db = client.get_default_database()

def init_database():
    try:
        print("🔄 Inicializando base de datos...")

        db.projects.drop()
        db.tasks.drop()
        db.users.drop()

        users_data = [
            {
                "name": "Ana Martínez",
                "email": "ana.martinez@empresa.com",
                "role": "developer",
                "created_at": datetime.utcnow()
            },
            {
                "name": "Carlos Ruiz",
                "email": "carlos.ruiz@empresa.com",
                "role": "developer",
                "created_at": datetime.utcnow()
            },
            {
                "name": "Juan Pérez",
                "email": "juan.perez@empresa.com",
                "role": "developer",
                "created_at": datetime.utcnow()
            }
        ]

        users_result = db.users.insert_many(users_data)
        print(f"✅ {len(users_result.inserted_ids)} usuarios creados")

        projects_data = [
            {
                "name": "Sistema de Gestión",
                "description": "Desarrollo del sistema de gestión de proyectos",
                "created_at": datetime(2023, 10, 15, 8, 0, 0),
                "status": "Activo",
                "users": 3
            },
            {
                "name": "Portal de Clientes",
                "description": "Creación del nuevo portal para clientes",
                "created_at": datetime(2023, 10, 10, 10, 30, 0),
                "status": "Activo",
                "users": 2
            },
            {
                "name": "Migración de Datos",
                "description": "Migración de la base de datos a la nueva versión",
                "created_at": datetime(2023, 9, 20, 14, 15, 0),
                "status": "Completado",
                "users": 1
            }
        ]

        projects_result = db.projects.insert_many(projects_data)
        print(f"✅ {len(projects_result.inserted_ids)} proyectos creados")

        project_ids = list(projects_result.inserted_ids)

        tasks_data = [
            {
                "descripcion": "Diseño de la base de datos",
                "prioridad": "alta",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 10, 15, 9, 0, 0),
                "usuario": "Ana Martínez",
                "project_id": str(project_ids[0])
            },
            {
                "descripcion": "Implementación de API",
                "prioridad": "alta",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 10, 16, 10, 0, 0),
                "usuario": "Carlos Ruiz",
                "project_id": str(project_ids[0])
            },
            {
                "descripcion": "Desarrollo del frontend",
                "prioridad": "media",
                "estado": "en progreso",
                "completada": False,
                "creada_en": datetime(2023, 10, 17, 11, 0, 0),
                "usuario": "Juan Pérez",
                "project_id": str(project_ids[0])
            },
            {
                "descripcion": "Pruebas de integración",
                "prioridad": "media",
                "estado": "pendiente",
                "completada": False,
                "creada_en": datetime(2023, 10, 18, 12, 0, 0),
                "usuario": None,
                "project_id": str(project_ids[0])
            },
            {
                "descripcion": "Configuración del servidor",
                "prioridad": "alta",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 10, 19, 8, 0, 0),
                "usuario": "Ana Martínez",
                "project_id": str(project_ids[0])
            },
            {
                "descripcion": "Documentación técnica",
                "prioridad": "baja",
                "estado": "pendiente",
                "completada": False,
                "creada_en": datetime(2023, 10, 20, 14, 0, 0),
                "usuario": None,
                "project_id": str(project_ids[0])
            },
            {
                "descripcion": "Diseño de la interfaz",
                "prioridad": "alta",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 10, 10, 11, 0, 0),
                "usuario": "Ana Martínez",
                "project_id": str(project_ids[1])
            },
            {
                "descripcion": "Desarrollo del backend",
                "prioridad": "alta",
                "estado": "en progreso",
                "completada": False,
                "creada_en": datetime(2023, 10, 11, 9, 0, 0),
                "usuario": "Carlos Ruiz",
                "project_id": str(project_ids[1])
            },
            {
                "descripcion": "Implementación de autenticación",
                "prioridad": "media",
                "estado": "pendiente",
                "completada": False,
                "creada_en": datetime(2023, 10, 12, 10, 0, 0),
                "usuario": None,
                "project_id": str(project_ids[1])
            },
            {
                "descripcion": "Análisis de datos existentes",
                "prioridad": "alta",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 9, 20, 15, 0, 0),
                "usuario": "Juan Pérez",
                "project_id": str(project_ids[2])
            },
            {
                "descripcion": "Creación de scripts de migración",
                "prioridad": "alta",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 9, 21, 10, 0, 0),
                "usuario": "Juan Pérez",
                "project_id": str(project_ids[2])
            },
            {
                "descripcion": "Ejecución de migración",
                "prioridad": "alta",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 9, 22, 8, 0, 0),
                "usuario": "Juan Pérez",
                "project_id": str(project_ids[2])
            },
            {
                "descripcion": "Validación de datos migrados",
                "prioridad": "media",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 9, 23, 14, 0, 0),
                "usuario": "Juan Pérez",
                "project_id": str(project_ids[2])
            },
            {
                "descripcion": "Optimización de consultas",
                "prioridad": "media",
                "estado": "completada",
                "completada": True,
                "creada_en": datetime(2023, 9, 24, 11, 0, 0),
                "usuario": "Juan Pérez",
                "project_id": str(project_ids[2])
            }
        ]

        tasks_result = db.tasks.insert_many(tasks_data)
        print(f"✅ {len(tasks_result.inserted_ids)} tareas creadas")

        print("\n🎉 Base de datos inicializada exitosamente!")
        print(f"📊 Resumen:")
        print(f"   - Usuarios: {len(users_result.inserted_ids)}")
        print(f"   - Proyectos: {len(projects_result.inserted_ids)}")
        print(f"   - Tareas: {len(tasks_result.inserted_ids)}")

        print(f"\n📈 Estadísticas de proyectos:")
        for i, project_id in enumerate(project_ids):
            project = db.projects.find_one({"_id": project_id})
            tasks = list(db.tasks.find({"project_id": str(project_id)}))
            completed = len([t for t in tasks if t.get("completada", False)])
            print(f"   - {project['name']}: {len(tasks)} tareas totales, {completed} completadas")

        client.close()

    except Exception as e:
        print(f"❌ Error inicializando la base de datos: {e}")

if __name__ == "__main__":
    init_database()
