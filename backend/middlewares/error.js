const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log para desarrollo
  console.log(err.stack.red);

  // Error de Sequelize para duplicados
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Valor duplicado en el campo';
    error = new ErrorResponse(message, 400);
  }

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Error de sintaxis JSON
  if (err.type === 'entity.parse.failed') {
    const message = 'JSON malformado';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error del servidor'
  });
};

module.exports = errorHandler;