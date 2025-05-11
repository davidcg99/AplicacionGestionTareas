const promisePool = require("../../config/database/db");

class UserModel {
  /**
   * 🔹 Obtiene información del usuario a través de un procedimiento almacenado.
   * @param {string} username - Nombre de usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<Object>} - Resultado con validación, mensaje y datos del usuario.
   */
  static async getUser(username, password) {
    try {
      // 🟢 Ejecuta el procedimiento almacenado con operación 1 (ej: autenticación)
      const [results] = await promisePool.query(
        "CALL sp_UserOperations(?, ?, ?)",
        [1, username, password]
      );

      // 🟢 Obtiene los datos del primer result set (MySQL almacena los resultados en un array)
      const userData = results?.[0] || [];

      // 🟢 Retorna respuesta estructurada
      return {
        valid: userData.length > 0, // Verifica si se encontró el usuario
        message: userData.length > 0 ? "Acceso correcto." : "Usuario o contraeña incorrecta.",
        data: userData,
      };

    } catch (error) {
      // 🔴 Manejo de errores en la base de datos
      console.error("DB Error - getUser:", error.message);

      return {
        valid: false,
        message: error.message,
        data: null,
        error: error.message, // Opcional, útil para depuración
      };
    }
  }
  
}

// 🔹 Exportar la clase para su uso en otros módulos
module.exports = UserModel;
