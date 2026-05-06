# 🚀 Guía de Ejecución Completa

## Backend y Frontend Integrados

Este documento explica cómo ejecutar correctamente la aplicación completa.

---

## 📋 Requisitos

- **Python 3.8+** para el backend
- **Navegador moderno** para el frontend
- **pip** para instalar dependencias Python

---

## 🔧 Configuración del Backend

### 1. Instalar dependencias

```bash
cd Backend
pip install -r requirements.txt
```

Si no existe `requirements.txt`, instala manualmente:

```bash
pip install fastapi uvicorn python-dotenv llama-index chromadb groq huggingface_hub
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `Backend/`:

```env
GROQ_API_KEY=tu_api_key_aqui
```

Obtén tu API key en: https://console.groq.com

### 3. Ejecutar el backend

```bash
cd Backend
python main.py
```

O con uvicorn:

```bash
cd Backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Resultado esperado:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Verifica que funcione:
- Abre http://localhost:8000 en el navegador
- Deberías ver: `{"status": "online", "message": "Backend de Chatbot listo"}`

---

## 🌐 Configuración del Frontend

### 1. Verificar URL del backend

Abre `Frontend/js/config.js` y verifica:

```javascript
API_BASE_URL: 'http://localhost:8000'
```

### 2. Ejecutar el frontend (Opción A - Script personalizado)

```bash
python serve_frontend.py
```

Abre: http://localhost:8081

### 2. Ejecutar el frontend (Opción B - Node.js Server)

```bash
# Instalar primero (una sola vez)
npm install -g http-server

# Ejecutar
cd Frontend
http-server
```

Abre: http://localhost:8000 (o la URL que muestre)

### 2. Ejecutar el frontend (Opción C - Navegador directo)

```bash
# Windows
start Frontend/index.html

# macOS
open Frontend/index.html

# Linux
xdg-open Frontend/index.html
```

⚠️ **Nota**: Algunos navegadores tienen restricciones CORS si abres directamente. Usa Opción A o B.

---

## ✅ Verificación de Conexión

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Deberías ver: "Backend conectado correctamente"

Si ves error, verifica:
- El backend está corriendo en puerto 8000
- El CORS está configurado en el backend
- No hay firewall bloqueando la conexión

---

## 📖 Flujo de Uso

### 1️⃣ Ingestar un documento

```
1. Abre el frontend (http://localhost:8080)
2. En "Mis Documentos", arrastra o selecciona un archivo
3. Haz clic en "Subir Documento"
4. Espera a que aparezca estado "Completado"
```

### 2️⃣ Hacer preguntas

```
1. En el panel "Chat", escribe una pregunta
2. Haz clic en "Enviar" o presiona Enter
3. Espera a que el chatbot responda
4. El historial se guarda automáticamente
```

---

## 🔍 Estructura de Carpetas Final

```
Sexto semestre/Aplicaciones basadas/Primer parcial/
├── Backend/
│   ├── main.py                    # API principal
│   ├── services/
│   │   ├── chat.py               # Lógica de chat
│   │   └── ingesta.py            # Ingesta de documentos
│   ├── data/
│   │   └── chroma_db/            # Base de datos vectorial
│   ├── temp_uploads/             # Archivos temporales
│   ├── .env                       # Variables de entorno
│   └── requirements.txt           # Dependencias (CREAR)
│
└── Frontend/
    ├── index.html                 # Página principal
    ├── README.md                  # Documentación
    ├── js/
    │   ├── app.js                # Punto de entrada
    │   ├── config.js             # Configuración
    │   ├── models/
    │   │   ├── Document.js
    │   │   └── Chat.js
    │   ├── views/
    │   │   ├── DocumentView.js
    │   │   └── ChatView.js
    │   ├── controllers/
    │   │   ├── DocumentController.js
    │   │   └── ChatController.js
    │   └── services/
    │       └── ApiService.js
    └── css/
        └── styles.css            # Estilos
```

---

## 🐛 Solución de Problemas

### ❌ "Backend no disponible"

**Causa**: El backend no está corriendo

**Solución**:
```bash
cd Backend
python main.py
```

### ❌ Error CORS

**Causa**: Backend no permite peticiones del frontend

**Solución**: Verifica que en `Backend/main.py` esté:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### ❌ "GROQ_API_KEY no encontrada"

**Causa**: No configuraste las variables de entorno

**Solución**:
1. Crea `Backend/.env`
2. Agrega: `GROQ_API_KEY=tu_api_key`
3. Reinicia el backend

### ❌ "ModuleNotFoundError"

**Causa**: Falta instalar dependencias

**Solución**:
```bash
cd Backend
pip install fastapi uvicorn python-dotenv llama-index chromadb groq huggingface_hub
```

### ❌ Documento no se procesa

**Causa**: Archivo corrompido o formato no soportado

**Solución**:
- Verifica que sea PDF, TXT, DOCX o DOC
- Verifica que el archivo no esté vacío
- Intenta con otro archivo

---

## 🎯 Resumen

| Componente | Comando | URL |
|-----------|---------|-----|
| Backend | `python main.py` | http://localhost:8000 |
| Frontend | `python serve_frontend.py` | http://localhost:8081 |

---

## 📚 Documentación Adicional

- [Backend - main.py](Backend/main.py)
- [Frontend - README.md](Frontend/README.md)
- [Servicios de Ingesta](Backend/services/ingesta.py)
- [Servicios de Chat](Backend/services/chat.py)

---

**¡Listo para usar!** 🎉

Si tienes problemas, revisa los logs en la consola de Python o en la consola del navegador (F12).
