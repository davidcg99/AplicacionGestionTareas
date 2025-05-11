
const { ApiError, buildErrorResponse } = require('../../utils/error.util');
const taskModel = require('../../models/task/taskModel');

/**
 * Controlador para obtener el historial de una conversación por su ID
 * 
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta con task o error
 */
const getTasks = async (req, res) => {
  try {
 
    let { userId } = req.query;   

      // Insertar mensaje del usuario en la base de datos
      const resultChat = await taskModel.getTaskExists(parseInt(userId));
      const task =  resultChat.data[0].map(task => ({
        ...task,
        completed: Boolean(task.completed),
      }));
    // Validar que exista la conversación
    if (!resultChat) {
      throw new ApiError('registros no encontrados', 404);
    }

    // Retornar conversación encontrada
    return res.status(200).json({
      success: true,
      message: "registros obtenidos exitosamente",
      data: task
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
 * @returns {Promise<Object>} Respuesta con el task o error
 */
const insertTask = async (req, res) => {
  try {
 
    let { title, description, userId } = req.body;   

      // Insertar mensaje del usuario en la base de datos
      const resultChat = await taskModel.insertTask({title, description,userId});
      const task =  resultChat.data[0].map(task => ({
        ...task,
        completed: Boolean(task.completed),
        created_at: new Date(task.created_at).toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T') + 'Z',
        updated_at: new Date(task.updated_at).toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T') + 'Z',
      }));
    // Validar que exista la conversación
    if (!resultChat) {
      throw new ApiError('registros no encontrados', 404);
    }

    // Retornar conversación encontrada
    return res.status(200).json({
      success: true,
      message: "registro insertado exitosamente",
      data: task
    });

  } catch (error) {
    // Manejo centralizado de errores
    const errorResponse = buildErrorResponse(error);
    return res.status(error.statusCode || 500).json(errorResponse);
  }
};


/**
 * Controlador para obtener task por su ID
 * 
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta con task o error
 */
const updateTask = async (req, res) => {
  try {
 
    let { title, description, completed, user_id } = req.body;   
    let { id } = req.params;   
    let idTask = parseInt(id);
    let userId = user_id;
      // Insertar mensaje del usuario en la base de datos
      const resultChat = await taskModel.updateTask({title, description,completed,userId,idTask});
      const task =  resultChat.data[0].map(task => ({
        ...task,
        completed: Boolean(task.completed),
        created_at: new Date(task.created_at).toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T') + 'Z',
        updated_at: new Date(task.updated_at).toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T') + 'Z',
      }));
    // Validar que exista la conversación
    if (!resultChat) {
      throw new ApiError('registro no encontrado', 404);
    }

    // Retornar conversación encontrada
    return res.status(200).json({
      success: true,
      message: "registro actualizado exitosamente",
      data: task
    });

  } catch (error) {
    // Manejo centralizado de errores
    const errorResponse = buildErrorResponse(error);
    return res.status(error.statusCode || 500).json(errorResponse);
  }


  
};



const deleteTask = async (req, res) => {
  try {
    let { id } = req.params;   
    let idTask = parseInt(id);
      // Insertar mensaje del usuario en la base de datos
      const resultChat = await taskModel.deleteTask({idTask});
      
    // Validar que exista la conversación
    if (!resultChat) {
      throw new ApiError('registro no encontrado', 404);
    }

    // Retornar conversación encontrada
    return res.status(200).json({
      success: true,
      message: "registro eliminado exitosamente",
      data: []
    });

  } catch (error) {
    // Manejo centralizado de errores
    const errorResponse = buildErrorResponse(error);
    return res.status(error.statusCode || 500).json(errorResponse);
  }


  
};


module.exports = {
    getTasks,
    insertTask,
    updateTask,
    deleteTask
};