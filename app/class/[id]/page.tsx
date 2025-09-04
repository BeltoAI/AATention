import { ensureSchema } from "@/lib/db";
import { sql } from "@vercel/postgres";
import AttendanceClient from "@/components/AttendanceClient";

export const runtime = "nodejs";

export default async function ClassPage({ params }: { params: { id: string }}) {
  await ensureSchema();
  const cls = await sql`select c.*, t.name as teacher_name from classes c join teachers t on t.id=c.teacher_id where c.id=${params.id} limit 1`;
  if (!cls.rows.length) return <div className="card">Class not found.</div>;
  const students = await sql`select * from students where class_id=${params.id} order by name asc`;

  return (
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold">{cls.rows[0].name}</h2>
        <div className="text-white/70 text-sm">Teacher: {cls.rows[0].teacher_name} — Code: {cls.rows[0].code}</div>
      </div>
      <AttendanceClient classId={params.id} initialStudents={students.rows} />
    </main>
  );
}
