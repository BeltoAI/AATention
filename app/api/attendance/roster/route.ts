import { q } from "@/lib/db";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get("sid");
  if (!sid) return Response.json({ error: "sid required" }, { status: 400 });
  const { rows } = await q`SELECT s.name, a.checkin_at, a.checkout_at
    FROM attendance a LEFT JOIN students s ON s.id=a.student_id WHERE a.session_id=${sid}
    ORDER BY a.checkin_at ASC`;
  const roster = rows.map(r => {
    const start = new Date(r.checkin_at).getTime();
    const end = r.checkout_at ? new Date(r.checkout_at).getTime() : Date.now();
    const minutes = Math.max(0, Math.round((end - start)/60000));
    return { name: r.name, checkin_at: r.checkin_at, checkout_at: r.checkout_at, minutes };
  });
  return Response.json({ roster });
}
