const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ message: messages[0], errors: messages });
  }

  // Sequelize unique constraint
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "This record already exists" });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
