import { q } from "@/lib/db";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
function randomSecret(){ return randomUUID().replace(/-/g,""); }
export async function POST(req: Request) {
  const { class_id } = await req.json();
  if (!class_id) return NextResponse.json({ error: "class_id required" }, { status: 400 });
  const id = randomUUID(); const secret = randomSecret(); const start_at = new Date();
  await q`INSERT INTO sessions (id, class_id, start_at, secret) VALUES (${id}, ${class_id}, ${start_at.toISOString()}, ${secret})`;
  return NextResponse.json({ ok: true, id });
}
