import {
  findEventById,
  findEvents,
  createEvent,
} from "../services/eventService.js";

export async function getEventById(req, res, next) {
  try {
    const { id } = res.locals.params;
    const event = await findEventById(id);

    if (!event) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Veranstaltung nicht gefunden.",
        },
      });
    }

    return res.status(200).json({ data: event });
  } catch (error) {
    next(error);
  }
}
export async function getEvents(req, res, next) {
  try {
    const { page, limit } = res.locals.query;
    const { events, total } = await findEvents({ page, limit });

    return res.status(200).json({
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function postEvent(req, res, next) {
  try {
    const result = await createEvent(res.locals.body, res.locals.clerkId);

    if (result.error === "EVENT_IN_PAST") {
      return res.status(409).json({
        error: {
          code: "EVENT_IN_PAST",
          message: "Die Veranstaltung muss in der Zukunft liegen.",
        },
      });
    }

    if (result.error === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({
        error: {
          code: "CATEGORY_NOT_FOUND",
          message: "Kategorie nicht gefunden.",
        },
      });
    }

    return res.status(201).json({ data: result.event });
  } catch (error) {
    next(error);
  }
}
