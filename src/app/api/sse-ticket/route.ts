// src/app/api/sse-ticket/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

const tickets = new Map<string, { userId: string; expiresAt: number }>();

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = crypto.randomBytes(24).toString("hex");
  tickets.set(ticket, {
    userId: session.user.id,
    expiresAt: Date.now() + 30_000, // 30 ثانية
  });

  setTimeout(() => tickets.delete(ticket), 30_000);

  return NextResponse.json({ ticket });
}

export function validateTicket(ticket: string): string | null {
  const entry = tickets.get(ticket);
  if (!entry || Date.now() > entry.expiresAt) return null;
  tickets.delete(ticket); // one-time use
  return entry.userId;
}
