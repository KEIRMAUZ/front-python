import os
from typing import Optional

class Settings:
    # MongoDB Configuration
    MONGODB_URI: str = "mongodb+srv://keirmauz:<db_password>@cluster0.yvdjajg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    DATABASE_NAME: str = "gestion_proyectos"
    
    # API Configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Gestión de Proyectos API"
    VERSION: str = "1.0.0"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:3000",  # React dev server
        "http://127.0.0.1:3000",
    ]
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    @classmethod
    def get_mongodb_uri(cls) -> str:
        """Obtener la URI de MongoDB con la contraseña configurada"""
        # Aquí puedes implementar lógica para obtener la contraseña de variables de entorno
        # Por ahora, se mantiene como está en el código
        return cls.MONGODB_URI
    
    @classmethod
    def get_database_name(cls) -> str:
        """Obtener el nombre de la base de datos"""
        return cls.DATABASE_NAME

# Instancia global de configuración
settings = Settings() 