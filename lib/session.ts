import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

// Liest die Session-ID aus dem Cookie oder erzeugt eine neue.
export async function getOrCreateSessionId() {
  const store = await cookies();
  const existing = store.get("session_id")?.value;
  if (existing) return { sessionId: existing, isNew: false };
  return { sessionId: randomUUID(), isNew: true };
}

export function setSessionCookie(res: NextResponse, sessionId: string) {
  res.cookies.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.SESSION_COOKIE_SECURE !== "false",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
