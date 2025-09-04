import crypto from "crypto";
export function currentPin(sessionId: string, secret: string, forTime = Date.now(), periodSec = 60) {
  const step = Math.floor(forTime / 1000 / periodSec);
  const h = crypto.createHash("sha256").update(`${secret}:${sessionId}:${step}`).digest("hex");
  const num = parseInt(h.slice(0, 8), 16);
  return (num % 1_000_000).toString().padStart(6, "0");
}
export function verifyPin(sessionId: string, secret: string, pin: string) {
  const now = Date.now();
  const pins = [0, -60].map(delta => currentPin(sessionId, secret, now + delta * 1000));
  return pins.includes(pin);
}
export function csvEscape(s: any) {
  const str = s == null ? "" : String(s);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}
