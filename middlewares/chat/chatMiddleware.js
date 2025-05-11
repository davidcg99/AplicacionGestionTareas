const { messageSchema } = require('./validation/chatValidation');

// Middleware para validar el cuerpo del mensaje
const validateChatBody = (req, res, next) => {
  const { error } = messageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,  // Devolvemos el primer error de validación
    });
  }

  next(); // Si pasa la validación, continua con el siguiente middleware
};

module.exports = {
  validateChatBody,
};