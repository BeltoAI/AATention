"use client";
import { useEffect, useState } from "react";
export default function SessionPage({ params }: { params: { id: string } }) {
  const sid = params.id;
  const [pin, setPin] = useState<string>(""); const [qr, setQr] = useState<string>("");
  const [roster, setRoster] = useState<any[]>([]); const [clsName, setClsName] = useState<string>("");
  async function refresh() {
    const p = await fetch(`/api/session/pin?sid=${sid}`).then(r=>r.json()); setPin(p.pin || "");
    const q = await fetch(`/api/session/qr?sid=${sid}`).then(r=>r.json()); setQr(q.dataUrl || "");
    const ro = await fetch(`/api/attendance/roster?sid=${sid}`).then(r=>r.json()); setRoster(ro.roster || []);
    const ci = await fetch(`/api/session/info?sid=${sid}`).then(r=>r.json()); setClsName(ci.class_name || sid);
  }
  useEffect(()=>{ refresh(); const t=setInterval(refresh,5000); return ()=>clearInterval(t);},[]);
  return (
    <main className="space-y-6">
      <div className="card grid md:grid-cols-3 gap-4 items-center">
        <div>
          <div className="label">Class</div><div className="h2">{clsName}</div>
          <div className="label mt-4">Rotating PIN (60s)</div>
          <div className="text-5xl font-bold tracking-widest">{pin}</div>
          <p className="text-sm text-gray-500">Students go to /student/check and enter this PIN.</p>
        </div>
        <div className="md:col-span-2 flex items-center justify-center">
          {qr ? <img src={qr} alt="QR" className="w-64 h-64" /> : <div>Generating QR…</div>}
        </div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="h2">Live roster</div>
          <a className="btn" href={`/api/export?sid=${sid}`}>Export CSV</a>
        </div>
        <table className="table mt-4">
          <thead><tr><th>Name</th><th>Checked in</th><th>Checked out</th><th>Minutes</th></tr></thead>
          <tbody>{roster.map((r,i)=>(
            <tr key={i}><td>{r.name}</td>
              <td>{new Date(r.checkin_at).toLocaleTimeString()}</td>
              <td>{r.checkout_at ? new Date(r.checkout_at).toLocaleTimeString() : "-"}</td>
              <td>{r.minutes}</td></tr>))}</tbody>
        </table>
        {!roster.length && <p className="text-sm text-gray-500">No check-ins yet.</p>}
      </div>
    </main>
  );
}
