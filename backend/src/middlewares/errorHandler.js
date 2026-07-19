const buildValidationDetails = (error) => {
  if (!error?.errors) {
    return undefined;
  }

  return Object.values(error.errors).map((item) => ({
    field: item.path,
    message: item.message,
  }));
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  error.errorCode = "ROUTE_NOT_FOUND";
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || "Error interno del servidor";
  let errorCode = error.errorCode || "INTERNAL_SERVER_ERROR";
  let details;

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Error de validacion";
    errorCode = "VALIDATION_ERROR";
    details = buildValidationDetails(error);
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = `Valor invalido para ${error.path}`;
    errorCode = "CAST_ERROR";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "Registro duplicado";
    errorCode = "DUPLICATE_KEY";
    details = {
      fields: Object.keys(error.keyValue || {}),
      values: error.keyValue || {},
    };
  }

  const payload = {
    ok: false,
    message,
    error: errorCode,
  };

  if (details) {
    payload.details = details;
  }

  res.status(statusCode).json(payload);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
