import { q } from "@/lib/db"; import { verifyPin } from "@/lib/utils"; import { NextResponse } from "next/server"; import { randomUUID } from "crypto";
export async function POST(req: Request) {
  const { name, pin, sid, geo } = await req.json();
  if (!name || !pin) return NextResponse.json({ error: "name and pin required" }, { status: 400 });
  let session_id = sid;
  if (!session_id) {
    const s = await q`SELECT id, secret FROM sessions WHERE end_at IS NULL ORDER BY start_at DESC LIMIT 1`;
    if (!s.rows[0]) return NextResponse.json({ error: "no active session" }, { status: 400 });
    session_id = s.rows[0].id;
    if (!verifyPin(session_id, s.rows[0].secret, pin)) return NextResponse.json({ error: "invalid PIN" }, { status: 400 });
  } else {
    const s = await q`SELECT secret FROM sessions WHERE id=${session_id}`;
    if (!s.rows[0]) return NextResponse.json({ error: "invalid session" }, { status: 400 });
    if (!verifyPin(session_id, s.rows[0].secret, pin)) return NextResponse.json({ error: "invalid PIN" }, { status: 400 });
  }
  const student_id = randomUUID();
  const st = await q`INSERT INTO students (id, name) VALUES (${student_id}, ${name}) RETURNING id`;
  const attendance_id = randomUUID(); const now = new Date();
  const ua = (req.headers.get("user-agent") || "").slice(0, 300);
  await q`INSERT INTO attendance (id, session_id, student_id, checkin_at, geo_lat, geo_lon, user_agent)
          VALUES (${attendance_id}, ${session_id}, ${st.rows[0].id}, ${now.toISOString()}, ${geo?.lat ?? null}, ${geo?.lon ?? null}, ${ua})`;
  return NextResponse.json({ ok: true, attendance_id });
}
