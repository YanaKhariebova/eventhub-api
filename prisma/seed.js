import prisma from "../src/database/prismaClient.js";

const categoryNames = ["Musik", "Sport", "Kultur", "Bildung", "Gemeinschaft"];

try {
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Kategorien wurden angelegt oder waren bereits vorhanden.");
} catch {
  console.error(
    "Kategorie-Seed fehlgeschlagen. Datenbankkonfiguration prüfen.",
  );
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
