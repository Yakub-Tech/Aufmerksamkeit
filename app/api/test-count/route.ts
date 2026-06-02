import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stat = await prisma.testStat.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, count: 0 },
  });

  return NextResponse.json({ count: stat.count });
}

export async function POST() {
  const stat = await prisma.testStat.upsert({
    where: { id: 1 },
    update: { count: { increment: 1 } },
    create: { id: 1, count: 1 },
  });

  return NextResponse.json({ count: stat.count });
}
