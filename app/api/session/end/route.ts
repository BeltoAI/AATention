import { q } from "@/lib/db";
export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const end_at = new Date();
  await q`UPDATE sessions SET end_at=${end_at.toISOString()} WHERE id=${id}`;
  return Response.json({ ok: true });
}
