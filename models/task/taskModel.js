const promisePool = require("../../config/database/db");

class ChatModel {
  /**
 * Obtiene todas las tareas registradas mediante un procedimiento almacenado.
 * 
 * @returns {Promise<{success: boolean, data: Array<Object>, message: string}>} 
 * Un objeto que indica si la operación fue exitosa, contiene los datos devueltos y un mensaje descriptivo.
 * 
 * @throws {Error} - Si ocurre un error durante la consulta a la base de datos.
 */
  static async getTaskExists(userId = -1) {
    const sql = `CALL sp_TaskOperations(?,?,?,?,?,?)`;
    const params = [
      1, // Tipo de operación a ejecutar: 1 = Obtener todas las tareas
      userId > 0 ? userId: -1,
      null,
      null,
      null,
      null
    ];

    try {
      let [rows] = await promisePool.query(sql, params);
      
      return {
        success: true,
        data: rows,
        message: rows.length
          ? 'Tareas obtenidas correctamente.'
          : 'No se encontraron tareas registradas.'
      };
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error(`Error al obtener las tareas: ${error.message}`);
    }
  }


  
/**
 * Inserta una nueva tarea mediante un procedimiento almacenado.
 * 
 * @param {Object} params - Objeto con los datos de la nueva tarea.
 * @param {string} params.title - Título de la tarea (obligatorio).
 * @param {string|null} [params.description=null] - Descripción de la tarea (opcional).
 * 
 * @returns {Promise<{success: boolean, data: Array<Object>, message: string}>}
 * Un objeto que indica si la operación fue exitosa, incluye los datos devueltos y un mensaje descriptivo.
 * 
 * @throws {Error} - Si ocurre un error durante la inserción en la base de datos.
 */
static async insertTask({
  title,
  description = null,
  userId = null
}) {
  const sql = `CALL sp_TaskOperations(?,?,?,?,?,?)`;
  const params = [
    2, // Tipo de operación: 2 = insertar tarea
    userId,
    title,
    description,
    null,
    null
  ];

  try {
    let [rows] = await promisePool.query(sql, params);

    return {
      success: true,
      data: rows,
      message: rows.length
        ? 'Tarea insertada correctamente.'
        : 'No se pudo insertar la tarea.'
    };
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error(`Error al insertar la tarea: ${error.message}`);
  }
}


/**
 * Actualiza una tarea existente mediante un procedimiento almacenado.
 * 
 * @param {Object} params - Objeto con los datos a actualizar.
 * @param {string} params.title - Título de la tarea (obligatorio).
 * @param {string|null} [params.description=null] - Descripción de la tarea (opcional).
 * @param {boolean|number} params.completed - Estado de finalización de la tarea (true/false o 1/0).
 * @param {number} params.idTask - ID de la tarea a actualizar (obligatorio).
 * 
 * @returns {Promise<{success: boolean, data: Array<Object>, message: string}>}
 * Un objeto que indica si la operación fue exitosa, incluye los datos devueltos y un mensaje descriptivo.
 * 
 * @throws {Error} - Si ocurre un error durante la actualización en la base de datos.
 */
static async updateTask({
  title = null,
  description = null,
  completed = null,
  userId = null,
  idTask
}) {
  const sql = `CALL sp_TaskOperations(?,?,?,?,?,?)`;
  const params = [
    3,         // Tipo de operación: 3 = actualizar tarea
    userId,    
    title,
    description,
    completed,
    idTask
  ];

  try {
    const [rows] = await promisePool.query(sql, params);

    return {
      success: true,
      data: rows,
      message: rows.length
        ? 'Tarea actualizada correctamente.'
        : 'No se pudo actualizar la tarea.'
    };
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error(`Error al actualizar la tarea: ${error.message}`);
  }
}

static async deleteTask({
  idTask
}) {
  const sql = `CALL sp_TaskOperations(?,?,?,?,?,?)`;
  const params = [
    4,         // Tipo de operación: 3 = actualizar tarea
    null,    
    null,
    null,
    null,
    idTask
  ];

  try {
    const [rows] = await promisePool.query(sql, params);

    return {
      success: true,
      data: rows,
      message: rows.length
        ? 'Tarea eliminada correctamente.'
        : 'No se pudo eliminar la tarea.'
    };
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error(`Error al eliminar la tarea: ${error.message}`);
  }
}


 
}

module.exports = ChatModel;