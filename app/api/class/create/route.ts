import { q } from "@/lib/db";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const id = randomUUID();
  await q`INSERT INTO classes (id, name) VALUES (${id}, ${name})`;
  return NextResponse.json({ ok: true, id });
}
