/**
 * Configuración global de la aplicación
 * Define las URLs y constantes utilizadas en toda la aplicación
 */

const CONFIG = {
    // URL base del backend
    API_BASE_URL: 'http://localhost:8000',
    
    // Endpoints del API
    ENDPOINTS: {
        HEALTH: '/health',
        INGEST: '/ingestar/',
        CHAT: '/chat/',
        RESET: '/reset/',
    },
    
    // Configuración de tiempo de espera
    TIMEOUT: 120000, // 120 segundos (ingesta de documentos puede tardar)
    
    // Configuración de la aplicación
    APP_NAME: 'Chatbot RAG',
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_FILE_TYPES: ['.pdf', '.txt', '.docx', '.doc'],
};

export default CONFIG;
