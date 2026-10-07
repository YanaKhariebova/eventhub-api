import prisma from "../database/prismaClient.js";
import { findOrCreateUser } from "./userService.js";

// Event mit ID finden
export async function findEventById(id) {
  return prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      city: true,
      location: true,
      startsAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

// Alle Events mit Pagination finden
export async function findEvents({ page, limit }) {
  const skip = (page - 1) * limit;

  const [events, total] = await prisma.$transaction([
    prisma.event.findMany({
      skip,
      take: limit,
      orderBy: [{ startsAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        description: true,
        city: true,
        location: true,
        startsAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.event.count(),
  ]);

  return { events, total };
}

// Neues Event erstellen
export async function createEvent(data, clerkId) {
  const startsAt = new Date(data.startsAt);

  if (startsAt <= new Date()) {
    return { error: "EVENT_IN_PAST" };
  }

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    return { error: "CATEGORY_NOT_FOUND" };
  }

  const user = await findOrCreateUser(clerkId);

  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      city: data.city,
      location: data.location,
      startsAt,
      categoryId: category.id,
      organizerId: user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      city: true,
      location: true,
      startsAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return { event };
}
