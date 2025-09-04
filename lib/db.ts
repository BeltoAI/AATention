import { sql } from "@vercel/postgres";
import crypto from "node:crypto";

export type ID = string;
export type Status = "present" | "late" | "excused" | "absent";

export function id(): ID {
  return crypto.randomUUID();
}

export async function ensureSchema() {
  await sql`
    create table if not exists teachers (
      id text primary key,
      name text not null,
      email text,
      created_at timestamp default now()
    );
    create table if not exists classes (
      id text primary key,
      teacher_id text references teachers(id) on delete cascade,
      name text not null,
      code text unique not null,
      created_at timestamp default now()
    );
    create index if not exists idx_classes_teacher on classes(teacher_id);

    create table if not exists students (
      id text primary key,
      class_id text references classes(id) on delete cascade,
      name text not null,
      email text,
      created_at timestamp default now()
    );
    create index if not exists idx_students_class on students(class_id);

    create table if not exists sessions (
      id text primary key,
      class_id text references classes(id) on delete cascade,
      on_date date not null,
      created_at timestamp default now(),
      unique(class_id, on_date)
    );
    create index if not exists idx_sessions_class on sessions(class_id);

    create table if not exists attendance (
      id text primary key,
      session_id text references sessions(id) on delete cascade,
      student_id text references students(id) on delete cascade,
      status text not null,
      note text,
      updated_at timestamp default now(),
      unique(session_id, student_id)
    );
    create index if not exists idx_attendance_session on attendance(session_id);
  `;
}

export async function upsertTeacherByEmail(name: string, email?: string) {
  const teacherId = id();
  if (email) {
    const existing = await sql`select * from teachers where email=${email} limit 1`;
    if (existing.rows.length) return existing.rows[0];
  }
  const res = await sql`insert into teachers (id, name, email) values (${teacherId}, ${name}, ${email || null}) returning *`;
  return res.rows[0];
}

export function code6() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}
