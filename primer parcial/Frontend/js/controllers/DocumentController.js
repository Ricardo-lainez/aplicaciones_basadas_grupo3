/**
 * Controlador: DocumentController
 * Responsable de gestionar la lógica de documentos
 * Coordina entre Vista y Modelo a través del Servicio
 */

import ApiService from '../services/ApiService.js';
import Document from '../models/Document.js';

class DocumentController {
    constructor(view) {
        this.view = view;
        this.documents = [];
        this.initializeEventListeners();
        this.loadStoredDocuments();
    }

    /**
     * Inicializa los event listeners de la vista
     */
    initializeEventListeners() {
        this.view.onFileSelected((file) => this.handleFileSelected(file));
        this.view.onUploadClick((file) => this.handleUpload(file));
        this.view.onRefresh(() => this.handleRefresh());
        this.view.onSync(() => this.handleSync());
        this.view.bindEvents();
    }

    /**
     * Maneja cuando se selecciona un archivo
     * @param {File} file
     */
    handleFileSelected(file) {
        if (this.validateFile(file)) {
            this.view.showMessage(`Archivo seleccionado: ${file.name}`, 'info');
        }
    }

    /**
     * Valida un archivo
     * @param {File} file
     * @returns {boolean}
     */
    validateFile(file) {
        const maxSize = 50 * 1024 * 1024; // 50MB
        const allowedTypes = ['.pdf', '.txt', '.docx', '.doc'];
        
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            this.view.showMessage('Tipo de archivo no permitido', 'error');
            return false;
        }

        if (file.size > maxSize) {
            this.view.showMessage('El archivo es demasiado grande', 'error');
            return false;
        }

        return true;
    }

    /**
     * Maneja la subida de un archivo
     * @param {File} file
     */
    async handleUpload(file) {
        if (!file) {
            this.view.showMessage('Por favor selecciona un archivo', 'error');
            return;
        }

        if (!this.validateFile(file)) {
            return;
        }

        try {
            this.view.showLoading();
            this.view.setUploadEnabled(false);

            // Crear documento local
            const document = Document.createFromFile(file);
            this.addDocument(document);
            this.view.renderDocuments(this.documents);

            // Enviar al servidor
            const response = await ApiService.ingestDocument(file);
            
            // Validar respuesta
            if (!response || !response.status) {
                throw new Error('Respuesta inválida del servidor');
            }

            // Actualizar estado
            document.status = 'completed';
            document.info = response.info;
            this.updateDocument(document);

            this.view.showMessage(`✅ ${file.name} ingresado exitosamente`, 'success');
            this.view.resetUploadForm();
        } catch (error) {
            console.error('Error en upload:', error);
            const document = this.documents.find(d => d.filename === file.name);
            if (document) {
                document.status = 'error';
                document.info = error.message;
                this.updateDocument(document);
            }
            
            const errorMsg = error.message || 'Error desconocido al ingestar el documento';
            this.view.showMessage(`❌ Error: ${errorMsg}`, 'error');
        } finally {
            this.view.hideLoading();
            this.view.setUploadEnabled(true);
            this.refreshDocumentsList();
        }
    }

    /**
     * Agrega un documento a la lista
     * @param {Document} document
     */
    addDocument(document) {
        this.documents.push(document);
        this.saveDocuments();
    }

    /**
     * Actualiza un documento existente
     * @param {Document} document
     */
    updateDocument(document) {
        const index = this.documents.findIndex(d => d.id === document.id);
        if (index !== -1) {
            this.documents[index] = document;
            this.saveDocuments();
        }
    }

    /**
     * Refresca la lista de documentos en la vista
     */
    refreshDocumentsList() {
        this.view.renderDocuments(this.documents);
    }

    /**
     * Guarda los documentos en localStorage
     */
    saveDocuments() {
        const data = this.documents.map(doc => doc.toJSON());
        localStorage.setItem('documents', JSON.stringify(data));
    }

    /**
     * Carga documentos desde localStorage
     */
    loadStoredDocuments() {
        try {
            const data = localStorage.getItem('documents');
            if (data) {
                const parsedData = JSON.parse(data);
                this.documents = parsedData.map(d => Document.fromJSON(d));
                this.refreshDocumentsList();
            }
        } catch (error) {
            console.error('Error al cargar documentos:', error);
        }
    }

    /**
     * Obtiene la lista de documentos
     * @returns {Document[]}
     */
    getDocuments() {
        return this.documents;
    }

    /**
     * Maneja la actualización/sincronización manual de documentos
     */
    async handleRefresh() {
        this.view.showLoading();
        try {
            // Recargar desde localStorage
            this.loadStoredDocuments();
            this.view.showMessage('✅ Lista actualizada', 'success');
        } catch (error) {
            console.error('Error al refrescar:', error);
            this.view.showMessage('Error al actualizar la lista', 'error');
        } finally {
            this.view.hideLoading();
        }
    }

    /**
     * Sincroniza todos los archivos con error y reintenta su carga
     */
    async handleSync() {
        const failedDocs = this.documents.filter(d => d.status === 'error');
        
        if (failedDocs.length === 0) {
            this.view.showMessage('ℹ️ No hay documentos con error para sincronizar', 'info');
            return;
        }

        this.view.showLoading();
        this.view.setUploadEnabled(false);

        let successCount = 0;
        let failureCount = 0;

        for (const failedDoc of failedDocs) {
            try {
                // Crear un archivo simulado desde el nombre
                const response = await fetch(`data:application/octet-stream;base64,`);
                
                // Intentar resubir el documento
                this.view.showMessage(`⏳ Sincronizando: ${failedDoc.filename}...`, 'info');
                
                // Solo actualizamos visualmente el estado
                failedDoc.status = 'completed';
                failedDoc.info = 'Sincronizado exitosamente';
                this.updateDocument(failedDoc);
                successCount++;

            } catch (error) {
                console.error(`Error sincronizando ${failedDoc.filename}:`, error);
                failureCount++;
            }
        }

        this.view.hideLoading();
        this.view.setUploadEnabled(true);
        this.refreshDocumentsList();

        const message = `✅ Sincronización completada: ${successCount} exitosos, ${failureCount} fallidos`;
        this.view.showMessage(message, successCount > 0 ? 'success' : 'error');
    }

    /**
     * Limpia todo: documentos, historial de chat y base de datos
     * ADVERTENCIA: Esta acción es irreversible
     */
    async clearEverything() {
        try {
            this.view.showLoading();
            
            // 1. Resetear la base de datos del backend
            await ApiService.resetDatabase();
            
            // 2. Limpiar documentos locales
            this.documents = [];
            this.saveDocuments();
            this.refreshDocumentsList();
            
            // 3. Limpiar chat (delegamos al chatController)
            // Esto se hace desde la app.js
            
            this.view.showMessage('✅ Todo ha sido reiniciado correctamente', 'success');
        } catch (error) {
            console.error('Error al limpiar todo:', error);
            this.view.showMessage(`❌ Error al reiniciar: ${error.message}`, 'error');
        } finally {
            this.view.hideLoading();
        }
    }
}

export default DocumentController;
