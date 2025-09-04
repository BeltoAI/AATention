import { q } from "@/lib/db"; import QRCode from "qrcode";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get("sid");
  if (!sid) return Response.json({ error: "sid required" }, { status: 400 });
  const s = await q`SELECT id FROM sessions WHERE id=${sid}`;
  if (!s.rows[0]) return Response.json({ error: "not found" }, { status: 404 });
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/student/check?sid=${encodeURIComponent(sid!)}`;
  const dataUrl = await QRCode.toDataURL(url || `/student/check?sid=${sid}`);
  return Response.json({ dataUrl });
}
