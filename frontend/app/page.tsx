import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm uppercase tracking-wide text-slate-500">HSK Study Companion</p>
      <h1 className="mt-3 text-4xl font-semibold text-ink">Teacher-style Chinese self-study workspace</h1>
      <p className="mt-4 max-w-2xl text-slate-700">
        Study HSK 6 Lesson 1 with guided passage reading, grammar logic, near-synonym reasoning, exercise feedback,
        writing support, and a mock AI tutor in one focused interface.
      </p>
      <div className="mt-8">
        <Link href="/dashboard" className="rounded bg-accent px-5 py-3 text-white hover:bg-slate-700">
          Start Studying
        </Link>
      </div>
    </main>
  );
}
