const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const seedData = [
  { elapsed: 214, distractions: 3 },
  { elapsed: 187, distractions: 1 },
  { elapsed: 302, distractions: 5 },
  { elapsed: 256, distractions: 4 },
  { elapsed: 173, distractions: 2 },
  { elapsed: 341, distractions: 7 },
  { elapsed: 198, distractions: 2 },
  { elapsed: 275, distractions: 4 },
  { elapsed: 159, distractions: 0 },
  { elapsed: 388, distractions: 8 },
  { elapsed: 231, distractions: 3 },
  { elapsed: 164, distractions: 1 },
  { elapsed: 319, distractions: 6 },
  { elapsed: 245, distractions: 3 },
  { elapsed: 182, distractions: 2 },
  { elapsed: 267, distractions: 4 },
  { elapsed: 354, distractions: 7 },
  { elapsed: 193, distractions: 2 },
  { elapsed: 221, distractions: 3 },
  { elapsed: 178, distractions: 1 },
  { elapsed: 296, distractions: 5 },
  { elapsed: 412, distractions: 9 },
  { elapsed: 168, distractions: 0 },
  { elapsed: 238, distractions: 3 },
  { elapsed: 285, distractions: 5 },
];

const commentData = [
  {
    name: "Lena",
    age: 24,
    gender: "weiblich",
    text: "Ich lege mein Handy beim Lernen in einen anderen Raum. Klingt simpel, aber seitdem schaue ich viel seltener nach.",
  },
  {
    name: "Jonas",
    age: 27,
    gender: "maennlich",
    text: "Graustufenmodus war für mich ein echter Gamechanger. Ohne die bunten Farben ziehen mich Apps kaum noch an.",
  },
  {
    name: "Mara",
    age: 21,
    gender: "divers",
    text: "Ich arbeite mit 25-Minuten-Blöcken und mache danach kurz Pause. Der feste Rhythmus hilft mir, dranzubleiben.",
  },
  {
    name: "Tim",
    age: 30,
    gender: "maennlich",
    text: "Push-Benachrichtigungen habe ich bis auf Anrufe komplett aus. Mein Kopf ist dadurch deutlich ruhiger geworden.",
  },
  {
    name: "Sophie",
    age: 19,
    gender: "weiblich",
    text: "Mein Homescreen hat jetzt nur noch die Apps, die ich wirklich brauche. Alles andere ist in einem Ordner versteckt.",
  },
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

  const existingComments = await prisma.comment.count();
  if (existingComments === 0) {
    await prisma.comment.createMany({ data: commentData });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
