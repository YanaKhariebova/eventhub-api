export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Der Request-Body enthält ungültiges JSON.",
      },
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(400).json({
      error: {
        code: "BODY_TOO_LARGE",
        message: "Der Request-Body ist zu groß.",
      },
    });
  }

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Ein interner Fehler ist aufgetreten.",
    },
  });
}
