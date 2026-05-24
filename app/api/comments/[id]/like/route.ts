import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id);
  if (isNaN(commentId)) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: { likes: { increment: 1 } },
  });

  return NextResponse.json(comment);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id);
  if (isNaN(commentId)) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }

  const current = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!current) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: { likes: Math.max(0, current.likes - 1) },
  });

  return NextResponse.json(comment);
}
