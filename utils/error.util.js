// utils/error.utils.js
class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

class ApiError extends Error {
  constructor(message, statusCode = 500, errors) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const buildErrorResponse = (error) => {
  if (error instanceof ValidationError) {
    return {
      success: false,
      message: error.message,
      errors: error.errors
    };
  }

  if (error instanceof ApiError) {
    return {
      success: false,
      message: error.message,
      errors: error.errors
    };
  }

  // Error no controlado (opcional: logging aquí)
  console.error('Unhandled error:', error);
  return {
    success: false,
    message: 'Internal server error',
    errors: process.env.NODE_ENV === 'development' ? 
      [{ message: error.message }] : undefined
  };
};

module.exports = {
  ValidationError,
  ApiError,
  buildErrorResponse
};