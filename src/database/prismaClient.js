import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL muss gesetzt sein.");
}

const prisma = new PrismaClient({
  log: ["warn"],
});

export default prisma;
