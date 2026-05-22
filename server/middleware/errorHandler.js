// Centralized error handling middleware for Lumina Academy REST APIs
const errorHandler = (err, req, res, next) => {
  console.error('Error Intercepted:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let validationErrors = null;

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Failed';
    validationErrors = Object.values(err.errors).map((el) => el.message);
  }

  // Handle Mongoose Duplicate Key Error (e.g., duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate Field Entry';
    const fieldName = Object.keys(err.keyValue)[0];
    validationErrors = [`The ${fieldName} provided is already registered in the system.`];
  }

  // Handle Mongoose CastError (e.g. invalid MongoDB ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
    validationErrors = [`The value '${err.value}' is not a valid format for ${err.path}.`];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: validationErrors || [message],
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
