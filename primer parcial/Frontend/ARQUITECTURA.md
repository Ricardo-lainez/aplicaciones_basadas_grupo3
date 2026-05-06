# 🏛️ Arquitectura de la Aplicación

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO (Navegador)                       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼──────────┐    ┌────────▼──────────┐
            │   index.html     │    │                   │
            │   (HTML UI)      │    │   CSS Styling    │
            └───────┬──────────┘    └────────┬──────────┘
                    │                        │
                    └────────────┬───────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   JavaScript (MVC)      │
                    ├─────────────────────────┤
                    │ Views:                  │
                    │  - DocumentView         │
                    │  - ChatView             │
                    │                         │
                    │ Controllers:            │
                    │  - DocumentController   │
                    │  - ChatController       │
                    │                         │
                    │ Models:                 │
                    │  - Document             │
                    │  - ChatMessage          │
                    │                         │
                    │ Services:               │
                    │  - ApiService           │
                    └────────────┬────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │   HTTP REST API                 │
                │   (CORS Enabled)                │
                └────────────────┼────────────────┘
                                 │
            ┌────────────────────▼─────────────────────┐
            │         BACKEND (Python/FastAPI)         │
            ├──────────────────────────────────────────┤
            │                                          │
            │  POST /ingestar/  (Upload Documents)    │
            │  POST /chat/      (Ask Questions)       │
            │  GET /            (Health Check)        │
            │                                          │
            └────────────────────┬────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                  │
        ┌───────▼──────────┐          ┌──────────▼──────┐
        │ ingesta.py       │          │   chat.py       │
        │ (Process Docs)   │          │ (Answer Queries)│
        └───────┬──────────┘          └──────────┬──────┘
                │                               │
                │                               │
        ┌───────▼──────────┐          ┌──────────▼──────┐
        │  LlamaIndex      │          │ LlamaIndex Query │
        │  SimpleDirectory │          │ Engine           │
        │  Reader          │          │                  │
        └────────┬─────────┘          └──────────┬──────┘
                 │                              │
                 └────────────┬─────────────────┘
                              │
                 ┌────────────▼────────────┐
                 │  Vector Embeddings      │
                 │  (HuggingFace Models)   │
                 └────────────┬────────────┘
                              │
                 ┌────────────▼────────────┐
                 │ ChromaDB Vector Store   │
                 │ (Persistent Database)   │
                 └────────────┬────────────┘
                              │
                 ┌────────────▼────────────┐
                 │  LLM (Groq - Llama 3)   │
                 │  (Language Model)       │
                 └─────────────────────────┘
```

---

## Patrón MVC Detallado

### 1️⃣ **MODEL LAYER**

```
Models/
├── Document.js
│   ├── Properties: id, filename, status, uploadDate, info
│   ├── Methods: isValid(), toJSON(), fromJSON()
│   └── Validators: File type, size, format
│
└── Chat.js
    ├── Properties: id, content, sender, timestamp
    ├── Methods: isValid(), toJSON(), fromJSON()
    └── Static: createUserMessage(), createAssistantMessage()
```

**Responsabilidades:**
- Definir estructura de datos
- Validar datos
- Conversión JSON
- Lógica de negocio simple

---

### 2️⃣ **VIEW LAYER**

```
Views/
├── DocumentView.js
│   ├── DOM Manipulation
│   ├── Event Binding
│   ├── Rendering
│   └── User Feedback
│
└── ChatView.js
    ├── Message Display
    ├── Scroll Management
    ├── Input Handling
    └── Loading States
```

**Responsabilidades:**
- Renderizar UI
- Capturar eventos de usuario
- Mostrar estado actual
- Comunicar cambios a controladores

---

### 3️⃣ **CONTROLLER LAYER**

```
Controllers/
├── DocumentController.js
│   ├── File Validation
│   ├── Upload Logic
│   ├── State Management
│   └── API Communication
│
└── ChatController.js
    ├── Message Validation
    ├── Send Logic
    ├── Response Handling
    └── History Management
```

**Responsabilidades:**
- Coordinar entre vista y modelo
- Manejar lógica de negocio
- Gestionar estado de la aplicación
- Comunicar con servicios

---

### 4️⃣ **SERVICE LAYER**

```
Services/
└── ApiService.js
    ├── HTTP Requests
    ├── Error Handling
    ├── Request Timeout
    ├── Response Parsing
    └── Connection Management
```

**Responsabilidades:**
- Abstracción de API calls
- Manejo de errores de red
- Singleton pattern
- Reutilización de conexiones

---

## Flujo de Datos

### Ingestión de Documento

```
User selects file
    ↓
DocumentView detects file
    ↓
Controller validates file
    ↓
Controller calls ApiService.ingestDocument(file)
    ↓
ApiService sends FormData to POST /ingestar/
    ↓
Backend processes document
    ↓
Backend returns status
    ↓
Controller creates Document model
    ↓
Controller updates localStorage
    ↓
View re-renders document list
    ↓
User sees document in UI
```

### Envío de Pregunta

```
User types question
    ↓
ChatView captures input
    ↓
Controller validates message
    ↓
Controller calls ApiService.sendQuestion(pregunta)
    ↓
ApiService sends POST /chat/
    ↓
Backend queries ChromaDB + LLM
    ↓
Backend returns respuesta
    ↓
Controller creates ChatMessage models
    ↓
Controller adds to messages array
    ↓
Controller updates localStorage
    ↓
View re-renders messages
    ↓
User sees response
```

---

## Clean Code en Acción

### ✅ Nombres Significativos

```javascript
// ❌ Malo
function proc(f) {
    // ...
}

// ✅ Bueno
function ingestDocument(file) {
    // ...
}
```

### ✅ Funciones Pequeñas y Enfocadas

```javascript
// ❌ Malo - Demasiadas responsabilidades
async handleUpload(file) {
    // validar, enviar, procesar, actualizar, renderizar...
}

// ✅ Bueno - Una responsabilidad
validateFile(file) { /* solo validar */ }
async uploadFile(file) { /* solo enviar */ }
updateDocument(doc) { /* solo actualizar */ }
```

### ✅ Separación de Responsabilidades

```javascript
// ❌ Malo - Controllers hablando con DOM
class ChatController {
    send(msg) {
        document.getElementById('msg').innerHTML = msg;
    }
}

// ✅ Bueno - Controller usa View
class ChatController {
    send(msg) {
        this.view.addMessage(msg);
    }
}
```

### ✅ Manejo de Errores

```javascript
// ❌ Malo - Sin manejo
const response = await fetch(url);
const data = await response.json();

// ✅ Bueno - Try-catch + validación
try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
} catch (error) {
    console.error('Error:', error);
    throw error;
}
```

### ✅ Documentación JSDoc

```javascript
/**
 * Valida que un archivo sea válido
 * @param {File} file - El archivo a validar
 * @returns {boolean} True si es válido
 * @throws {Error} Si no es válido
 */
function validateFile(file) {
    // ...
}
```

### ✅ Constantes y Configuración

```javascript
// ❌ Malo - Magic Numbers
if (file.size > 52428800) { /* ... */ }

// ✅ Bueno - Constantes
const MAX_FILE_SIZE = 50 * 1024 * 1024;
if (file.size > MAX_FILE_SIZE) { /* ... */ }
```

### ✅ DRY (Don't Repeat Yourself)

```javascript
// ❌ Malo - Repetición
escapeHtml(DocumentView);
escapeHtml(ChatView);

// ✅ Bueno - Método compartido
class BaseView {
    escapeHtml(text) { /* ... */ }
}
```

---

## Singleton Pattern - ApiService

```javascript
// ❌ Malo - Múltiples instancias
const api1 = new ApiService();
const api2 = new ApiService(); // Instancia diferente

// ✅ Bueno - Una única instancia
export default new ApiService(); // Singleton

// En cualquier archivo:
import ApiService from './ApiService.js';
ApiService.sendQuestion(msg); // Siempre la misma instancia
```

---

## Observer Pattern - Views

```javascript
// Controllers actúan como observers
class DocumentController {
    constructor(view) {
        this.view = view;
        // Se suscribe a eventos de la vista
        this.view.onFileSelected(callback);
        this.view.onUploadClick(callback);
    }
}

// Vista notifica a observadores (controllers)
class DocumentView {
    bindEvents() {
        this.fileInput.addEventListener('change', () => {
            // Notifica a todos los observers
            this.listeners.onFileSelected.forEach(cb => cb(file));
        });
    }
}
```

---

## Gestión de Estado

```
localStorage
     ↓
┌────────────────────────────────┐
│   Documentos:                  │
│   [{                           │
│     id, filename, status,      │
│     uploadDate, info           │
│   }]                           │
└────────────────────────────────┘

┌────────────────────────────────┐
│   Mensajes de Chat:            │
│   [{                           │
│     id, content, sender,       │
│     timestamp                  │
│   }]                           │
└────────────────────────────────┘
```

---

## Seguridad

### 1. **XSS Prevention**
```javascript
// ❌ Malo
element.innerHTML = userContent;

// ✅ Bueno
const div = document.createElement('div');
div.textContent = userContent;
element.innerHTML = div.innerHTML;
```

### 2. **CORS**
```javascript
// Backend
app.add_middleware(CORSMiddleware, allow_origins=["*"])

// Frontend sigue siendo seguro porque:
// - Las cookies no se envían sin credenciales
// - El servidor valida cada petición
```

### 3. **Validación**
```javascript
validateFile(file) {
    if (!allowedTypes.includes(fileType)) return false;
    if (file.size > MAX_SIZE) return false;
    return true;
}
```

---

## Escalabilidad

### Para agregar una nueva característica:

1. **Crear Model** (`models/Feature.js`)
2. **Crear View** (`views/FeatureView.js`)
3. **Crear Controller** (`controllers/FeatureController.js`)
4. **Agregar al app.js**

```javascript
// app.js
const featureView = new FeatureView();
const featureController = new FeatureController(featureView);
```

Esto es escalable porque:
- Cada componente es independiente
- No interfiere con código existente
- Fácil de testear
- Fácil de mantener

---

## Performance

### Optimizaciones implementadas:

1. **LocalStorage**: Caché local de datos
2. **Lazy Rendering**: Renderiza solo cuando cambia
3. **Event Delegation**: Un listener por tipo de evento
4. **Debounce**: Para evitar múltiples llamadas
5. **Timeout**: Para abortar requests largas

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

const response = await fetch(url, { signal: controller.signal });
```

---

**Arquitectura diseñada para ser:**
- ✅ Mantenible
- ✅ Escalable
- ✅ Testeable
- ✅ Segura
- ✅ Performante
