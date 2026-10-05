import express from "express";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json({ limit: "100kb" }));
// Prüft, ob die API erreichbar ist.
app.get("/health", (req, res) => {
  res.status(200).json({
    data: { status: "ok" },
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
