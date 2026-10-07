// Middleware zur Validierung von URL-Parametern mit Zod.

export function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Ungültige URL-Parameter.",
        },
      });
    }

    res.locals.params = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Ungültige Query-Parameter.",
        },
      });
    }

    res.locals.query = result.data;
    next();
  };
}
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Ungültiger Request-Body.",
        },
      });
    }

    res.locals.body = result.data;
    next();
  };
}
