const { AppError } = require("../../middleware/errorHandler");

describe("AppError", () => {
  test("constructor 應該設定 message 跟 statusCode", () => {
    const message = "Not found";
    const statusCode = 404;

    const err = new AppError(message, statusCode);

    expect(err.message).toBe(message);
    expect(err.statusCode).toBe(statusCode);
  });

  test("isOperational 預設為 true", () => {
    const err = new AppError("test", 500);

    expect(err.isOperational).toBe(true);
  });

  test("AppError 繼承自 Error，instanceof Error 為 true", () => {
    const err = new AppError("test", 500);

    expect(err).toBeInstanceOf(Error);
  });
});
