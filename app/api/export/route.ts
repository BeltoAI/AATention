import { q } from "@/lib/db"; import { csvEscape } from "@/lib/utils";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get("sid");
  if (!sid) return new Response("sid required", { status: 400 });
  const s = await q`SELECT s.id FROM sessions s WHERE s.id=${sid}`; if (!s.rows[0]) return new Response("not found", { status: 404 });
  const rs = await q`SELECT st.name, a.checkin_at, a.checkout_at, a.geo_lat, a.geo_lon
    FROM attendance a LEFT JOIN students st ON st.id=a.student_id WHERE a.session_id=${sid}
    ORDER BY a.checkin_at ASC`;
  let out = "name,checkin_at,checkout_at,minutes,geo_lat,geo_lon\n";
  for (const r of rs.rows) {
    const start = new Date(r.checkin_at).getTime();
    const end = r.checkout_at ? new Date(r.checkout_at).getTime() : Date.now();
    const minutes = Math.max(0, Math.round((end - start)/60000));
    out += [r.name, r.checkin_at, r.checkout_at || "", minutes, r.geo_lat ?? "", r.geo_lon ?? ""].map(csvEscape).join(",") + "\n";
  }
  return new Response(out, { headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="attendance_${sid}.csv"` }});
}
