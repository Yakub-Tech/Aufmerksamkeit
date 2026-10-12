import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId, setSessionCookie } from "@/lib/session";

export async function GET() {
  const { sessionId, isNew } = await getOrCreateSessionId();

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { likedBy: true } },
      likedBy: { where: { sessionId }, select: { id: true } },
    },
  });

  const result = comments.map((c) => ({
    id: c.id,
    name: c.name,
    age: c.age,
    text: c.text,
    gender: c.gender,
    createdAt: c.createdAt,
    likes: c._count.likedBy,
    likedByMe: c.likedBy.length > 0,
  }));

  const maxLikes = Math.max(0, ...result.map((c) => c.likes));
  if (maxLikes > 0) {
    const topIndex = result.findIndex((c) => c.likes === maxLikes);
    const [top] = result.splice(topIndex, 1);
    result.unshift(top);
  }

  const res = NextResponse.json(result);
  if (isNew) setSessionCookie(res, sessionId);
  return res;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const age = body?.age;

  const allowedGenders = ["maennlich", "weiblich", "divers"];
  const gender = allowedGenders.includes(body?.gender) ? body.gender : null;

  if (!name || name.length > 80 || !text || text.length > 2000 || !Number.isInteger(age) || age < 1 || age > 120) {
    return NextResponse.json({ error: "Name (max. 80 Zeichen), Text (max. 2000 Zeichen) und gültiges Alter (1–120) erforderlich." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { name, age, text, gender },
  });

  return NextResponse.json({ ...comment, likes: 0, likedByMe: false }, { status: 201 });
}
