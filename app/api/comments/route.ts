import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
  });

  const maxLikes = Math.max(...comments.map((c) => c.likes));

  if (maxLikes > 0) {
    const topIndex = comments.findIndex((c) => c.likes === maxLikes);
    const [top] = comments.splice(topIndex, 1);
    comments.unshift(top);
  }

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const text = String(body.text ?? "").trim();
  const age = Number(body.age);

  const allowedGenders = ["maennlich", "weiblich", "divers"];
  const gender = allowedGenders.includes(body.gender) ? body.gender : null;

  if (!name || !text || !age) {
    return NextResponse.json({ error: "Bitte alle felder ausfüllen." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { name, age, text, gender },
  });

  return NextResponse.json(comment, { status: 201 });
}
