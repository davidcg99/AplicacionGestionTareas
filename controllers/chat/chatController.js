// controllers/chat.controller.js
const { callAI } = require('../../services/chat/chatServices');
const { ApiError, buildErrorResponse, ValidationError } = require('../../utils/error.util');
const chatModel = require('../../models/chat/chatModel');

/**
 * Controlador para generar respuestas del chatbot en una conversación
 * 
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta con el mensaje del chatbot o error
 */
const generateConversationChatbot = async (req, res) => {
  try {
    const { message, guid, moduleActive } = req.body;

    // Validación de campos requeridos
    if (!message || !guid) {
      throw new ValidationError('El mensaje y el GUID son requeridos', 400);
    }

    // Preparar objeto para el mensaje del usuario
    const userChatMessage = {
      chatGuid: guid,       // Identificador único de la conversación
      sender: 'user',       // Indica que el remitente es el usuario
      userId: 1,            // TODO: Reemplazar con ID real de autenticación
      message: message,     // Contenido del mensaje
      typeMessage: 'text',   // Tipo de mensaje (texto)
      moduleActive: moduleActive
    };

    // Insertar mensaje del usuario en la base de datos
    const insertResult = await chatModel.insertChatMessage(userChatMessage);
    
    // Manejar errores en la inserción
    if (!insertResult.success) {
      throw new ValidationError(
        insertResult.message || 'Error al insertar el mensaje',
        500,
        insertResult.errors
      );
    }

    // Extraer historial y configuración de la respuesta
    const [chatHistory, aiConfig] = insertResult.data;

    // Validar configuración de IA
    if (!aiConfig?.length || !aiConfig[0]?.model) {
      throw new ApiError('Configuración de IA no encontrada', 500);
    }

    // Preparar datos para la solicitud a la IA
    const aiRequestData = {
      model: aiConfig[0].model,              // Modelo de IA a utilizar
      messages: chatHistory,                // Historial de la conversación
      temperature: parseFloat(aiConfig[0].temperature)  // Creatividad de las respuestas
    };

    // Llamar al servicio de IA
    const aiResponse = await callAI(aiRequestData);
    
    // Manejar errores de la IA
    if (!aiResponse?.success) {
      throw new ApiError(
        aiResponse.message || 'Error en el servicio de IA',
        aiResponse.statusCode || 500,
        aiResponse.errors
      );
    }

    // Extraer contenido de la respuesta de la IA
    const aiMessageContent = aiResponse.data?.choices?.[0]?.message?.content;
    
    // Validar que haya contenido en la respuesta
    if (!aiMessageContent) {
      throw new ApiError('La respuesta de IA no contiene contenido', 500);
    }

    // Preparar objeto para la respuesta de la IA
    const aiChatMessage = {
      ...userChatMessage,     // Copiar propiedades del mensaje original
      sender: 'assistant',    // Indicar que el remitente es el asistente
      message: aiMessageContent  // Mensaje generado por la IA
    };

    // Insertar respuesta de la IA en la base de datos
    const insertAiResult = await chatModel.insertChatMessage(aiChatMessage);
    
    // Manejar errores en la inserción
    if (!insertAiResult.success) {
      throw new ValidationError(
        insertAiResult.message || 'Error al insertar la respuesta de IA',
        500,
        insertAiResult.errors
      );
    }

    // Retornar respuesta exitosa
    return res.status(200).json({
      success: true,
      message: aiMessageContent,
      html: ""
    });

  } catch (error) {
    // Manejo centralizado de errores
    const errorResponse = buildErrorResponse(error);
    return res.status(error.statusCode || 500).json(errorResponse);
  }
};

/**
 * Controlador para obtener el historial de una conversación por su ID
 * 
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta con el historial de conversación o error
 */
const getConversationHistoryById = async (req, res) => {
  try {

    const { moduleActive } = req.query; 
    const { id,  } = req.params;   
      // Insertar mensaje del usuario en la base de datos
      const resultChat = await chatModel.getChatMessages(id,moduleActive);
 
    // Validar que exista la conversación
    if (!resultChat) {
      throw new ApiError('Conversación no encontrada', 404);
    }

    // Retornar conversación encontrada
    return res.status(200).json({
      success: true,
      message: "Conversación obtenida exitosamente",
      data: resultChat.data[0]
    });

  } catch (error) {
    // Manejo centralizado de errores
    const errorResponse = buildErrorResponse(error);
    return res.status(error.statusCode || 500).json(errorResponse);
  }
};

module.exports = {
  generateConversationChatbot,
  getConversationHistoryById
};