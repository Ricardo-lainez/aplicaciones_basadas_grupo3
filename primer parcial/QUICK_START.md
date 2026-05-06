# ⚡ Quick Start (5 Minutos)

## Opción 1: Con Python (Recomendado)

### Paso 1: Instalar dependencias del backend
```bash
cd Backend
pip install -r requirements.txt
```

### Paso 2: Configurar API key
Crea el archivo `Backend/.env`:
```
GROQ_API_KEY=tu_api_key_aqui
```

**Obtén tu API key gratis en:** https://console.groq.com

### Paso 3: Ejecutar backend
```bash
cd Backend
python main.py
```

### Paso 4: Ejecutar frontend (otra terminal)
```bash
python serve_frontend.py
```

### Paso 5: Abrir en navegador
```
http://localhost:8081
```

✅ **¡Listo!**

---

## Opción 2: Con Node.js

### Paso 1-3: Igual que la opción 1

### Paso 4: Instalar http-server
```bash
npm install -g http-server
```

### Paso 5: Servir frontend
```bash
cd Frontend
http-server
```

### Paso 6: Abrir navegador
Se abrirá automáticamente en `http://localhost:8081`

---

## Opción 3: Sin instalar nada (Solo Python 3)

### Paso 1-3: Igual que la opción 1

### Paso 4: Servir frontend
```bash
cd Frontend
python -m http.server 8081
```

### Paso 5: Abrir navegador
```
http://localhost:8081
```

---

## ✅ Verificación Rápida

1. **Abre:** http://localhost:8080
2. **Deberías ver:** El logo "🤖 Chatbot RAG"
3. **En la consola (F12):** "Backend conectado" ✅

Si todo está verde, ¡está listo! 🎉

---

## 🐛 Problema Rápido?

| Problema | Solución |
|----------|----------|
| "Backend no disponible" | Asegúrate que `python main.py` está corriendo |
| "GROQ_API_KEY no encontrada" | Crea `.env` en Backend/ con tu API key |
| "Puerto 8000 en uso" | Cambia en `Backend/main.py` el puerto |
| "No se carga la página" | Verifica que el servidor frontend esté corriendo |

---

## 📖 Documentación Completa

- [INSTRUCCIONES.md](INSTRUCCIONES.md) - Guía detallada
- [Frontend/README.md](Frontend/README.md) - Documentación del frontend
- [Frontend/ARQUITECTURA.md](Frontend/ARQUITECTURA.md) - Arquitectura MVC
- [Frontend/CLEAN_CODE.md](Frontend/CLEAN_CODE.md) - Principios aplicados

---

## 🚀 Próximos Pasos

1. **Ingestar documentos** (PDF, TXT, DOCX)
2. **Hacer preguntas** sobre los documentos
3. **Explorar** la interfaz

---

**¡Disfruta del chatbot! 🤖**
