import { q } from "@/lib/db";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const r = await q`SELECT a.checkin_at, a.checkout_at, s.name
    FROM attendance a LEFT JOIN students s ON s.id=a.student_id WHERE a.id=${id}`;
  return Response.json(r.rows[0] || {});
}
