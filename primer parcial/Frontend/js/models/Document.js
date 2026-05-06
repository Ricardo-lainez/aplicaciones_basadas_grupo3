/**
 * Modelo: Document
 * Representa un documento en la aplicación
 * Responsabilidades: lógica de datos y validación
 */

class Document {
    constructor(id, filename, status, uploadDate = new Date(), info = null) {
        this.id = id;
        this.filename = filename;
        this.status = status; // 'pending', 'processing', 'completed', 'error'
        this.uploadDate = uploadDate;
        this.info = info;
    }

    /**
     * Valida que el documento sea válido
     * @returns {boolean}
     */
    isValid() {
        return this.filename && this.status && this.id;
    }

    /**
     * Convierte el documento a un objeto serializable
     * @returns {object}
     */
    toJSON() {
        return {
            id: this.id,
            filename: this.filename,
            status: this.status,
            uploadDate: this.uploadDate.toISOString(),
            info: this.info,
        };
    }

    /**
     * Crea un documento a partir de un JSON
     * @param {object} data
     * @returns {Document}
     */
    static fromJSON(data) {
        return new Document(
            data.id,
            data.filename,
            data.status,
            new Date(data.uploadDate),
            data.info
        );
    }

    /**
     * Crea un nuevo documento en estado 'pending'
     * @param {File} file
     * @returns {Document}
     */
    static createFromFile(file) {
        const id = `${Date.now()}-${Math.random()}`;
        return new Document(id, file.name, 'pending');
    }
}

export default Document;
