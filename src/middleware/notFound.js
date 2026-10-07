// Middleware für 404-Fehler.

export function notFound(req, res) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route nicht gefunden.",
    },
  });
}
