import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId, setSessionCookie } from "@/lib/session";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isInteger(commentId) || commentId < 1 || commentId > 2147483647) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }

  const { sessionId, isNew } = await getOrCreateSessionId();

  if (!await prisma.comment.findUnique({ where: { id: commentId }, select: { id: true } })) {
    return NextResponse.json({ error: "Beitrag nicht gefunden" }, { status: 404 });
  }

  await prisma.commentLike.upsert({
    where: { sessionId_commentId: { sessionId, commentId } },
    update: {},
    create: { sessionId, commentId },
  });

  const likes = await prisma.commentLike.count({ where: { commentId } });

  const res = NextResponse.json({ id: commentId, likes, likedByMe: true });
  if (isNew) setSessionCookie(res, sessionId);
  return res;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isInteger(commentId) || commentId < 1 || commentId > 2147483647) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }

  const { sessionId, isNew } = await getOrCreateSessionId();

  await prisma.commentLike.deleteMany({ where: { sessionId, commentId } });

  const likes = await prisma.commentLike.count({ where: { commentId } });

  const res = NextResponse.json({ id: commentId, likes, likedByMe: false });
  if (isNew) setSessionCookie(res, sessionId);
  return res;
}
