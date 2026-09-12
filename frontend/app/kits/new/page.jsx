"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../src/lib/api";

export default function NewKitPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    jd: "",
    company_url: "",
    days: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "days" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (form.jd.trim().length < 20) {
      setError("Please enter a more detailed job description.");
      return;
    }

    if (!form.company_url.trim()) {
      setError("Please enter the company website URL.");
      return;
    }

    if (form.days < 1) {
      setError("Days available must be at least 1.");
      return;
    }

    setLoading(true);

    try {
  const response = await apiRequest("/api/kits/generate", {
    method: "POST",
    body: JSON.stringify({
      jd: form.jd,
      company_url: form.company_url,
      days: form.days,
    }),
  });

  const kit = response?.data?.kit || response?.kit;

  if (!kit?._id) {
    throw new Error("Kit was generated but no kit ID was returned.");
  }

  router.push(`/kits/${kit._id}`);
} catch (error) {
  setError(error.message || "Unable to generate the kit.");
} finally {
  setLoading(false);
}
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-white"
          >
            Trao Prep Kit
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            Create preparation kit
          </p>

          <h1 className="text-3xl font-bold">
            Prepare for your next interview
          </h1>

          <p className="mt-2 text-slate-400">
            Add the job description, company website, and available
            preparation time. We will research and generate your kit.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
        >
          <div>
            <label
              htmlFor="jd"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Job description
            </label>

            <textarea
              id="jd"
              name="jd"
              value={form.jd}
              onChange={handleChange}
              placeholder="Paste the complete job description here..."
              rows={14}
              required
              className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Include responsibilities, required skills, qualifications,
              and preferred skills if available.
            </p>
          </div>

          <div>
            <label
              htmlFor="company_url"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Company website
            </label>

            <input
              id="company_url"
              name="company_url"
              type="url"
              value={form.company_url}
              onChange={handleChange}
              placeholder="https://example.com"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Use the company’s official website. The backend will crawl
              relevant pages and search for hiring information.
            </p>
          </div>

          <div>
            <label
              htmlFor="days"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Days available before interview
            </label>

            <input
              id="days"
              name="days"
              type="number"
              min="1"
              max="60"
              value={form.days}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              The generated schedule will contain exactly this many days.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-700 px-5 py-3 text-center text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Researching and generating..."
                : "Generate interview kit"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-6 rounded-xl border border-blue-900/60 bg-blue-950/30 p-5">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />

              <p className="font-medium text-blue-200">
                Your kit is being generated
              </p>
            </div>

            <p className="mt-2 text-sm text-blue-300/80">
              The system is extracting requirements, researching the company,
              generating questions, checking coverage, and creating your
              study schedule. Please keep this page open.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}