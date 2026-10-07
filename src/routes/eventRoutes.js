import { Router } from "express";
import {
  getEventById,
  getEvents,
  postEvent,
} from "../controllers/eventController.js";
import {
  validateParams,
  validateQuery,
  validateBody,
} from "../middleware/validate.js";
import {
  eventParamsSchema,
  eventQuerySchema,
  createEventSchema,
} from "../schemas/eventSchema.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, validateBody(createEventSchema), postEvent);

router.get("/", validateQuery(eventQuerySchema), getEvents);
router.get("/:id", validateParams(eventParamsSchema), getEventById);

export default router;
