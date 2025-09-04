"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Calendar as CalIcon, Download, Wand2 } from "lucide-react";
type Student = { id: string; name: string; email: string | null };
type AttRow = { studentId: string; status: "present"|"late"|"excused"|"absent"; note?: string };
export default function AttendanceClient({ classId, initialStudents }: { classId: string; initialStudents: Student[] }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [sessionId, setSessionId] = useState<string>("");
  const [rows, setRows] = useState<Record<string, AttRow>>({});
  async function ensureSession(d: string) {
    const r = await fetch("/api/session", { method:"POST", body: JSON.stringify({ classId, onDate: d }) });
    const j = await r.json();
    setSessionId(j.session.id);
    const g = await fetch(`/api/attendance?sessionId=${j.session.id}`);
    const k = await g.json();
    const map: Record<string, AttRow> = {};
    for (const t of k.rows) map[t.student_id] = { studentId: t.student_id, status: (t.status||"absent") };
    setRows(map);
  }
  useEffect(() => { ensureSession(date); }, [date]);
  async function addStudent(name: string, email: string) {
    const r = await fetch("/api/student", { method:"POST", body: JSON.stringify({ classId, name, email }) });
    const j = await r.json();
    setStudents(s => [...s, j.student].sort((a,b)=>a.name.localeCompare(b.name)));
  }
  function setStatus(studentId: string, status: AttRow["status"]) { setRows(r => ({ ...r, [studentId]: { studentId, status }})); }
  function markAll(status: AttRow["status"]) {
    const m: Record<string, AttRow> = {};
    for (const s of students) m[s.id] = { studentId: s.id, status };
    setRows(m);
  }
  async function save() { const payload = Object.values(rows); await fetch("/api/attendance", { method:"POST", body: JSON.stringify({ sessionId, rows: payload }) }); }
  const stats = useMemo(() => {
    const total = students.length;
    const counts = { present:0, late:0, excused:0, absent:0 } as any;
    for (const s of students) { const st = rows[s.id]?.status || "absent"; counts[st] = (counts[st] || 0) + 1; }
    return { total, present:counts.present||0, late:counts.late||0, excused:counts.excused||0, absent:counts.absent||0 };
  }, [students, rows]);
  async function aiNote() {
    const prompt = `Write a 2-sentence attendance summary for ${date}.
Counts: present=${stats.present}, late=${stats.late}, excused=${stats.excused}, absent=${stats.absent}. Return plain text.`;
    const r = await fetch("/api/ai", { method:"POST", body: JSON.stringify({ prompt }) });
    const j = await r.json();
    alert(j.text?.trim() || "No response");
  }
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="flex items-center gap-3">
            <CalIcon className="w-5 h-5 text-white/70" />
            <input type="date" className="select" value={date} onChange={e=>setDate(e.target.value)} />
            <div className="ml-3 text-white/70 text-sm">Session autosaves to this date</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>markAll("present")} className="btn btn-ghost">Mark all present</button>
            <button onClick={()=>markAll("absent")} className="btn btn-ghost">Mark all absent</button>
            <a className="btn btn-ghost" href={`/api/export?classId=${classId}&onDate=${date}`}><Download className="w-4 h-4 mr-1 inline" /> Export CSV</a>
            <button onClick={aiNote} className="btn btn-primary"><Wand2 className="w-4 h-4 mr-1 inline" /> AI note</button>
            <button onClick={save} className="btn btn-primary"><Save className="w-4 h-4 mr-1 inline" /> Save</button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Roster</h3>
          <AddStudent onAdd={addStudent} />
        </div>
        <table className="table">
          <thead>
            <tr><th>Name</th><th className="hidden md:table-cell">Email</th><th>Status</th></tr>
          </thead>
          <tbody>
            {students.map(s => {
              const status = rows[s.id]?.status || "absent";
              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td className="hidden md:table-cell text-white/70">{s.email || ""}</td>
                  <td>
                    <div className="flex gap-2">
                      {["present","late","excused","absent"].map(opt => (
                        <button key={opt} onClick={()=>setStatus(s.id, opt as any)} className={`btn ${status===opt? "btn-primary":"btn-ghost"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <span className="badge badge-ok">Present: {stats.present}</span>
          <span className="badge badge-warn">Late: {stats.late}</span>
          <span className="badge">Excused: {stats.excused}</span>
          <span className="badge badge-err">Absent: {stats.absent}</span>
          <span className="ml-auto text-white/60">Total: {stats.total}</span>
        </div>
      </div>
    </div>
  );
}
function AddStudent({ onAdd }: { onAdd: (name:string, email:string)=>void }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  return (
    <div className="flex gap-2">
      <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="input" placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} />
      <button className="btn btn-primary" onClick={()=>{ if (name.trim().length){ onAdd(name.trim(), email.trim()); setName(""); setEmail(""); } }}>
        <Plus className="w-4 h-4 mr-1 inline" /> Add
      </button>
    </div>
  );
}
