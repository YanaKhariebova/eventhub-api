import { z } from "zod";

export const eventParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const eventQuerySchema = z
  .object({
    search: z.string().trim().min(1).max(200).optional(), // Der Suchbegriff, nach dem gefiltert werden soll (optional)
    categoryId: z.coerce.number().int().positive().optional(),
    city: z.string().trim().min(1).max(100).optional(), // Die Stadt, nach der gefiltert werden soll (optional)
    from: z.iso.datetime({ offset: true }).optional(),
    to: z.iso.datetime({ offset: true }).optional(),
    page: z.coerce.number().int().min(1).default(1), // Die Seite, die abgerufen werden soll (Standard: 1)
    limit: z.coerce.number().int().min(1).max(50).default(10), // Die Anzahl der Elemente, die abgerufen werden sollen (Standard: 10)
  })
  .refine(
    (data) =>
      !data.from || !data.to || new Date(data.from) <= new Date(data.to),
    {
      message: "Der Beginn des Zeitraums darf nicht nach dem Ende liegen.",
      path: ["from"],
    },
  );

export const createEventSchema = z.strictObject({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  city: z.string().trim().min(1).max(100),
  location: z.string().trim().min(1).max(300),
  startsAt: z.iso.datetime({ offset: true }),
  categoryId: z.number().int().positive(),
});

export const updateEventSchema = createEventSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Mindestens ein Feld muss angegeben werden.",
  });
