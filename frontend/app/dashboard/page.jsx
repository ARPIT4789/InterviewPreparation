"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCurrentUser,
  logoutUser,
} from "../../src/lib/auth";
import { apiRequest } from "../../src/lib/api";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userResponse = await getCurrentUser();

        setUser(
          userResponse?.data?.user ||
          userResponse?.user ||
          null
        );

        const kitsResponse = await apiRequest("/api/kits");

        setKits(
          kitsResponse?.data?.kits ||
          kitsResponse?.kits ||
          []
        );
      } catch (error) {
        setError(error.message || "Unable to load dashboard.");

        if (
          error.message?.toLowerCase().includes("unauthorized") ||
          error.message?.toLowerCase().includes("authentication") ||
          error.message?.toLowerCase().includes("login")
        ) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    try {
      await logoutUser();
      router.push("/login");
      router.refresh();
    } catch (error) {
      setError(error.message || "Logout failed.");
    }
  }

  async function handleDeleteKit(kitId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview kit?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/api/kits/${kitId}`, {
        method: "DELETE",
      });

      setKits((previousKits) =>
        previousKits.filter((kit) => kit._id !== kitId)
      );
    } catch (error) {
      setError(error.message || "Failed to delete kit.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-white"
          >
            Trao Prep Kit
          </Link>

          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="hidden text-sm text-slate-400 sm:block">
                {user.email}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-400">
              Your workspace
            </p>

            <h1 className="text-3xl font-bold">
              Interview preparation kits
            </h1>

            <p className="mt-2 text-slate-400">
              Create and manage personalised preparation kits for your interviews.
            </p>
          </div>

          <Link
            href="/kits/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            + Create new kit
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {kits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">
              No preparation kits yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-400">
              Create your first kit by adding a job description, company website,
              and the number of days before your interview.
            </p>

            <Link
              href="/kits/new"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Create your first kit
            </Link>
          </div>
        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kits.map((kit) => {
              const roleTitle =
                typeof kit.role === "object"
                  ? kit.role?.title
                  : kit.role;

              const companyName =
                typeof kit.source?.company === "string"
                  ? kit.source.company
                  : kit.company_brief?.company_name ||
                  kit.company_brief?.name ||
                  "Unknown company";

              const questionCount = kit.questions?.length || 0;
              const flashcardCount = kit.flashcards?.length || 0;

              const daysAvailable =
                kit.schedule?.days_available ||
                kit.daysAvailable ||
                kit.source?.days ||
                "—";

              return (
                <div
                  key={kit._id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                      Interview Kit
                    </div>

                    <span className="text-xs text-slate-500">
                      {kit.createdAt
                        ? new Date(kit.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <h2 className="line-clamp-2 text-xl font-semibold text-white group-hover:text-blue-400">
                    {roleTitle || "Untitled role"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {companyName}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-800/70 p-3">
                      <p className="text-xs text-slate-500">Questions</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {questionCount}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-800/70 p-3">
                      <p className="text-xs text-slate-500">Flashcards</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {flashcardCount}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-lg bg-slate-800/70 p-3">
                      <p className="text-xs text-slate-500">Days available</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {daysAvailable}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href={`/kits/${kit._id}`}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                      Open Kit
                    </Link>

                    <button
                      onClick={() => handleDeleteKit(kit._id)}
                      className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}