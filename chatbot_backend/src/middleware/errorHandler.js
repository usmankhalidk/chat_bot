const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
