export function errorHandler(error, req, res, next) {
  console.error("ERROR:", error);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
      stack:
        process.env.NODE_ENV === "development"
          ? error.stack
          : undefined
    }
  });
}