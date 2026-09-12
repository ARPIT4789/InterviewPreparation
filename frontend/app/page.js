import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Trao<span className="text-blue-400">.</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-2 lg:pt-28">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            AI-powered interview preparation
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Prepare smarter.
            <span className="block text-blue-400">
              Interview with confidence.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Generate personalized interview preparation kits using your job
            description, target company, and preparation timeline.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold transition hover:bg-blue-500"
            >
              Create Your Kit
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
            <span>✓ Personalized questions</span>
            <span>✓ Flashcards</span>
            <span>✓ Daily schedule</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Sample preparation kit</p>
              <h2 className="mt-1 text-xl font-semibold">
                Software Engineer Interview
              </h2>
            </div>

            <div className="rounded-lg bg-green-500/10 px-3 py-1 text-sm text-green-400">
              7 days
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Technical Questions</span>
                <span className="text-sm text-blue-400">24 questions</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-2 w-4/5 rounded-full bg-blue-500" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Flashcards</span>
                <span className="text-sm text-purple-400">18 cards</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-2 w-3/5 rounded-full bg-purple-500" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Preparation Coverage</span>
                <span className="text-sm text-green-400">82%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-2 w-4/5 rounded-full bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          <div>
            <div className="mb-4 text-3xl">🧠</div>
            <h3 className="text-lg font-semibold">Personalized Preparation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Get questions and learning material based on your target role and
              job description.
            </p>
          </div>

          <div>
            <div className="mb-4 text-3xl">📚</div>
            <h3 className="text-lg font-semibold">Smart Study Material</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Practice with generated questions, flashcards, company research,
              and structured topics.
            </p>
          </div>

          <div>
            <div className="mb-4 text-3xl">📅</div>
            <h3 className="text-lg font-semibold">Daily Study Schedule</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Follow a focused preparation plan based on the number of days you
              have before your interview.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Trao Interview Prep. Built for focused
        interview preparation.
      </footer>
    </main>
  );
}