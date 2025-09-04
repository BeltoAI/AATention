import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title: "AATention", description: "World's simplest AI-assisted attendance" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container py-8">
          <header className="mb-8 flex items-center justify-between">
            <a href="/" className="h1">AATention</a>
            <nav className="flex gap-3">
              <a className="btn" href="/teacher">Teacher</a>
              <a className="btn" href="/student/check">Student</a>
              <a className="btn" href="/ai">AI Center</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
