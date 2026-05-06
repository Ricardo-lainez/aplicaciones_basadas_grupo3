from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb
import os
from dotenv import load_dotenv
from llama_index.llms.groq import Groq
from llama_index.core import Settings
from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.prompts import PromptTemplate
from llama_index.llms.groq import Groq

load_dotenv()

# Reutilizamos la misma configuración de persistencia
DB_PATH = "./data/chroma_db"
COLLECTION_NAME = "documentos_usuario"

def consultar_chat(pregunta: str):
    """
    Consulta el chat basado en documentos procesados
    """
    try:
        # 1. Verificar que exista la base de datos y tenga documentos
        db = chromadb.PersistentClient(path=DB_PATH)
        chroma_collection = db.get_or_create_collection(COLLECTION_NAME)
        
        # Verificar si hay documentos en la colección
        collection_data = chroma_collection.get()
        if not collection_data or not collection_data.get("ids") or len(collection_data["ids"]) == 0:
            return "No hay documentos cargados. Por favor, sube documentos primero para hacer preguntas."
        
        # 2. Cargar el índice desde el almacenamiento
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        index = VectorStoreIndex.from_vector_store(vector_store)
        
        # 3. Definimos un Prompt de sistema estricto
        system_prompt = """
        Eres un asistente experto que solo responde basándose en el contexto proporcionado.
        Reglas estrictas:
        - Si la respuesta no está en el contexto, di claramente: "Lo siento, esa información no se encuentra en los documentos proporcionados."
        - No intentes responder usando tu conocimiento general ni inventes información.
        - Mantén la respuesta concisa y profesional.
        """
        
        # 4. Configuramos el motor de consulta con el prompt
        query_engine = index.as_query_engine(
            llm=Groq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY")),
            system_prompt=system_prompt
        )
        
        response = query_engine.query(pregunta)
        return str(response)
    
    except Exception as e:
        return f"Error procesando tu pregunta: {str(e)}"
