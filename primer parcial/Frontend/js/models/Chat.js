/**
 * Modelo: Chat
 * Representa un mensaje en la conversación
 * Responsabilidades: lógica de datos y validación
 */

class ChatMessage {
    constructor(id, content, sender, timestamp = new Date()) {
        this.id = id;
        this.content = content;
        this.sender = sender; // 'user' o 'assistant'
        this.timestamp = timestamp;
    }

    /**
     * Valida que el mensaje sea válido
     * @returns {boolean}
     */
    isValid() {
        return this.content && this.sender && ['user', 'assistant'].includes(this.sender);
    }

    /**
     * Convierte el mensaje a un objeto serializable
     * @returns {object}
     */
    toJSON() {
        return {
            id: this.id,
            content: this.content,
            sender: this.sender,
            timestamp: this.timestamp.toISOString(),
        };
    }

    /**
     * Crea un mensaje a partir de un JSON
     * @param {object} data
     * @returns {ChatMessage}
     */
    static fromJSON(data) {
        return new ChatMessage(
            data.id,
            data.content,
            data.sender,
            new Date(data.timestamp)
        );
    }

    /**
     * Crea un nuevo mensaje del usuario
     * @param {string} content
     * @returns {ChatMessage}
     */
    static createUserMessage(content) {
        const id = `${Date.now()}-${Math.random()}`;
        return new ChatMessage(id, content, 'user');
    }

    /**
     * Crea un nuevo mensaje del asistente
     * @param {string} content
     * @returns {ChatMessage}
     */
    static createAssistantMessage(content) {
        const id = `${Date.now()}-${Math.random()}`;
        return new ChatMessage(id, content, 'assistant');
    }
}

export default ChatMessage;
