import { q } from "@/lib/db"; import { currentPin } from "@/lib/utils";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get("sid");
  if (!sid) return Response.json({ error: "sid required" }, { status: 400 });
  const s = await q`SELECT secret FROM sessions WHERE id=${sid}`;
  if (!s.rows[0]) return Response.json({ error: "not found" }, { status: 404 });
  const pin = currentPin(sid!, s.rows[0].secret);
  return Response.json({ pin });
}
