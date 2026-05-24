import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const comments = await prisma.comment.findMany({
    orderBy: [{ likes: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const text = String(body.text ?? "").trim();
  const age = Number(body.age);

  if (!name || !text || !age) {
    return NextResponse.json({ error: "Bitte alle felder ausfüllen." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { name, age, text },
  });

  return NextResponse.json(comment, { status: 201 });
}
