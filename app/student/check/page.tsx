"use client";
import { useEffect, useState } from "react";
export default function StudentCheck() {
  const [pin,setPin]=useState(""); const [name,setName]=useState(""); const [sid,setSid]=useState("");
  const [geoOk,setGeoOk]=useState(false); const [coords,setCoords]=useState<{lat?:number;lon?:number}>({});
  useEffect(()=>{ const u=new URL(window.location.href); const s=u.searchParams.get("sid")||""; if(s) setSid(s); },[]);
  function askGeo(){ navigator.geolocation.getCurrentPosition(
    p=>{setCoords({lat:p.coords.latitude,lon:p.coords.longitude}); setGeoOk(true);},
    ()=>{setGeoOk(false); alert("Geolocation denied (optional).");}); }
  async function submit(){
    if(!pin||!name){ alert("Enter name and PIN."); return; }
    const r=await fetch("/api/attendance/checkin",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ name, pin, sid, geo:coords })});
    const j=await r.json(); if(!r.ok){ alert(j.error||"Check-in failed."); return; }
    window.location.href="/student/active?id="+encodeURIComponent(j.attendance_id);
  }
  return (<main className="max-w-md mx-auto card space-y-4">
    <div className="h2">Check in</div>
    <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>
    <input className="input" placeholder="Session ID (optional)" value={sid} onChange={e=>setSid(e.target.value)}/>
    <input className="input tracking-widest" placeholder="6-digit PIN" value={pin} onChange={e=>setPin(e.target.value)}/>
    <div className="flex gap-2">
      <button className="btn" onClick={askGeo}>{geoOk?"Location attached ✓":"Attach location (optional)"}</button>
      <button className="btn btn-primary" onClick={submit}>Check in</button>
    </div>
    <p className="text-sm text-gray-500">Tip: Scan the QR to prefill the session.</p>
  </main>);
}
