import prisma from "../database/prismaClient.js";

export async function findAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}
