/**
 * Vista: DocumentView
 * Responsable de renderizar los documentos en la UI
 * Patrón: Observer (notifica cambios a los controllers)
 */

class DocumentView {
    constructor() {
        this.fileInputElement = document.getElementById('documentInput');
        this.uploadButtonElement = document.getElementById('uploadBtn');
        this.documentListElement = document.getElementById('documentList');
        this.loadingElement = document.getElementById('loadingIndicator');
        this.messageElement = document.getElementById('feedbackMessage');
        this.refreshButtonElement = document.getElementById('refreshBtn');
        this.syncButtonElement = document.getElementById('syncBtn');
        
        this.listeners = {
            onFileSelected: [],
            onUploadClick: [],
            onRefresh: [],
            onSync: [],
        };
    }

    /**
     * Registra un listener para cuando se selecciona un archivo
     * @param {function} callback
     */
    onFileSelected(callback) {
        this.listeners.onFileSelected.push(callback);
    }

    /**
     * Registra un listener para cuando se hace click en subir
     * @param {function} callback
     */
    onUploadClick(callback) {
        this.listeners.onUploadClick.push(callback);
    }

    /**
     * Registra un listener para cuando se hace click en sincronizar
     * @param {function} callback
     */
    onSync(callback) {
        this.listeners.onSync.push(callback);
    }

    /**
     * Registra un listener para cuando se hace click en actualizar
     * @param {function} callback
     */
    onRefresh(callback) {
        this.listeners.onRefresh.push(callback);
    }

    /**
     * Inicializa los event listeners
     */
    bindEvents() {
        this.fileInputElement?.addEventListener('change', () => {
            const file = this.fileInputElement.files[0];
            if (file) {
                this.listeners.onFileSelected.forEach(callback => callback(file));
            }
        });

        this.uploadButtonElement?.addEventListener('click', () => {
            const file = this.fileInputElement.files[0];
            if (file) {
                this.listeners.onUploadClick.forEach(callback => callback(file));
            }
        });

        this.refreshButtonElement?.addEventListener('click', () => {
            this.listeners.onRefresh.forEach(callback => callback());
        });

        this.syncButtonElement?.addEventListener('click', () => {
            this.listeners.onSync.forEach(callback => callback());
        });
    }

    /**
     * Renderiza la lista de documentos
     * @param {Document[]} documents
     */
    renderDocuments(documents) {
        if (!this.documentListElement) return;

        this.documentListElement.innerHTML = '';
        
        if (documents.length === 0) {
            this.documentListElement.innerHTML = '<p class="empty-state">No hay documentos ingresados</p>';
            return;
        }

        documents.forEach(doc => {
            const docElement = this.createDocumentElement(doc);
            this.documentListElement.appendChild(docElement);
        });
    }

    /**
     * Crea el elemento HTML para un documento
     * @param {Document} doc
     * @returns {HTMLElement}
     */
    createDocumentElement(doc) {
        const div = document.createElement('div');
        div.className = `document-item document-item--${doc.status}`;
        div.innerHTML = `
            <div class="document-info">
                <h4 class="document-name">${this.escapeHtml(doc.filename)}</h4>
                <p class="document-date">${new Date(doc.uploadDate).toLocaleString()}</p>
            </div>
            <div class="document-status">
                <span class="status-badge status-${doc.status}">
                    ${this.getStatusLabel(doc.status)}
                </span>
            </div>
        `;
        return div;
    }

    /**
     * Obtiene la etiqueta de estado en español
     * @param {string} status
     * @returns {string}
     */
    getStatusLabel(status) {
        const labels = {
            pending: 'Pendiente',
            processing: 'Procesando',
            completed: 'Completado',
            error: 'Error',
        };
        return labels[status] || status;
    }

    /**
     * Muestra el indicador de carga
     */
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
    }

    /**
     * Oculta el indicador de carga
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    /**
     * Muestra un mensaje de retroalimentación
     * @param {string} message
     * @param {string} type - 'success', 'error', 'info'
     */
    showMessage(message, type = 'info') {
        if (this.messageElement) {
            this.messageElement.textContent = message;
            this.messageElement.className = `feedback-message feedback-message--${type}`;
            this.messageElement.style.display = 'block';

            setTimeout(() => {
                this.messageElement.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Habilita/deshabilita los controles de upload
     * @param {boolean} enabled
     */
    setUploadEnabled(enabled) {
        if (this.uploadButtonElement) {
            this.uploadButtonElement.disabled = !enabled;
        }
        if (this.fileInputElement) {
            this.fileInputElement.disabled = !enabled;
        }
    }

    /**
     * Escapa caracteres HTML para prevenir XSS
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Reinicia el formulario de subida
     */
    resetUploadForm() {
        if (this.fileInputElement) {
            this.fileInputElement.value = '';
        }
    }

    /**
     * Obtiene el archivo actualmente seleccionado
     * @returns {File|null}
     */
    getSelectedFile() {
        return this.fileInputElement?.files[0] || null;
    }
}

export default DocumentView;
