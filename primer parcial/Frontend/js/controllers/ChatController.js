/**
 * Controlador: ChatController
 * Responsable de gestionar la lógica del chat
 * Coordina entre Vista y Modelo a través del Servicio
 */

import ApiService from '../services/ApiService.js';
import ChatMessage from '../models/Chat.js';

class ChatController {
    constructor(view) {
        this.view = view;
        this.messages = [];
        this.initializeEventListeners();
        this.loadStoredMessages();
    }

    /**
     * Inicializa los event listeners de la vista
     */
    initializeEventListeners() {
        this.view.onSendMessage((message) => this.handleSendMessage(message));
        this.view.bindEvents();
    }

    /**
     * Maneja el envío de un mensaje
     * @param {string} content
     */
    async handleSendMessage(content) {
        if (!this.validateMessage(content)) {
            return;
        }

        try {
            // Crear y agregar mensaje del usuario
            const userMessage = ChatMessage.createUserMessage(content);
            this.addMessage(userMessage);

            // Mostrar indicador de carga
            this.view.showLoading();

            // Enviar al servidor
            const response = await ApiService.sendQuestion(content);
            
            // Crear y agregar mensaje del asistente
            const assistantMessage = ChatMessage.createAssistantMessage(response.respuesta);
            this.addMessage(assistantMessage);

        } catch (error) {
            console.error('Error en chat:', error);
            const errorMessage = ChatMessage.createAssistantMessage(
                'Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta de nuevo.'
            );
            this.addMessage(errorMessage);
        } finally {
            this.view.hideLoading();
        }
    }

    /**
     * Valida un mensaje
     * @param {string} message
     * @returns {boolean}
     */
    validateMessage(message) {
        if (!message || message.trim().length === 0) {
            return false;
        }

        if (message.length > 5000) {
            this.view.showMessage = 'El mensaje es demasiado largo';
            return false;
        }

        return true;
    }

    /**
     * Agrega un mensaje a la conversación
     * @param {ChatMessage} message
     */
    addMessage(message) {
        this.messages.push(message);
        this.view.addMessage(message);
        this.saveMessages();
    }

    /**
     * Refresca la lista de mensajes en la vista
     */
    refreshMessages() {
        this.view.renderMessages(this.messages);
    }

    /**
     * Guarda los mensajes en localStorage
     */
    saveMessages() {
        const data = this.messages.map(msg => msg.toJSON());
        localStorage.setItem('chatMessages', JSON.stringify(data));
    }

    /**
     * Carga mensajes desde localStorage
     */
    loadStoredMessages() {
        try {
            const data = localStorage.getItem('chatMessages');
            if (data) {
                const parsedData = JSON.parse(data);
                this.messages = parsedData.map(d => ChatMessage.fromJSON(d));
                this.refreshMessages();
            }
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }
    }

    /**
     * Limpia el historial de chat
     */
    clearHistory() {
        this.messages = [];
        localStorage.removeItem('chatMessages');
        this.refreshMessages();
    }

    /**
     * Obtiene la lista de mensajes
     * @returns {ChatMessage[]}
     */
    getMessages() {
        return this.messages;
    }
}

export default ChatController;
