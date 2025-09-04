import { q } from "@/lib/db";
export async function GET() {
  const { rows } = await q`SELECT id, name FROM classes ORDER BY created_at DESC`;
  return Response.json({ classes: rows });
}
