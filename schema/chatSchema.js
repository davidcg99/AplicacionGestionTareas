const Joi = require('joi');

// Schema estricto que solo permite 'message' y 'guid'
const messageSchema = Joi.object({
  message: Joi.string().min(1).max(500).required().messages({
    'string.base': '"message" debe ser un texto',
    'string.empty': '"message" no puede estar vacío',
    'string.min': '"message" debe tener al menos 1 carácter',
    'string.max': '"message" no puede superar los 500 caracteres',
    'any.required': '"message" es obligatorio',
  }),
  guid: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.base': '"guid" debe ser un texto',
    'string.guid': '"guid" debe ser un UUID v4 válido',
    'any.required': '"guid" es obligatorio',
  }),
  moduleActive: Joi.string().min(1).max(500).required().messages({
    'string.base': '"moduleActive" debe ser un texto',
    'string.empty': '"moduleActive" no puede estar vacío',
    'string.min': '"moduleActive" debe tener al menos 1 carácter',
    'string.max': '"moduleActive" no puede superar los 500 caracteres',
    'any.required': '"moduleActive" es obligatorio',
  }),
})
.strict() // Rechaza cualquier parámetro adicional
.unknown(false); // Otra forma de asegurar que no se permiten campos extra

const schemaEmpty =  Joi.object({}).unknown(false) ;

// Schema solo para validar un GUID UUID v4
const guidSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.base': '"guid" debe ser un texto',
    'string.guid': '"guid" debe ser un UUID v4 válido',
    'any.required': '"guid" es obligatorio',
  }),
})
.strict()
.unknown(false);

// Schema solo para validar un GUID UUID v4
const ConversationHistoryQuerySchema = Joi.object({
  moduleActive: Joi.string().min(1).max(500).required().messages({
    'string.base': '"moduleActive" debe ser un texto',
    'string.empty': '"moduleActive" no puede estar vacío',
    'string.min': '"moduleActive" debe tener al menos 1 carácter',
    'string.max': '"moduleActive" no puede superar los 500 caracteres',
    'any.required': '"moduleActive" es obligatorio',
  })
})
.strict()
.unknown(false);

module.exports = {
  messageSchema,
  schemaEmpty,
  guidSchema,
  ConversationHistoryQuerySchema
};