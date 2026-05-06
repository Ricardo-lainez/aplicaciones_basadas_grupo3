# Frontend - Chatbot RAG

## 📋 Descripción

Frontend moderno y profesional para una aplicación de Chatbot con RAG (Retrieval Augmented Generation). Implementa **MVC (Modelo-Vista-Controlador)** y **Clean Code** siguiendo mejores prácticas de desarrollo.

## 🏗️ Arquitectura

### Patrón MVC

```
Frontend/
├── js/
│   ├── models/          # Lógica de datos
│   │   ├── Document.js  # Modelo de documentos
│   │   └── Chat.js      # Modelo de mensajes de chat
│   ├── views/           # Interfaz de usuario
│   │   ├── DocumentView.js
│   │   └── ChatView.js
│   ├── controllers/     # Controladores (lógica de negocio)
│   │   ├── DocumentController.js
│   │   └── ChatController.js
│   ├── services/        # Servicios (comunicación con API)
│   │   └── ApiService.js
│   ├── config.js        # Configuración global
│   └── app.js           # Punto de entrada
├── css/
│   └── styles.css       # Estilos (responsive, variables CSS)
├── index.html           # Página principal
└── README.md            # Este archivo
```

## ✨ Características

- ✅ **MVC Limpio**: Separación clara de responsabilidades
- ✅ **Clean Code**: Código legible, bien documentado y mantenible
- ✅ **Responsive Design**: Funciona en desktop y móviles
- ✅ **Sin dependencias externas**: Vanilla JavaScript puro
- ✅ **LocalStorage**: Persistencia de documentos y mensajes
- ✅ **Validación**: Validación de archivos y mensajes
- ✅ **Error Handling**: Manejo robusto de errores
- ✅ **Accesibilidad**: Semántica HTML correcta y ARIA labels
- ✅ **Seguridad**: Escape de HTML para prevenir XSS

## 🚀 Cómo empezar

### Requisitos
- Backend ejecutándose en `http://localhost:8000`
- Un navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalación

1. **Descarga el proyecto**
   ```bash
   # El frontend ya está en:
   # Sexto semestre/Aplicaciones basadas/Primer parcial/Frontend/
   ```

2. **Abre el archivo index.html**
   
   **Opción A: Con script personalizado (Recomendado)**
   ```bash
   # Desde la raíz del proyecto
   python serve_frontend.py
   
   # Luego abre: http://localhost:8081
   ```

   **Opción B: Servidor Python**
   ```bash
   cd Frontend
   python -m http.server 8081
   
   # Luego abre: http://localhost:8081
   ```

   **Opción C: Con Node.js**
   ```bash
   npm install -g http-server
   cd Frontend
   http-server -p 8081
   ```

   **Opción D: Abre directamente en el navegador**
   ```
   Haz doble clic en index.html (algunos navegadores tienen restricciones CORS)
   ```

## 📖 Uso

### 1. Ingestar Documentos
- Haz clic en "📁 Arrastra archivos aquí" o selecciona manualmente
- Archivos permitidos: PDF, TXT, DOCX, DOC
- Tamaño máximo: 50MB
- Haz clic en "⬆️ Subir Documento"
- El documento se procesará y almacenará en la BD vectorial

### 2. Hacer Preguntas
- Una vez ingresados documentos, escribe una pregunta en el chat
- El chatbot responderá basándose **solo** en los documentos ingresados
- El historial se guarda automáticamente

### 3. Gestionar Datos
- Visualiza todos los documentos ingresados en el panel izquierdo
- Limpia el historial con "🗑️ Limpiar Historial"
- Verifica la conexión con "🔄 Actualizar"

## 🔗 Integración con Backend

El frontend se conecta automáticamente con el backend en `http://localhost:8000`.

### Endpoints utilizados

```javascript
// Verificar salud del backend
GET /

// Ingestar documento
POST /ingestar/
  body: FormData { file: File }
  response: { filename, status, info }

// Hacer pregunta
POST /chat/
  body: pregunta=string
  response: { pregunta, respuesta }
```

## 🎨 Estructura de Clases

### Models
```javascript
Document
├── new Document(id, filename, status, uploadDate, info)
├── isValid()
├── toJSON()
└── static fromJSON()

ChatMessage
├── new ChatMessage(id, content, sender, timestamp)
├── isValid()
├── toJSON()
├── static fromJSON()
├── static createUserMessage()
└── static createAssistantMessage()
```

### Views
```javascript
DocumentView
├── bindEvents()
├── renderDocuments(documents)
├── showLoading()
├── hideLoading()
├── showMessage(message, type)
└── setUploadEnabled(enabled)

ChatView
├── bindEvents()
├── renderMessages(messages)
├── addMessage(message)
├── showLoading()
├── hideLoading()
└── scrollToBottom()
```

### Controllers
```javascript
DocumentController
├── handleFileSelected(file)
├── handleUpload(file)
├── validateFile(file)
└── getDocuments()

ChatController
├── handleSendMessage(content)
├── validateMessage(message)
├── clearHistory()
└── getMessages()
```

### Services
```javascript
ApiService (Singleton)
├── request(endpoint, options)
├── checkHealth()
├── ingestDocument(file)
└── sendQuestion(pregunta)
```

## 🛡️ Validación y Seguridad

### Validación de Archivos
- Solo acepta: PDF, TXT, DOCX, DOC
- Tamaño máximo: 50MB
- Valida antes de enviar al servidor

### Validación de Mensajes
- No acepta mensajes vacíos
- Máximo 5000 caracteres
- Valida antes de enviar

### Seguridad
- Escape de HTML en todos los textos renderizados
- Prevención de XSS
- Timeout en las peticiones HTTP (30s)
- CORS configurado desde backend

## 💾 Almacenamiento Local

El frontend utiliza `localStorage` para persistencia:

```javascript
// Documentos
localStorage.getItem('documents')

// Mensajes de chat
localStorage.getItem('chatMessages')
```

## 🔧 Configuración

Edit `js/config.js` para cambiar:

```javascript
API_BASE_URL: 'http://localhost:8000'  // URL del backend
TIMEOUT: 30000                          // Timeout HTTP (ms)
MAX_FILE_SIZE: 50 * 1024 * 1024         // Tamaño máximo
ALLOWED_FILE_TYPES: ['.pdf', ...]       // Tipos permitidos
```

## 📱 Responsive

- **Desktop**: Diseño de dos columnas (documentos + chat)
- **Tablet**: Diseño adaptativo
- **Móvil**: Una columna con scroll

## 🎯 Principios de Clean Code Aplicados

1. **Nombres significativos**: Variables, funciones y clases claras
2. **Funciones pequeñas**: Cada función hace una cosa bien
3. **Comments necesarios**: Solo donde la lógica no es obvia
4. **DRY (Don't Repeat Yourself)**: Evita duplicación
5. **SOLID Principles**: Responsabilidad única, abierto/cerrado
6. **Error Handling**: Try-catch y validación completa
7. **Documentación JSDoc**: Comentarios en cada función
8. **Modularidad**: Fácil de entender, modificar y extender

## 🚦 Estados de la Aplicación

```
📊 Documentos:
  - pending    → Esperando subir
  - processing → Siendo procesado
  - completed  → Listo
  - error      → Error en procesamiento

💬 Chat:
  - idle       → Sin cargar
  - loading    → Esperando respuesta
  - ready      → Listo para siguiente pregunta
```

## 🐛 Debugging

Abre la consola del navegador (F12) para ver:
- Logs de la aplicación
- Errores de red
- Estado de la conexión con backend

```javascript
// Ver documentos almacenados
console.log(JSON.parse(localStorage.getItem('documents')))

// Ver mensajes de chat
console.log(JSON.parse(localStorage.getItem('chatMessages')))
```

## 📈 Mejoras Futuras

- [ ] Soporte para más formatos (Excel, PowerPoint)
- [ ] Descarga de conversaciones
- [ ] Temas oscuro/claro
- [ ] Múltiples sesiones de chat
- [ ] Búsqueda en historial
- [ ] Compartir conversaciones

## 📝 Licencia

Este proyecto es de código abierto.

## 👨‍💻 Autor

Desarrollado con ❤️ como parte del proyecto de Aplicaciones Basadas en IA.

---

**¿Preguntas?** Revisa los comentarios en el código o consulta la documentación del backend.
