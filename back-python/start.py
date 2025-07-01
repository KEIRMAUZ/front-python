#!/usr/bin/env python3
"""
Script de inicio para el backend de Gestión de Proyectos
"""

import sys
import subprocess
import os

def print_banner():
    print("=" * 60)
    print("🚀 Backend Python - Gestión de Proyectos")
    print("=" * 60)

def print_menu():
    print("\n📋 Opciones disponibles:")
    print("1. 🏃 Ejecutar servidor de desarrollo")
    print("2. 🔄 Ejecutar servidor con recarga automática")
    print("3. 🗄️  Inicializar base de datos")
    print("4. 📚 Ver documentación de la API")
    print("5. 🏥 Verificar estado de salud")
    print("6. 📦 Instalar dependencias")
    print("0. ❌ Salir")
    print("-" * 60)

def install_dependencies():
    print("📦 Instalando dependencias...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencias instaladas correctamente")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando dependencias: {e}")
        return False
    return True

def run_development_server():
    print("🏃 Iniciando servidor de desarrollo...")
    try:
        subprocess.run([sys.executable, "main.py"])
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")

def run_reload_server():
    print("🔄 Iniciando servidor con recarga automática...")
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")

def init_database():
    print("🗄️ Inicializando base de datos...")
    try:
        subprocess.run([sys.executable, "init_db.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error inicializando base de datos: {e}")

def show_documentation():
    print("📚 Documentación de la API:")
    print("   • Swagger UI: http://localhost:8000/docs")
    print("   • ReDoc: http://localhost:8000/redoc")
    print("   • Endpoints disponibles:")
    print("     - GET /api/projects")
    print("     - GET /api/projects/{project_id}")
    print("     - POST /api/projects")
    print("     - PUT /api/projects/{project_id}")
    print("     - DELETE /api/projects/{project_id}")
    print("     - GET /api/projects/{project_id}/tasks")
    print("     - POST /api/tasks")
    print("     - PUT /api/tasks/{task_id}")
    print("     - DELETE /api/tasks/{task_id}")
    print("     - GET /api/users")
    print("     - POST /api/users")

def health_check():
    print("🏥 Verificando estado de salud...")
    try:
        import requests
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Servidor: {data.get('status', 'unknown')}")
            print(f"✅ Base de datos: {data.get('database', 'unknown')}")
        else:
            print(f"❌ Error en el servidor: {response.status_code}")
    except ImportError:
        print("❌ requests no está instalado. Instalando...")
        subprocess.run([sys.executable, "-m", "pip", "install", "requests"])
        health_check()
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor. Asegúrate de que esté ejecutándose.")
    except Exception as e:
        print(f"❌ Error verificando estado: {e}")

def main():
    print_banner()
    
    while True:
        print_menu()
        
        try:
            choice = input("🔢 Selecciona una opción: ").strip()
            
            if choice == "0":
                print("👋 ¡Hasta luego!")
                break
            elif choice == "1":
                run_development_server()
            elif choice == "2":
                run_reload_server()
            elif choice == "3":
                init_database()
            elif choice == "4":
                show_documentation()
            elif choice == "5":
                health_check()
            elif choice == "6":
                install_dependencies()
            else:
                print("❌ Opción no válida. Intenta de nuevo.")
                
        except KeyboardInterrupt:
            print("\n👋 ¡Hasta luego!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 