import prisma from "../database/prismaClient.js";

export async function findOrCreateUser(clerkId) {
  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });
}
