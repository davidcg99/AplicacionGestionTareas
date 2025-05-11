const axios = require('axios');

// Función para hacer la solicitud POST a la API de IA
async function callAI(requestData) {
    try {
        // Validación de las variables de entorno necesarias
        const authToken = process.env.AUTH_TOKEN_IA;  // Token genérico para cualquier API de IA
        const apiUrl = process.env.URL_API_IA;        // URL genérica para cualquier API de IA

        if (!authToken || !apiUrl) {
            throw new Error("Faltan variables de entorno: AUTH_TOKEN_IA o URL_API_IA");
        }

        // Configuración de la solicitud HTTP POST
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        };

        // Realizar la solicitud POST a la API
        const response = await axios.post(apiUrl, requestData, config);

        // Retornar la respuesta generada por la API de IA
        return {
            success: true,
            data: response.data
        };

    } catch (error) {
        console.error("Error al realizar la petición a la API de IA:", error);

        // Manejo del error
        const errorReturn = {
            success: false,
            message: "Error al realizar la petición",
            errors: [] 
        };

        if (error.response) {
            // Si el error tiene una respuesta, la retornamos
            errorReturn.message = `Error en la respuesta de la API de IA: ${
                error.response && 
                error.response.data && 
                error.response.data.error && 
                error.response.data.error.message 
                  ? error.response.data.error.message 
                  : 'Desconocido'
              }`;
            errorReturn.errors = error.response.data;
        } else {
            // Si no hay respuesta (por ejemplo, error de red o configuración)
            errorReturn.message = error.message || "Error desconocido";
        }

        // Retornar los detalles del error
        return errorReturn;
    }
}

module.exports = { callAI };
