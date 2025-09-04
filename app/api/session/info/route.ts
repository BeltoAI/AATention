import { q } from "@/lib/db";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get("sid");
  if (!sid) return Response.json({ error: "sid required" }, { status: 400 });
  const s = await q`SELECT s.id, s.class_id, c.name as class_name, s.start_at, s.end_at FROM sessions s LEFT JOIN classes c ON s.class_id=c.id WHERE s.id=${sid}`;
  return Response.json(s.rows[0] || {});
}
