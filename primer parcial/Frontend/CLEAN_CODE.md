# 🧹 Guía de Clean Code

## Principios Aplicados en Este Proyecto

### 1. **Nombres Significativos**

#### Archivos

```javascript
// ✅ Bueno
models/Document.js
models/Chat.js
services/ApiService.js
controllers/DocumentController.js
views/DocumentView.js

// ❌ Evitar
models/model1.js
services/service.js
utils/helper.js
js/index.js
```

#### Variables

```javascript
// ✅ Bueno
const user_id = "123";
const is_loading = false;
const document_count = 5;
const max_file_size = 50 * 1024 * 1024;

// ❌ Evitar
const uid = "123";
const l = false;
const cnt = 5;
const s = 52428800;
```

#### Funciones

```javascript
// ✅ Bueno
function validateFile(file) { }
function formatDate(date) { }
function escapeHtml(text) { }
async function ingestDocument(file) { }

// ❌ Evitar
function check(f) { }
function fmt(d) { }
function esc(t) { }
async function proc(f) { }
```

---

### 2. **Funciones Pequeñas**

#### Regla: Una función, una responsabilidad

```javascript
// ❌ Malo - Demasiadas responsabilidades (11 líneas)
async function handleUpload(file) {
    if (!file) return;
    
    if (file.size > MAX_SIZE) {
        this.view.showMessage('Muy grande', 'error');
        return;
    }
    
    this.view.showLoading();
    const result = await this.api.upload(file);
    this.documents.push(result);
    localStorage.setItem('docs', JSON.stringify(this.documents));
    this.view.renderDocuments(this.documents);
}

// ✅ Bueno - Cada función hace una cosa (líneas reducidas)
async handleUpload(file) {
    if (!this.validateFile(file)) return;
    
    try {
        this.view.showLoading();
        const doc = await this.uploadFile(file);
        this.addDocument(doc);
        this.refreshView();
    } finally {
        this.view.hideLoading();
    }
}

validateFile(file) {
    if (!file) return false;
    if (file.size > MAX_SIZE) {
        this.view.showMessage('Archivo muy grande', 'error');
        return false;
    }
    return true;
}

async uploadFile(file) {
    return await ApiService.ingestDocument(file);
}

addDocument(doc) {
    this.documents.push(doc);
    this.saveDocuments();
}

refreshView() {
    this.view.renderDocuments(this.documents);
}
```

---

### 3. **Evitar Condiciones Profundas**

#### Nesting Hell

```javascript
// ❌ Malo - Piramida de doom
function process(user) {
    if (user) {
        if (user.isActive) {
            if (user.hasPermission) {
                if (user.documents.length > 0) {
                    // ... 5 niveles profundo!
                    return user.documents[0];
                }
            }
        }
    }
}

// ✅ Bueno - Early returns
function process(user) {
    if (!user) return null;
    if (!user.isActive) return null;
    if (!user.hasPermission) return null;
    if (user.documents.length === 0) return null;
    
    return user.documents[0]; // Claro y legible
}
```

---

### 4. **Manejo de Errores**

#### Try-Catch

```javascript
// ❌ Malo - Sin manejo
async function getData() {
    const response = await fetch(url);
    return response.json();
}

// ✅ Bueno - Con manejo completo
async function getData() {
    try {
        const response = await fetch(url, { signal: controller.signal });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Request timeout');
        } else {
            console.error('Request failed:', error);
        }
        throw error;
    }
}
```

---

### 5. **Documentación JSDoc**

#### Estándar

```javascript
/**
 * Descripción breve de la función
 * 
 * Descripción más detallada si es necesario.
 * Puede incluir ejemplos de uso.
 *
 * @param {type} paramName - Descripción del parámetro
 * @param {type} secondParam - Descripción del segundo parámetro
 * @returns {type} Descripción del valor de retorno
 * @throws {ErrorType} Descripción del error
 * 
 * @example
 * const result = myFunction(arg1, arg2);
 * console.log(result); // Expected output
 */
function myFunction(paramName, secondParam) {
    // ...
}
```

#### En el Proyecto

```javascript
/**
 * Valida que un archivo sea permitido
 * 
 * Verifica tipo, tamaño y formato del archivo.
 *
 * @param {File} file - El archivo a validar
 * @returns {boolean} True si el archivo es válido
 * 
 * @example
 * const isValid = validateFile(myFile);
 * if (isValid) { uploadFile(myFile); }
 */
validateFile(file) {
    const maxSize = 50 * 1024 * 1024;
    const allowedTypes = ['.pdf', '.txt', '.docx', '.doc'];
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
        return false;
    }
    
    if (file.size > maxSize) {
        return false;
    }
    
    return true;
}
```

---

### 6. **DRY - Don't Repeat Yourself**

```javascript
// ❌ Malo - Código repetido
class DocumentView {
    renderDocuments(docs) {
        docs.forEach(doc => {
            const div = document.createElement('div');
            div.className = 'document-item';
            div.innerHTML = `<p>${doc.name}</p>`;
            this.container.appendChild(div);
        });
    }
}

class ChatView {
    renderMessages(msgs) {
        msgs.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'message-item';
            div.innerHTML = `<p>${msg.content}</p>`;
            this.container.appendChild(div);
        });
    }
}

// ✅ Bueno - Código reutilizable
class BaseView {
    renderItems(items, className, htmlTemplate) {
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = className;
            div.innerHTML = htmlTemplate(item);
            this.container.appendChild(div);
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

class DocumentView extends BaseView {
    renderDocuments(docs) {
        this.renderItems(
            docs,
            'document-item',
            (doc) => `<p>${this.escapeHtml(doc.name)}</p>`
        );
    }
}

class ChatView extends BaseView {
    renderMessages(msgs) {
        this.renderItems(
            msgs,
            'message-item',
            (msg) => `<p>${this.escapeHtml(msg.content)}</p>`
        );
    }
}
```

---

### 7. **Constantes vs Magic Numbers**

```javascript
// ❌ Malo
if (file.size > 52428800) { /* ... */ }

const statusMap = {
    1: 'pending',
    2: 'processing',
    3: 'completed',
    4: 'error'
};

// ✅ Bueno
const MAX_FILE_SIZE = 50 * 1024 * 1024;
if (file.size > MAX_FILE_SIZE) { /* ... */ }

const STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    ERROR: 'error'
};

const DOCUMENT_STATUS = Object.freeze({
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    ERROR: 'error'
});
```

---

### 8. **Métodos Cortos sobre Métodos Largos**

```javascript
// ❌ Método largo (40+ líneas)
async sendQuestion(question) {
    if (!question) return;
    if (question.length > 5000) return;
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    try {
        const msg = {
            id: Date.now(),
            content: question,
            sender: 'user',
            timestamp: new Date()
        };
        
        this.messages.push(msg);
        this.view.addMessage(msg);
        
        const response = await fetch('/chat', {
            method: 'POST',
            body: JSON.stringify({ question })
        });
        
        if (!response.ok) throw new Error();
        
        const data = await response.json();
        
        const respMsg = {
            id: Date.now() + 1,
            content: data.respuesta,
            sender: 'assistant',
            timestamp: new Date()
        };
        
        this.messages.push(respMsg);
        this.view.addMessage(respMsg);
        localStorage.setItem('messages', JSON.stringify(this.messages));
        
    } catch (e) {
        console.error(e);
    } finally {
        this.isLoading = false;
    }
}

// ✅ Métodos cortos y claros
async sendQuestion(question) {
    if (!this.validateMessage(question)) return;
    
    try {
        this.startLoading();
        this.addUserMessage(question);
        
        const response = await this.fetchResponse(question);
        this.addAssistantMessage(response);
        
    } catch (error) {
        this.handleError(error);
    } finally {
        this.stopLoading();
    }
}

validateMessage(msg) {
    return msg && msg.length > 0 && msg.length <= 5000;
}

startLoading() {
    this.isLoading = true;
    this.view.showLoading();
}

stopLoading() {
    this.isLoading = false;
    this.view.hideLoading();
}

addUserMessage(content) {
    const msg = ChatMessage.createUserMessage(content);
    this.addMessage(msg);
}

async fetchResponse(question) {
    const response = await ApiService.sendQuestion(question);
    return response.respuesta;
}

addAssistantMessage(content) {
    const msg = ChatMessage.createAssistantMessage(content);
    this.addMessage(msg);
}

addMessage(msg) {
    this.messages.push(msg);
    this.view.addMessage(msg);
    this.saveMessages();
}

handleError(error) {
    console.error('Error:', error);
    this.view.showMessage('Error procesando pregunta', 'error');
}
```

---

### 9. **Comentarios Útiles**

```javascript
// ❌ Malo - Comentarios obvios
function sum(a, b) {
    // Sumar a y b
    return a + b;
}

// ❌ Malo - Comentarios desactualizados
function getUser(id) {
    // TODO: Esto debe ser mejorado
    // Este código es una mierda
    // No tocar!
    return users[id];
}

// ✅ Bueno - Comentarios explicativos
function calculateDiscount(price, customerType) {
    // IMPORTANTE: Clientes premium obtienen 15% de descuento
    // Regla de negocio: requiere validación con marketing
    const PREMIUM_DISCOUNT = 0.15;
    
    return customerType === 'premium' 
        ? price * (1 - PREMIUM_DISCOUNT)
        : price;
}

// ✅ Bueno - Comentarios de entrada/salida compleja
/**
 * Transforma array de documentos en estructura de árbol
 * Necesario para renderizar jerarquía en UI
 * 
 * Input:  [{ id: 1, name: 'doc1', parent: null }, ...]
 * Output: [{ id: 1, name: 'doc1', children: [...] }, ...]
 */
function buildDocumentTree(docs) {
    // ...
}
```

---

### 10. **Patrón de Objetos sobre Parámetros Múltiples**

```javascript
// ❌ Malo - Muchos parámetros
function createUser(name, email, age, country, language, timezone) {
    // ¿Qué orden? ¿Cuáles son obligatorios?
}

// ✅ Bueno - Objeto de configuración
function createUser(options) {
    const {
        name,
        email,
        age,
        country = 'US',
        language = 'en',
        timezone = 'UTC'
    } = options;
    
    // Claro, fácil de leer, parámetros por defecto
}

createUser({
    name: 'John',
    email: 'john@example.com',
    age: 30
});
```

---

### 11. **Código Defensivo**

```javascript
// ❌ Malo - Asume que todo es válido
function getFirstDocument(docs) {
    return docs[0].name;
}

// ✅ Bueno - Valida antes de usar
function getFirstDocument(docs) {
    if (!docs || !Array.isArray(docs) || docs.length === 0) {
        return null;
    }
    
    const firstDoc = docs[0];
    return firstDoc?.name || 'Sin nombre';
}
```

---

### 12. **Naming Conventions en Este Proyecto**

```javascript
// Archivos y Carpetas
models/              // Plural, minúsculas
Document.js         // PascalCase para clases

// Clases
class DocumentView { }
class ApiService { }

// Métodos e instancias
const documentView = new DocumentView();
documentView.renderDocuments();

// Constantes
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const API_BASE_URL = 'http://localhost:8000';

// Privados (por convención, sin symbol #)
_validateFile() { }

// Booleanos
is_loading
has_permission
can_edit
should_render

// Métodos que devuelven booleano
isValid()
hasElements()
shouldRender()
```

---

## Checklist de Code Review

Antes de dar por terminado un archivo, verifica:

- [ ] ¿El código es fácil de entender sin comentarios?
- [ ] ¿Cada función tiene una única responsabilidad?
- [ ] ¿Los nombres son descriptivos?
- [ ] ¿Hay validación de datos de entrada?
- [ ] ¿Hay manejo de errores?
- [ ] ¿Se evita la duplicación de código?
- [ ] ¿Las funciones son cortas (< 20 líneas)?
- [ ] ¿Hay documentación JSDoc en funciones públicas?
- [ ] ¿Se usan constantes en lugar de magic numbers?
- [ ] ¿El código es testeable?

---

## Herramientas Recomendadas

### ESLint
```bash
npm install --save-dev eslint
npx eslint js/
```

### Prettier (Formateador)
```bash
npm install --save-dev prettier
npx prettier --write js/
```

### JSDoc Validator
```bash
npm install --save-dev jsdoc
npx jsdoc js/
```

---

## Conclusión

**Clean Code no es una sugerencia, es una necesidad.**

Código limpio:
- ✅ Es más fácil de mantener
- ✅ Es más fácil de debuggear
- ✅ Es más fácil de escalar
- ✅ Es más fácil de colaborar
- ✅ Tiene menos bugs

**Invierte el tiempo ahora para ahorrar tiempo después.**
