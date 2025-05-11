const Joi = require('joi');

/**
 * Schema para validar las credenciales de autenticación (login).
 * Valida que el campo `username` y `password` estén presentes,
 * sean cadenas de texto y cumplan con reglas mínimas de longitud.
 */
const AuthSchema = Joi.object({
  // 🔹 Campo: username
  username: Joi.string().min(3).max(100).required().messages({
    'string.base': '"username" debe ser un texto',
    'string.empty': '"username" no puede estar vacío',
    'string.min': '"username" debe tener al menos 3 caracteres',
    'string.max': '"username" no puede superar los 100 caracteres',
    'any.required': '"username" es obligatorio',
  }),

  // 🔹 Campo: password
  password: Joi.string().min(1).max(100).required().messages({
    'string.base': '"password" debe ser un texto',
    'string.empty': '"password" no puede estar vacío',
    'string.min': '"password" debe tener al menos 6 caracteres',
    'string.max': '"password" no puede superar los 100 caracteres',
    'any.required': '"password" es obligatorio',
  })
})
// 🔒 No se permiten campos adicionales fuera de username y password
.strict()
.unknown(false);

/**
 * Schema vacío para asegurar que no se envíen datos en el body.
 * Puede utilizarse en rutas que no requieren datos de entrada.
 */
const schemaEmpty = Joi.object({}).unknown(false);

/**
 * @typedef {Object} Schemas
 * @property {Joi.ObjectSchema} AuthSchema - Validación para login
 * @property {Joi.ObjectSchema} schemaEmpty - Validación para cuerpo vacío
 */
module.exports = {
  AuthSchema,
  schemaEmpty,
};
