import { q } from "@/lib/db";
export async function GET() {
  const { rows } = await q`SELECT id, class_id, start_at, end_at FROM sessions ORDER BY start_at DESC LIMIT 200`;
  return Response.json({ sessions: rows });
}
