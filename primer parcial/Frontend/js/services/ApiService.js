/**
 * Servicio de API
 * Maneja toda la comunicación con el backend
 * Patrón: Singleton + Service Layer
 */

import CONFIG from '../config.js';

class ApiService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.timeout = CONFIG.TIMEOUT;
    }

    /**
     * Método genérico para hacer peticiones HTTP
     * @param {string} endpoint - El endpoint a consultar
     * @param {object} options - Opciones de la petición
     * @returns {Promise} Respuesta de la API
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...defaultOptions,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error en request a ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Verifica la salud del backend
     * @returns {Promise<boolean>}
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL}/`);
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Ingesta un documento
     * @param {File} file - Archivo a ingestar
     * @returns {Promise<object>} Respuesta del servidor
     */
    async ingestDocument(file) {
        if (!file) {
            throw new Error('Archivo no válido');
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = `${this.baseURL}${CONFIG.ENDPOINTS.INGEST}`;
            
            const controller = new AbortController();
            // Usar timeout más largo para ingesta (Config.TIMEOUT)
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Error desconocido');
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            if (!data) {
                throw new Error('Respuesta vacía del servidor');
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Timeout: La operación tardó más de ${this.timeout/1000} segundos`);
            }
            console.error('Error en ingesta:', error);
            throw error;
        }
    }

    /**
     * Envía una pregunta al chat
     * @param {string} pregunta - La pregunta del usuario
     * @returns {Promise<object>} Respuesta del servidor
     */
    async sendQuestion(pregunta) {
        if (!pregunta || typeof pregunta !== 'string') {
            throw new Error('La pregunta debe ser una cadena válida');
        }

        if (pregunta.trim().length === 0) {
            throw new Error('La pregunta no puede estar vacía');
        }

        try {
            const url = `${this.baseURL}${CONFIG.ENDPOINTS.CHAT}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `pregunta=${encodeURIComponent(pregunta)}`,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Error desconocido');
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data || !data.respuesta) {
                throw new Error('Respuesta inválida del servidor');
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Timeout: La operación tardó más de ${this.timeout/1000} segundos`);
            }
            console.error('Error en chat:', error);
            throw error;
        }
    }

    /**
     * Resetea la base de datos completamente
     * @returns {Promise<object>} Respuesta del servidor
     */
    async resetDatabase() {
        try {
            const url = `${this.baseURL}${CONFIG.ENDPOINTS.RESET}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: 'POST',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Error desconocido');
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Timeout: La operación tardó más de ${this.timeout/1000} segundos`);
            }
            console.error('Error en reset:', error);
            throw error;
        }
    }
}

// Singleton: una única instancia
export default new ApiService();
