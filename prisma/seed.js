const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const seedData = [
  { elapsed: 38, distractions: 2 },
  { elapsed: 55, distractions: 3 },
  { elapsed: 24, distractions: 1 },
  { elapsed: 71, distractions: 4 },
  { elapsed: 42, distractions: 2 },
  { elapsed: 19, distractions: 0 },
  { elapsed: 63, distractions: 3 },
  { elapsed: 31, distractions: 1 },
  { elapsed: 88, distractions: 5 },
  { elapsed: 47, distractions: 2 },
  { elapsed: 26, distractions: 1 },
  { elapsed: 59, distractions: 3 },
  { elapsed: 34, distractions: 2 },
  { elapsed: 77, distractions: 4 },
  { elapsed: 22, distractions: 0 },
  { elapsed: 51, distractions: 3 },
  { elapsed: 40, distractions: 2 },
  { elapsed: 66, distractions: 4 },
  { elapsed: 28, distractions: 1 },
  { elapsed: 83, distractions: 5 },
  { elapsed: 37, distractions: 2 },
  { elapsed: 44, distractions: 2 },
  { elapsed: 17, distractions: 0 },
  { elapsed: 60, distractions: 3 },
  { elapsed: 33, distractions: 1 },
];

async function main() {
  const existing = await prisma.testResult.count();
  if (existing > 0) {
    console.log(`Seed übersprungen: ${existing} Einträge bereits vorhanden.`);
    return;
  }

  await prisma.testResult.createMany({ data: seedData });

  await prisma.testStat.upsert({
    where: { id: 1 },
    update: { count: seedData.length },
    create: { id: 1, count: seedData.length },
  });

  console.log(`Seed abgeschlossen: ${seedData.length} Testeinträge angelegt.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
