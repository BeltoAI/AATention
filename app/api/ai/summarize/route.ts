import { q } from "@/lib/db";
async function callLLM(prompt: string) {
  const url = process.env.LLM_URL || "http://minibelto.duckdns.org:8007/v1/completions";
  const body = { model: "local", prompt, max_tokens: 600, temperature: 0.2 };
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error("LLM error " + r.status);
  const j = await r.json();
  return (j.choices && j.choices[0] && (j.choices[0].text || j.choices[0].message?.content)) || "";
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get("sid");
  if (!sid) return new Response("sid required", { status: 400 });
  const sess = await q`SELECT s.id, s.class_id, s.start_at FROM sessions s WHERE s.id=${sid}`;
  if (!sess.rows[0]) return new Response("not found", { status: 404 });
  const rs = await q`SELECT st.name, a.checkin_at, a.checkout_at
    FROM attendance a LEFT JOIN students st ON st.id=a.student_id WHERE a.session_id=${sid}
    ORDER BY a.checkin_at ASC`;
  const lines = rs.rows.map((r: any) => {
    const start = new Date(r.checkin_at).toISOString();
    const end = r.checkout_at ? new Date(r.checkout_at).toISOString() : "";
    return \`- \${r.name}: in=\${start} out=\${end}\`;
  }).join("\n");
  const prompt = \`You are an assistant for a teacher. Given attendance logs, produce:
1) One-paragraph summary (punctuality, average stay, anomalies).
2) A short bulleted list of 3 at-risk students (late or left early), with brief reasons.
3) Three short, kind nudge message templates the teacher can send.

Session: \${JSON.stringify(sess.rows[0])}
Attendance:
\${lines}
Use clear, concise language.\`;
  try { const text = await callLLM(prompt); return new Response(text || "(no output)"); }
  catch (e:any) { return new Response("AI failed: " + e.message, { status: 500 }); }
}
