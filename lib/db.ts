import { sql } from "@vercel/postgres";
let initialized = false;
export async function init() {
  if (initialized) return;
  initialized = true;
  await sql`CREATE TABLE IF NOT EXISTS classes (id TEXT PRIMARY KEY, name TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());`;
  await sql`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, class_id TEXT NOT NULL, start_at TIMESTAMPTZ NOT NULL, end_at TIMESTAMPTZ, secret TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());`;
  await sql`CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, name TEXT NOT NULL, student_code TEXT, created_at TIMESTAMPTZ DEFAULT now());`;
  await sql`CREATE TABLE IF NOT EXISTS attendance (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, student_id TEXT NOT NULL, checkin_at TIMESTAMPTZ NOT NULL, checkout_at TIMESTAMPTZ, geo_lat DOUBLE PRECISION, geo_lon DOUBLE PRECISION, user_agent TEXT, created_at TIMESTAMPTZ DEFAULT now());`;
}
export async function q(strings: TemplateStringsArray, ...values: any[]) {
  await init();
  // @ts-ignore
  return sql(strings, ...values);
}
