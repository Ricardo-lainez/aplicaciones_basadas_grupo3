#!/usr/bin/env python3
"""
Servidor HTTP simple para servir el frontend
Ejecuta este archivo para abrir el frontend en http://localhost:8080
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configuración
PORT = 8082
FRONTEND_DIR = Path(__file__).parent / "Frontend"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler personalizado para servir el frontend"""
    
    def translate_path(self, path):
        """Traduce la ruta para servir desde la carpeta Frontend"""
        # Remover la barra inicial
        if path.startswith('/'):
            path = path[1:]
        
        # Usar la carpeta Frontend como raíz
        full_path = FRONTEND_DIR / path
        
        # Si es un directorio, servir index.html
        if full_path.is_dir():
            full_path = full_path / "index.html"
        
        return str(full_path)
    
    def end_headers(self):
        """Agregar headers CORS"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Manejar peticiones OPTIONS para CORS"""
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    # Verificar que exista la carpeta Frontend
    if not FRONTEND_DIR.exists():
        print(f"❌ Error: Carpeta {FRONTEND_DIR} no encontrada")
        print("Este script debe estar en la raíz del proyecto")
        sys.exit(1)
    
    # Cambiar a la carpeta del frontend
    os.chdir(FRONTEND_DIR)
    
    # Crear el servidor
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("🚀 Servidor Frontend iniciado")
        print("=" * 60)
        print(f"📁 Sirviendo desde: {FRONTEND_DIR}")
        print(f"🌐 URL: http://localhost:{PORT}")
        print(f"🔗 Backend esperado en: http://localhost:8000")
        print("\n⏹️  Presiona Ctrl+C para detener")
        print("=" * 60)
        print()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor detenido")
            sys.exit(0)
