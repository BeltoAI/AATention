"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // not installed; we won't use this.

type Class = { id: string; name: string };
type Session = { id: string; class_id: string; start_at: string; end_at: string | null };

export default function TeacherPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [name, setName] = useState("");

  async function reload() {
    const res = await fetch("/api/class/list"); const cls = await res.json();
    setClasses(cls.classes || []);
    const r2 = await fetch("/api/session/list"); const ss = await r2.json();
    setSessions(ss.sessions || []);
  }

  useEffect(() => { reload(); }, []);

  async function createClass() {
    if (!name.trim()) return;
    await fetch("/api/class/create", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name }) });
    setName(""); reload();
  }
  async function startSession(class_id: string) {
    await fetch("/api/session/create", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ class_id }) });
    reload();
  }
  async function endSession(id: string) {
    await fetch("/api/session/end", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id }) });
    reload();
  }

  return (
    <main className="space-y-8">
      <div className="card space-y-3">
        <div className="h2">Create class</div>
        <div className="flex gap-2">
          <input className="input" placeholder="e.g., BUS 101 Section A" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn btn-primary" onClick={createClass}>Create</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="h2 mb-2">Your classes</div>
          <ul className="space-y-2">
            {classes.map(c => (
              <li key={c.id} className="flex items-center justify-between">
                <span>{c.name}</span>
                <button className="btn" onClick={()=>startSession(c.id)}>Start session</button>
              </li>
            ))}
          </ul>
          {!classes.length && <p className="text-sm text-gray-500">No classes yet.</p>}
        </div>

        <div className="card">
          <div className="h2 mb-2">Active sessions</div>
          <table className="table">
            <thead><tr><th>Class</th><th>Start</th><th>Actions</th></tr></thead>
            <tbody>
              {sessions.filter(s=>!s.end_at).map(s=>(
                <tr key={s.id}>
                  <td>{s.class_id}</td>
                  <td>{new Date(s.start_at).toLocaleString()}</td>
                  <td className="space-x-2">
                    <a className="btn" href={`/session/${s.id}`}>Open</a>
                    <button className="btn" onClick={()=>endSession(s.id)}>End</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!sessions.filter(s=>!s.end_at).length && <p className="text-sm text-gray-500">No active sessions.</p>}
        </div>
      </div>
    </main>
  );
}
