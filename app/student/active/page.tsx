"use client";
import { useEffect, useState } from "react";
export default function Active() {
  const [aid,setAid]=useState(""), [name,setName]=useState(""), [since,setSince]=useState<string>("");
  useEffect(()=>{ const u=new URL(window.location.href); const id=u.searchParams.get("id")||""; setAid(id);
    (async()=>{ if(!id) return; const j=await fetch("/api/attendance/info?id="+encodeURIComponent(id)).then(r=>r.json());
      setName(j.name||""); setSince(j.checkin_at?new Date(j.checkin_at).toLocaleTimeString():""); })(); },[]);
  async function checkout(){ const r=await fetch("/api/attendance/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({attendance_id:aid})});
    if(r.ok){ alert("Checked out. Thank you!"); window.location.href="/student/check"; } else { const j=await r.json(); alert(j.error||"Checkout failed."); } }
  return (<main className="max-w-md mx-auto card space-y-4 text-center">
    <div className="h2">You're checked in</div>
    <p>{name ? name + "," : ""} since {since || "…"}</p>
    <button className="btn btn-primary" onClick={checkout}>Check out</button>
  </main>);
}
