import { getAuth } from "@clerk/express";

export function authenticate(req, res, next) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentifizierung erforderlich.",
      },
    });
  }

  res.locals.clerkId = userId;
  next();
}
