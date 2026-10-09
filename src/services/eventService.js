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
export async function findEvents({
  page,
  limit,
  search,
  city,
  categoryId,
  from,
  to,
}) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  if (city) {
    where.city = { equals: city, mode: "insensitive" };
  }

  if (categoryId) {
    where.categoryId = { equals: categoryId };
  }

  if (from || to) {
    where.startsAt = {};

    if (from) {
      where.startsAt.gte = new Date(from);
    }

    if (to) {
      where.startsAt.lte = new Date(to);
    }
  }

  const [events, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
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
    prisma.event.count({ where }),
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
export async function updateEvent(id, data, clerkId) {
  const existingEvent = await prisma.event.findUnique({
    where: { id },
  });

  if (!existingEvent) {
    return { error: "EVENT_NOT_FOUND" };
  }

  const user = await findOrCreateUser(clerkId);

  if (existingEvent.organizerId !== user.id) {
    return { error: "FORBIDDEN" };
  }

  const now = new Date();

  if (existingEvent.startsAt <= now) {
    return { error: "EVENT_STARTED" };
  }

  if (data.startsAt !== undefined && new Date(data.startsAt) <= now) {
    return { error: "EVENT_IN_PAST" };
  }

  if (data.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return { error: "CATEGORY_NOT_FOUND" };
    }
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      city: data.city,
      location: data.location,
      startsAt:
        data.startsAt !== undefined ? new Date(data.startsAt) : undefined,
      categoryId: data.categoryId,
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

export async function deleteEvent(id, clerkId) {
  const existingEvent = await prisma.event.findUnique({
    where: { id },
  });

  if (!existingEvent) {
    return { error: "EVENT_NOT_FOUND" };
  }

  const user = await findOrCreateUser(clerkId);

  if (existingEvent.organizerId !== user.id) {
    return { error: "FORBIDDEN" };
  }

  const result = await prisma.event.deleteMany({
    where: { id, organizerId: user.id },
  });

  if (result.count === 0) {
    return { error: "EVENT_NOT_FOUND" };
  }

  return {};
}
