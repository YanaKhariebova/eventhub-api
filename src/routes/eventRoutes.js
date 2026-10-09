import { Router } from "express";
import {
  getEventById,
  getEvents,
  postEvent,
  patchEvent,
  removeEvent,
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
  updateEventSchema,
} from "../schemas/eventSchema.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, validateBody(createEventSchema), postEvent);

router.get("/", validateQuery(eventQuerySchema), getEvents);
router.get("/:id", validateParams(eventParamsSchema), getEventById);
router.patch(
  "/:id",
  authenticate,
  validateParams(eventParamsSchema),
  validateBody(updateEventSchema),
  patchEvent,
);
router.delete(
  "/:id",
  authenticate,
  validateParams(eventParamsSchema),
  removeEvent,
);

export default router;
