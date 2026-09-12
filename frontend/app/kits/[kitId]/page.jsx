"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../src/lib/api";

export default function KitDetailPage() {
  const params = useParams();
  const kitId = params.kitId;
  const router = useRouter();

  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [regeneratingSection, setRegeneratingSection] = useState("");
  const [regenerateError, setRegenerateError] = useState("");

  useEffect(() => {
    async function loadKit() {
      try {
        setLoading(true);

        const response = await apiRequest(`/api/kits/${params.kitId}`, {
          method: "GET",
        });

        const fetchedKit = response?.data?.kit || response?.kit;

        if (!fetchedKit) {
          throw new Error("Kit not found.");
        }

        setKit(fetchedKit);
      } catch (err) {
        setError(err.message || "Failed to load kit.");
      } finally {
        setLoading(false);
      }
    }

    if (params.kitId) {
      loadKit();
    }
  }, [params.kitId]);

  function updateQuestion(questionId, field, value) {
    setKit((previousKit) => ({
      ...previousKit,
      questions: previousKit.questions.map((question) =>
        question.id === questionId
          ? {
            ...question,
            [field]: value,
            source: "user",
            edited: true
          }
          : question
      )
    }));
  }

  function addQuestion() {
    const newQuestion = {
      id: `user-question-${Date.now()}`,
      requirement_ids: [],
      category: "technical",
      prompt: "Write your question here...",
      answer_outline: "Write your answer outline here...",
      difficulty: "medium",
      source: "user",
      edited: true,
      pinned: false
    };

    setKit((previousKit) => ({
      ...previousKit,
      questions: [...(previousKit.questions || []), newQuestion]
    }));

    setIsEditing(true);
  }
  function deleteQuestion(questionId) {
    setKit((previousKit) => ({
      ...previousKit,
      questions: previousKit.questions.filter(
        (question) => question.id !== questionId
      )
    }));
  }
  function moveQuestion(questionId, direction, category) {
    setKit((previousKit) => {
      const questions = [...(previousKit.questions || [])];

      // Get indexes of questions belonging to the current category
      const categoryQuestionIndexes = questions
        .map((question, index) => ({ question, index }))
        .filter(({ question }) => question.category === category)
        .map(({ index }) => index);

      // Find current question position inside its category
      const currentPosition = categoryQuestionIndexes.findIndex(
        (index) => questions[index].id === questionId
      );

      if (currentPosition === -1) {
        return previousKit;
      }

      const targetPosition = currentPosition + direction;

      // Prevent moving outside the category
      if (
        targetPosition < 0 ||
        targetPosition >= categoryQuestionIndexes.length
      ) {
        return previousKit;
      }

      const currentIndex = categoryQuestionIndexes[currentPosition];
      const targetIndex = categoryQuestionIndexes[targetPosition];

      // Swap questions
      [questions[currentIndex], questions[targetIndex]] = [
        questions[targetIndex],
        questions[currentIndex]
      ];

      return {
        ...previousKit,
        questions
      };
    });
  }
  async function saveChanges() {
    try {
      setSaving(true);
      setSaveMessage("");
      setError("");

      const response = await apiRequest(`/api/kits/${kitId}`, {
        method: "PUT",
        body: JSON.stringify({
          questions: kit.questions,
        }),
      });

      const updatedKit = response?.data?.kit || response?.kit;

      if (updatedKit) {
        setKit(updatedKit);
      }

      setIsEditing(false);
      setSaveMessage("Changes saved successfully.");

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-36 rounded bg-gray-200" />
          <div className="h-10 w-72 rounded bg-gray-200" />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-48 rounded-xl bg-white shadow-sm" />
            <div className="h-48 rounded-xl bg-white shadow-sm" />
          </div>

          <div className="h-64 rounded-xl bg-white shadow-sm" />
          <div className="h-80 rounded-xl bg-white shadow-sm" />
        </div>
      </div>
    </main>
  );
}

if (error || !kit) {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>

            <div>
              <h1 className="text-lg font-semibold text-red-800">
                Unable to load interview kit
              </h1>

              <p className="mt-2 text-sm text-red-700">
                {error || "This kit does not exist or is no longer available."}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Try Again
                </button>

                <Link
                  href="/dashboard"
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

  async function regenerateSection(section) {
    try {
      setRegeneratingSection(section);
      setRegenerateError("");

      const data = await apiRequest(`/api/kits/${kitId}/regenerate`, {
        method: "POST",
        body: JSON.stringify({ section }),
      });

      if (data.kit) {
        setKit(data.kit);
      }

      alert(`${section} regenerated successfully.`);
    } catch (error) {
      console.error("Regeneration error:", error);
      setRegenerateError(
        error.message || `Failed to regenerate ${section}.`
      );
    } finally {
      setRegeneratingSection("");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to dashboard
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Interview Preparation Kit
            </h1>

           <div className="flex flex-wrap gap-2">
  <button
    onClick={() => router.push(`/kits/${kitId}/practice`)}
    className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 sm:px-4"
  >
    Start Practice
  </button>

  <button
    onClick={() => router.push(`/kits/${kitId}/flashcards`)}
    className="rounded-lg bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 sm:px-4"
  >
    Study Flashcards
  </button>
</div>

            <p className="mt-2 text-gray-600">
              Role:{" "}
              <span className="font-medium text-gray-900">
                {kit.role?.title || "Not specified"}
              </span>
            </p>
          </div>

          <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-gray-500">Preparation days</p>

            <p className="text-xl font-bold text-gray-900">
              {kit.schedule?.days_available || 0} days
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Edit Kit
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {isEditing && (
                  <button
                    onClick={addQuestion}
                    className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
                  >
                    + Add Question
                  </button>
                )}
              </>
            )}
          </div>
        </div>



        {/* Source Information */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Source Information
          </h2>

          <div className="mt-4 space-y-3 text-gray-700">
            <p>
              <strong>Company:</strong>{" "}
              {kit.source?.company || "Not available"}
            </p>

            <p>
              <strong>Company URL:</strong>{" "}
              {kit.source?.company_url ? (
                <a
                  href={kit.source.company_url}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-blue-600 hover:underline"
                >
                  {kit.source.company_url}
                </a>
              ) : (
                "Not available"
              )}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {kit.source?.role || kit.role?.title || "Not available"}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {kit.source?.location || "Not specified"}
            </p>

            <p>
              <strong>JD characters analyzed:</strong>{" "}
              {kit.source?.jd_chars || 0}
            </p>

            <p>
              <strong>Research date:</strong>{" "}
              {kit.source?.researched_at
                ? new Date(kit.source.researched_at).toLocaleString()
                : "Not available"}
            </p>
          </div>
        </section>

        {/* Company Brief */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Company Brief
          </h2>

          <div className="mt-4 space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">
                Summary
              </h3>

              <p className="mt-1">
                {kit.company_brief?.summary || "Not available"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                What They Do
              </h3>

              <p className="mt-1">
                {kit.company_brief?.what_they_do || "Not available"}
              </p>
            </div>

            {kit.company_brief?.sources?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900">
                  Research Sources
                </h3>

                <ul className="mt-2 list-disc space-y-1 pl-6">
                  {kit.company_brief.sources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-blue-600 hover:underline"
                      >
                        {source}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>



        {/* Interview Questions */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Questions</h2>

            <button
              onClick={() => regenerateSection("questions")}
              disabled={regeneratingSection === "questions"}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {regeneratingSection === "questions"
                ? "Regenerating..."
                : "Regenerate Questions"}
            </button>
          </div>

          <div className="mt-5 space-y-8">
            {[
              "technical",
              "behavioural",
              "domain",
              "system-design",
              "company-fit"
            ].map((category) => {
              const categoryQuestions = (kit.questions || []).filter(
                (question) => question.category === category
              );

              if (categoryQuestions.length === 0) {
                return null;
              }

              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold capitalize text-blue-700">
                    {category.replaceAll("-", " ")}
                  </h3>

                  <div className="mt-4 space-y-4">
                    {categoryQuestions.map((question, index) => (
                      <div
                        key={question.id || index}
                        className="rounded-lg border border-gray-200 p-5"
                      >

                        {isEditing && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            <button
                              onClick={() => moveQuestion(question.id, -1, category)}
                              disabled={index === 0}
                              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              ↑ Move Up
                            </button>

                            <button
                              onClick={() => moveQuestion(question.id, 1, category)}
                              disabled={index === categoryQuestions.length - 1}
                              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              ↓ Move Down
                            </button>

                            <button
                              onClick={() => deleteQuestion(question.id)}
                              className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <div className="flex flex-col justify-between gap-2 md:flex-row">
                          {isEditing ? (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700">
                                Question
                              </label>

                              <textarea
                                value={question.prompt}
                                onChange={(event) =>
                                  updateQuestion(
                                    question.id,
                                    "prompt",
                                    event.target.value
                                  )
                                }
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                          ) : (
                            <p className="font-semibold text-gray-900">
                              {index + 1}. {question.prompt}
                            </p>
                          )}

                          <span className="h-fit rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                            Difficulty: {question.difficulty}/3
                          </span>
                        </div>

                        <div className="mt-4">
                          <p className="font-medium text-gray-800">
                            Answer Outline
                          </p>

                          {isEditing ? (
                            <textarea
                              value={question.answer_outline}
                              onChange={(event) =>
                                updateQuestion(
                                  question.id,
                                  "answer_outline",
                                  event.target.value
                                )
                              }
                              rows={5}
                              className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          ) : (
                            <p className="mt-1 whitespace-pre-wrap text-gray-600">
                              {question.answer_outline}
                            </p>
                          )}
                        </div>

                        {question.requirement_ids?.length > 0 && (
                          <p className="mt-3 text-xs text-gray-500">
                            Requirement IDs:{" "}
                            {question.requirement_ids.join(", ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        {/* Flashcards */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Practice Flashcards
          </h2>

          <button
            onClick={() => regenerateSection("flashcards")}
            disabled={regeneratingSection === "flashcards"}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {regeneratingSection === "flashcards"
              ? "Regenerating..."
              : "Regenerate Flashcards"}
          </button>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(kit.flashcards || []).map((flashcard, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="font-semibold text-gray-900">
                  Q: {flashcard.question || flashcard.front}
                </p>

                <p className="mt-3 text-gray-600">
                  A: {flashcard.answer || flashcard.back}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule */}
       {/* Preparation Schedule */}
<section className="rounded-xl bg-white p-6 shadow-sm">
  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Preparation Schedule
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        A day-by-day plan based on your available preparation time.
      </p>
    </div>

    <button
      type="button"
      onClick={() => regenerateSection("schedule")}
      disabled={regeneratingSection === "schedule"}
      className="w-fit rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {regeneratingSection === "schedule"
        ? "Regenerating..."
        : "Regenerate Schedule"}
    </button>
  </div>

  <div className="mt-5 rounded-lg bg-blue-50 p-4">
    <p className="text-sm text-blue-700">Total preparation time</p>
    <p className="mt-1 text-2xl font-bold text-blue-900">
      {kit.schedule?.days_available || 0} days
    </p>
  </div>

  {kit.schedule?.days?.length > 0 ? (
    <div className="relative mt-6 space-y-4">
      {kit.schedule.days.map((day, index) => (
        <div
          key={day.day || index}
          className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {day.day || index + 1}
                </span>

                <h3 className="text-lg font-semibold text-gray-900">
                  Day {day.day || index + 1}
                </h3>
              </div>

              <p className="mt-3 text-gray-700">
                <span className="font-semibold">Focus:</span>{" "}
                {day.focus || "General interview preparation"}
              </p>
            </div>

            <span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-600 shadow-sm">
              {day.minutes || 0} minutes
            </span>
          </div>

          {day.question_ids?.length > 0 ? (
            <div className="mt-5">
              <p className="font-medium text-gray-800">
                Questions to Practice
              </p>

              <ol className="mt-2 list-decimal space-y-2 pl-6 text-sm text-gray-700">
                {day.question_ids.map((questionId) => {
                  const question = (kit.questions || []).find(
                    (item) => item.id === questionId
                  );

                  return (
                    <li key={questionId}>
                      {question?.prompt || "Question not found"}
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              No specific questions assigned for this day.
            </p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-6 text-center">
      <p className="text-gray-500">
        No preparation schedule is available.
      </p>
    </div>
  )}
</section>

        {/* Coverage */}
       {/* Coverage Analysis */}
<section className="rounded-xl bg-white p-6 shadow-sm">
  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Coverage Analysis
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        How well the generated questions cover the job requirements.
      </p>
    </div>

    <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
      {kit.coverage?.coverage_percent ?? 0}% covered
    </span>
  </div>

  <div className="mt-5 grid gap-4 sm:grid-cols-3">
    <div className="rounded-lg bg-blue-50 p-4">
      <p className="text-sm text-blue-700">Total Requirements</p>
      <p className="mt-1 text-2xl font-bold text-blue-900">
        {kit.coverage?.total_requirements ?? 0}
      </p>
    </div>

    <div className="rounded-lg bg-green-50 p-4">
      <p className="text-sm text-green-700">Covered Requirements</p>
      <p className="mt-1 text-2xl font-bold text-green-900">
        {kit.coverage?.covered_requirements ?? 0}
      </p>
    </div>

    <div className="rounded-lg bg-orange-50 p-4">
      <p className="text-sm text-orange-700">Uncovered Requirements</p>
      <p className="mt-1 text-2xl font-bold text-orange-900">
        {kit.coverage?.uncovered_requirements?.length ?? 0}
      </p>
    </div>
  </div>

  {kit.coverage?.uncovered_requirements?.length > 0 && (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-900">
        Requirements Needing More Attention
      </h3>

      <ul className="mt-3 space-y-2">
        {kit.coverage.uncovered_requirements.map((requirement, index) => (
          <li
            key={index}
            className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800"
          >
            {typeof requirement === "string"
              ? requirement
              : requirement.text ||
                requirement.description ||
                requirement.title ||
                JSON.stringify(requirement)}
          </li>
        ))}
      </ul>
    </div>
  )}

  {(!kit.coverage ||
    Object.keys(kit.coverage).length === 0) && (
    <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-6 text-center">
      <p className="text-gray-500">
        Coverage analysis is not available for this kit.
      </p>
    </div>
  )}
</section>
      </div>
      {saveMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
          {saveMessage}
        </div>
      )}
    </main>
  );
}