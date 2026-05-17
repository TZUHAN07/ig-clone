class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err);

  let statusCode = err.statusCode || 500;
  let message = "伺服器錯誤";

  if (err.isOperational) {
    message = err.message;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "資料格式錯誤";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "輸入資料驗證失敗";
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "資料已存在";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
module.exports = { AppError, asyncHandler, errorHandler };
