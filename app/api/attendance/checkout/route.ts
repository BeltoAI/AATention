import { q } from "@/lib/db"; import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { attendance_id } = await req.json();
  if (!attendance_id) return NextResponse.json({ error: "attendance_id required" }, { status: 400 });
  const now = new Date();
  await q`UPDATE attendance SET checkout_at=${now.toISOString()} WHERE id=${attendance_id}`;
  return NextResponse.json({ ok: true });
}
