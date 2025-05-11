


const {  buildErrorResponse } = require('../../utils/error.util');
const Joi = require('joi');

/**
 * Middleware de validación universal estricto
 * @param {Object} options
 * @param {Joi.Schema} [options.body] - Schema para el body
 * @param {Joi.Schema} [options.params] - Schema para los params
 * @param {Joi.Schema} [options.query] - Schema para la query
 * @param {Object} [joiOptions] - Opciones adicionales para Joi
 * @returns {Function} Middleware de Express
 */
function validateRequest({ body, params, query } = {}, joiOptions = {}) {
  return (req, res, next) => {
    const errors = [];
    const defaultOptions = {
      abortEarly: false,
      stripUnknown: false, // No eliminar campos no definidos
      allowUnknown: true, // Rechazar campos no definidos
      ...joiOptions
    };

    // Validación estricta para cada parte del request
    const validations = [
      { key: 'body', schema: body, value: req.body },
      { key: 'params', schema: params, value: req.params },
      { key: 'query', schema: query, value: req.query }
    ];

    validations.forEach(({ key, schema, value }) => {
      if (schema) {
        const { error } = schema.validate(value, defaultOptions);
        
        if (error) {
          error.details.forEach(detail => {
            errors.push({
              location: key,
              field: detail.path.join('.'),
              message: detail.message.replace(/['"]+/g, ''),
              type: detail.type
            });
          });
        }
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    next();
  };
}

module.exports = validateRequest;