import { z } from "zod";

export const eventParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const eventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1), // Die Seite, die abgerufen werden soll (Standard: 1)
  limit: z.coerce.number().int().min(1).max(50).default(10), // Die Anzahl der Elemente, die abgerufen werden sollen (Standard: 10)
});

export const createEventSchema = z.strictObject({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  city: z.string().trim().min(1).max(100),
  location: z.string().trim().min(1).max(300),
  startsAt: z.iso.datetime({ offset: true }),
  categoryId: z.number().int().positive(),
});
