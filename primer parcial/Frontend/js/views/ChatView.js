/**
 * Vista: ChatView
 * Responsable de renderizar los mensajes del chat en la UI
 * Patrón: Observer (notifica cambios a los controllers)
 */

class ChatView {
    constructor() {
        this.chatContainerElement = document.getElementById('chatMessages');
        this.inputElement = document.getElementById('chatInput');
        this.sendButtonElement = document.getElementById('sendBtn');
        this.loadingIndicatorElement = document.getElementById('chatLoadingIndicator');
        
        this.listeners = {
            onSendMessage: [],
        };
    }

    /**
     * Registra un listener para cuando se envía un mensaje
     * @param {function} callback
     */
    onSendMessage(callback) {
        this.listeners.onSendMessage.push(callback);
    }

    /**
     * Inicializa los event listeners
     */
    bindEvents() {
        this.sendButtonElement?.addEventListener('click', () => {
            const message = this.inputElement?.value.trim();
            if (message) {
                this.listeners.onSendMessage.forEach(callback => callback(message));
                this.clearInput();
            }
        });

        // Permitir enviar con Enter
        this.inputElement?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = this.inputElement.value.trim();
                if (message) {
                    this.listeners.onSendMessage.forEach(callback => callback(message));
                    this.clearInput();
                }
            }
        });
    }

    /**
     * Renderiza los mensajes del chat
     * @param {ChatMessage[]} messages
     */
    renderMessages(messages) {
        if (!this.chatContainerElement) return;

        this.chatContainerElement.innerHTML = '';
        
        if (messages.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'chat-empty-state';
            emptyMessage.innerHTML = '<p>Comienza la conversación haciendo una pregunta sobre los documentos ingresados</p>';
            this.chatContainerElement.appendChild(emptyMessage);
            return;
        }

        messages.forEach(msg => {
            const msgElement = this.createMessageElement(msg);
            this.chatContainerElement.appendChild(msgElement);
        });

        // Scroll al último mensaje
        this.scrollToBottom();
    }

    /**
     * Crea el elemento HTML para un mensaje
     * @param {ChatMessage} msg
     * @returns {HTMLElement}
     */
    createMessageElement(msg) {
        const div = document.createElement('div');
        div.className = `chat-message chat-message--${msg.sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.escapeHtml(msg.content);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date(msg.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        div.appendChild(contentDiv);
        div.appendChild(timeDiv);
        
        return div;
    }

    /**
     * Agrega un nuevo mensaje al chat
     * @param {ChatMessage} message
     */
    addMessage(message) {
        if (!this.chatContainerElement) return;

        // Si está vacío, limpia el estado vacío
        if (this.chatContainerElement.querySelector('.chat-empty-state')) {
            this.chatContainerElement.innerHTML = '';
        }

        const msgElement = this.createMessageElement(message);
        this.chatContainerElement.appendChild(msgElement);
        this.scrollToBottom();
    }

    /**
     * Muestra el indicador de carga
     */
    showLoading() {
        if (this.loadingIndicatorElement) {
            this.loadingIndicatorElement.style.display = 'block';
        }
        this.setSendEnabled(false);
    }

    /**
     * Oculta el indicador de carga
     */
    hideLoading() {
        if (this.loadingIndicatorElement) {
            this.loadingIndicatorElement.style.display = 'none';
        }
        this.setSendEnabled(true);
    }

    /**
     * Habilita/deshabilita el botón de envío
     * @param {boolean} enabled
     */
    setSendEnabled(enabled) {
        if (this.sendButtonElement) {
            this.sendButtonElement.disabled = !enabled;
        }
        if (this.inputElement) {
            this.inputElement.disabled = !enabled;
        }
    }

    /**
     * Limpia el campo de entrada
     */
    clearInput() {
        if (this.inputElement) {
            this.inputElement.value = '';
            this.inputElement.focus();
        }
    }

    /**
     * Hace scroll hasta el final del chat
     */
    scrollToBottom() {
        if (this.chatContainerElement) {
            this.chatContainerElement.scrollTop = this.chatContainerElement.scrollHeight;
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
}

export default ChatView;
