/**
 * Aplicación Principal
 * Punto de entrada de la aplicación
 * Inicializa los controladores y vistas
 */

import DocumentView from './views/DocumentView.js';
import ChatView from './views/ChatView.js';
import DocumentController from './controllers/DocumentController.js';
import ChatController from './controllers/ChatController.js';
import ApiService from './services/ApiService.js';

class Application {
    constructor() {
        this.documentController = null;
        this.chatController = null;
    }

    /**
     * Inicializa la aplicación
     */
    async initialize() {
        console.log('Inicializando aplicación...');

        // Verificar conexión con el backend
        await this.checkBackendConnection();

        // Inicializar vistas
        const documentView = new DocumentView();
        const chatView = new ChatView();

        // Inicializar controladores
        this.documentController = new DocumentController(documentView);
        this.chatController = new ChatController(chatView);

        // Configurar botones adicionales
        this.setupButtons();

        console.log('Aplicación inicializada correctamente');
    }

    /**
     * Verifica la conexión con el backend
     */
    async checkBackendConnection() {
        try {
            const isHealthy = await ApiService.checkHealth();
            if (isHealthy) {
                console.log('Backend conectado correctamente');
                this.showStatus('Backend conectado', 'success');
            } else {
                console.warn('Backend no está respondiendo');
                this.showStatus('Backend no disponible', 'error');
            }
        } catch (error) {
            console.error('Error al conectar con backend:', error);
            this.showStatus('Error de conexión con el backend', 'error');
        }
    }

    /**
     * Configura botones adicionales
     */
    setupButtons() {
        const clearChatBtn = document.getElementById('clearChatBtn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres limpiar el historial del chat?')) {
                    this.chatController.clearHistory();
                }
            });
        }

        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.checkBackendConnection();
            });
        }

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('⚠️ ¿Estás completamente seguro? Esto eliminará TODOS los documentos, el chat y la base de datos.\n\nEsta acción es IRREVERSIBLE.')) {
                    this.resetEverything();
                }
            });
        }
    }

    /**
     * Resetea completamente la aplicación
     */
    async resetEverything() {
        try {
            // Limpiar documentos
            await this.documentController.clearEverything();
            // Limpiar chat
            this.chatController.clearHistory();
            
            this.showStatus('✅ Aplicación reiniciada completamente', 'success');
            
            // Recargar la página después de 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error al resetear:', error);
            this.showStatus('❌ Error al reiniciar la aplicación', 'error');
        }
    }

    /**
     * Muestra un estado en la aplicación
     * @param {string} message
     * @param {string} type
     */
    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('appStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `app-status app-status--${type}`;
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.initialize();
});
