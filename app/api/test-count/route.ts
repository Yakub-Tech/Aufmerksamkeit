import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stat = await prisma.testStat.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, count: 0 },
  });

  const agg = await prisma.testResult.aggregate({
    _avg: { elapsed: true, distractions: true },
  });

  const avgElapsed =
    agg._avg.elapsed !== null ? Math.round(agg._avg.elapsed) : null;
  const avgDistractions =
    agg._avg.distractions !== null ? Math.round(agg._avg.distractions) : null;

  return NextResponse.json({ count: stat.count, avgElapsed, avgDistractions });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const elapsed = body?.elapsed;
  const distractions = body?.distractions;
  if (!Number.isInteger(elapsed) || elapsed < 0 || elapsed > 86400 || !Number.isInteger(distractions) || distractions < 0 || distractions > 24) {
    return NextResponse.json({ error: "Ungültiges Testergebnis." }, { status: 400 });
  }

  const [, stat] = await prisma.$transaction([
    prisma.testResult.create({ data: { elapsed, distractions } }),
    prisma.testStat.upsert({
      where: { id: 1 },
      update: { count: { increment: 1 } },
      create: { id: 1, count: 1 },
    }),
  ]);

  return NextResponse.json({ count: stat.count });
}
