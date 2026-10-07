import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import eventRoutes from "./routes/eventRoutes.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(clerkMiddleware());

// Prüft, ob die API erreichbar ist.
app.get("/health", (req, res) => {
  res.status(200).json({
    data: { status: "ok" },
  });
});

app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
