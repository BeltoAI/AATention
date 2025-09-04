export default function Page() {
  return (
    <main className="space-y-6">
      <p className="text-lg">
        Fast, verifiable attendance with rotating PIN + QR, live roster, CSV export, and an AI center to summarize participation.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        <a className="card" href="/teacher">
          <div className="h2 mb-2">Teacher</div>
          <p>Create a class, start a session, display the PIN/QR, export CSV.</p>
        </a>
        <a className="card" href="/student/check">
          <div className="h2 mb-2">Student</div>
          <p>Enter the PIN from the projector to check in. Check out when you leave.</p>
        </a>
        <a className="card" href="/ai">
          <div className="h2 mb-2">AI Center</div>
          <p>Summaries, at-risk flags, and polite nudge drafts powered by your LLM.</p>
        </a>
      </div>
    </main>
  );
}
