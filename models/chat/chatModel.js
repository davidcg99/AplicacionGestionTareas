const promisePool = require("../../config/database/db");

class ChatModel {
  /**
   * Inserta un nuevo mensaje en el historial del chat y devuelve el historial completo.
   * 
   * @param {Object} messageData - Datos del mensaje a insertar
   * @param {string} messageData.chatGuid - GUID único de la conversación
   * @param {string} messageData.sender - Tipo de remitente ('user', 'assistant', 'system')
   * @param {number|null} [messageData.userId=null] - ID del usuario (opcional)
   * @param {string} messageData.message - Contenido del mensaje
   * @param {string} [messageData.messageType='text'] - Tipo de mensaje ('text'|'html')
   * @returns {Promise<{success: boolean, message: string, data?: any, errors?: string}>}
   * @throws {Error} - Error de base de datos
   */
  static async insertChatMessage({
    chatGuid,
    sender,
    userId = null,
    message,
    messageType = 'text',
    moduleActive
  }) {
    const sql = `CALL sp_ChatOperations(?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      1,            // Tipo de operación (1 = insertar mensaje)
      chatGuid,     // GUID del chat
      sender,       // Tipo de remitente
      userId,       // ID de usuario
      message,      // Contenido del mensaje
      messageType,  // Tipo de mensaje
      moduleActive  // Modulo activo para consultas de chat independiente  
    ];

    try {
      const [rows] = await promisePool.query(sql, params);
      
      if (!rows || !rows.length) {
        throw new Error('No se recibieron datos del procedimiento almacenado');
      }

      return {
        success: true,
        message: 'Mensaje insertado correctamente',
        data: rows
      };
    } catch (error) {
      console.error('Error en insertChatMessage:', error.message);
      throw new Error(`Error al insertar mensaje: ${error.message}`);
    }
  }

  /**
   * Obtiene el historial completo de mensajes para un chat específico
   * 
   * @param {string} chatGuid - GUID único de la conversación
   * @returns {Promise<{success: boolean, data: Array<Object>, message: string}>}
   * @throws {Error} - Error de base de datos
   */
  static async getChatMessages(chatGuid, moduleActive) {
    const sql = `CALL sp_ChatOperations(?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      2,              // Tipo de operación (1 = insertar mensaje)
      chatGuid,       // GUID del chat
      null,           // Tipo de remitente
      1,              // ID de usuario
      null,           // Contenido del mensaje
      null,           // Tipo de mensaje
      moduleActive    // Modulo activo para consultas de chat independiente 
    ];

    try {
      const [rows] = await promisePool.query(sql, params);

      return {
        success: true,
        data: rows,
        message: rows.length 
          ? 'Historial de mensajes obtenido correctamente' 
          : 'No se encontraron mensajes para este chat'
      };
    } catch (error) {
      console.error('Error en getChatMessages:', error.message);
      throw new Error(`Error al obtener mensajes: ${error.message}`);
    }
  }

}

module.exports = ChatModel;