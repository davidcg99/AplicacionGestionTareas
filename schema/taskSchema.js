const Joi = require('joi');

/**
 * Schema para validar el query param `userId` en solicitudes GET a /task
 * Se espera que `userId` sea un número entero positivo.
 */
const taskQuerySchema = Joi.object({
  userId: Joi.number().integer().positive().messages({
    'number.base': '"userId" debe ser un número',
    'number.integer': '"userId" debe ser un número entero',
    'number.positive': '"userId" debe ser un número positivo',
  }),
}).unknown(false); // No se permiten otros campos

/**
 * Schema para validar el query param `userId` en solicitudes GET a /task
 * Se espera que `userId` sea un número entero positivo.
 */
const taskParamSchema = Joi.object({
 id: Joi.number().integer().positive().messages({
    'number.base': '"userId" debe ser un número',
    'number.integer': '"userId" debe ser un número entero',
    'number.positive': '"userId" debe ser un número positivo',
  }),
}).unknown(false); // No se permiten otros campos


const schemaEmpty = Joi.object({}).unknown(false);


/**
 * Schema para validar la creación de una nueva tarea (POST /tasks).
 * - title: obligatorio, texto no vacío.
 * - description: opcional, texto.
 */
const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    'string.base': '"title" debe ser un texto',
    'string.empty': '"title" no puede estar vacío',
    'string.min': '"title" debe tener al menos 1 carácter',
    'string.max': '"title" no puede superar los 255 caracteres',
    'any.required': '"title" es obligatorio',
  }),
  description: Joi.string().max(1000).allow('').optional().messages({
    'string.base': '"description" debe ser un texto',
    'string.max': '"description" no puede superar los 1000 caracteres',
  }),
   userId: Joi.number().integer().positive().optional().messages({
    'number.base': '"userId" debe ser un número',
    'number.integer': '"userId" debe ser un número entero',
    'number.positive': '"userId" debe ser un número positivo',
  }),
}).unknown(false); // ❌ No se permiten otros campos


/**
 * Schema para validar la creación o actualización de una tarea (POST /tasks o PUT /tasks).
 * - title: obligatorio, texto no vacío (máx. 255 caracteres).
 * - description: opcional, texto (máx. 1000 caracteres).
 * - completed: opcional, booleano (true o false).
 */

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).allow('').optional().messages({
      'string.base': '"title" debe ser un texto',
      'string.empty': '"title" no puede estar vacío',
      'string.min': '"title" debe tener al menos 1 carácter',
      'string.max': '"title" no puede superar los 255 caracteres',
      'any.required': '"title" es obligatorio',
    }),
  description: Joi.string().trim().max(1000).allow('').optional().messages({
      'string.base': '"description" debe ser un texto',
      'string.max': '"description" no puede superar los 1000 caracteres',
    }),
  completed: Joi.boolean().optional().messages({
      'boolean.base': '"completed" debe ser un valor booleano (true o false)',
    }),
  userId: Joi.number().integer().positive().optional().messages({
    'number.base': '"userId" debe ser un número',
    'number.integer': '"userId" debe ser un número entero',
    'number.positive': '"userId" debe ser un número positivo',
  }),
}).unknown(false); // No se permiten otros campos adicionales



module.exports = {
  taskQuerySchema,
  schemaEmpty,
  createTaskSchema,
  updateTaskSchema,
  taskParamSchema
};
