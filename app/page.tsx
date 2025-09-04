"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [className, setClassName] = useState("");
  const r = useRouter();

  async function create() {
    const res = await fetch("/api/create-class", {
      method:"POST",
      body: JSON.stringify({ teacherName, teacherEmail, className })
    });
    const j = await res.json();
    if (j?.cls?.id) r.push(`/class/${j.cls.id}`);
  }

  return (
    <main className="grid md:grid-cols-2 gap-6">
      <section className="card space-y-5">
        <h2 className="text-2xl font-semibold">Attendance in under 30 seconds</h2>
        <p className="text-white/70">No logins. No yak shaving. Create a class, add students, mark statuses. Export CSV. Done.</p>

        <div className="grid gap-3">
          <input className="input" placeholder="Your name" value={teacherName} onChange={e=>setTeacherName(e.target.value)} />
          <input className="input" placeholder="Your email (optional)" value={teacherEmail} onChange={e=>setTeacherEmail(e.target.value)} />
          <input className="input" placeholder="Class name (e.g., Algebra 2, Period 3)" value={className} onChange={e=>setClassName(e.target.value)} />
          <button onClick={create} className="btn btn-primary">
            Create class <ArrowRight className="w-4 h-4 ml-2 inline" />
          </button>
        </div>
        <p className="text-xs text-white/60">Tip: You can add students as you go. Everything saves to the selected date.</p>
      </section>

      <section className="card space-y-4">
        <div className="text-sm text-white/70">
          What’s inside:
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>One-click sessions by date</li>
            <li>Present/Late/Excused/Absent toggles</li>
            <li>Mark-all, Save, CSV export</li>
            <li>Optional AI note summarizer</li>
          </ul>
        </div>
        <div className="text-xs text-white/50">Backed by Vercel Postgres. No cookies, no tracking.</div>
      </section>
    </main>
  );
}
