"use client";
import { useEffect, useState } from "react";

export default function AIPage() {
  const [sessions, setSessions] = useState<{id:string,class_id:string,start_at:string,end_at:string|null}[]>([]);
  const [sid, setSid] = useState("");
  const [out, setOut] = useState("");

  useEffect(()=>{ (async()=>{
    const r = await fetch("/api/session/list"); const j = await r.json();
    setSessions(j.sessions || []);
  })(); },[]);

  async function summarize() {
    if (!sid) { alert("Pick a session."); return; }
    setOut("Thinking…");
    const r = await fetch("/api/ai/summarize?sid=" + encodeURIComponent(sid));
    const t = await r.text(); setOut(t);
  }

  return (
    <main className="card space-y-4">
      <div className="h2">AI Center</div>
      <p className="text-sm text-gray-500">Summarize attendance and draft polite nudge messages using your LLM endpoint.</p>
      <select className="input" value={sid} onChange={e=>setSid(e.target.value)}>
        <option value="">Select a session…</option>
        {sessions.map(s=>(
          <option key={s.id} value={s.id}>{s.class_id} — {new Date(s.start_at).toLocaleString()}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={summarize}>Generate summary + nudges</button>
        {sid && <a className="btn" href={`/api/export?sid=${sid}`}>Export CSV</a>}
      </div>
      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-xl border">{out || "No output yet."}</pre>
    </main>
  );
}
