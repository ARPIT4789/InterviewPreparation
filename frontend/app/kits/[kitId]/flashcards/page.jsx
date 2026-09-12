"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "../../../../src/lib/api";

export default function FlashcardsPage() {
  const { kitId } = useParams();
  const router = useRouter();

  const [kit, setKit] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchKit() {
      try {
        setLoading(true);

        const data = await apiRequest(`/api/kits/${kitId}`);

        setKit(data.kit);
        setFlashcards(data.kit?.flashcards || []);

        console.log("Flashcards from API:", data.kit?.flashcards);
        console.log("First flashcard:", data.kit?.flashcards?.[0]);
      } catch (error) {
        console.error("Failed to load flashcards:", error);
        setError(error.message || "Failed to load flashcards.");
      } finally {
        setLoading(false);
      }
    }

    if (kitId) {
      fetchKit();
    }
  }, [kitId]);

  function goToNextCard() {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((previousIndex) => previousIndex + 1);
      setShowAnswer(false);
    }
  }

  function goToPreviousCard() {
    if (currentIndex > 0) {
      setCurrentIndex((previousIndex) => previousIndex - 1);
      setShowAnswer(false);
    }
  }

  function restartStudy() {
    setCurrentIndex(0);
    setShowAnswer(false);
  }

  function displayValue(value, fallback = "") {
    if (value === null || value === undefined) {
      return fallback;
    }

    if (typeof value === "object") {
      return (
        value.text ||
        value.content ||
        value.title ||
        value.description ||
        JSON.stringify(value, null, 2)
      );
    }

    return String(value);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-gray-600">Loading flashcards...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  if (!flashcards.length) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-xl border bg-white p-6">
          <h1 className="text-2xl font-bold">Flashcard Study</h1>
          <p className="mt-3 text-gray-600">
            No flashcards are available for this kit.
          </p>

          <button
            onClick={() => router.push(`/kits/${kitId}`)}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back to Kit
          </button>
        </div>
      </main>
    );
  }

  const currentCard = flashcards[currentIndex];

  const frontValue =
    currentCard.term ||
    currentCard.concept ||
    currentCard.question ||
    currentCard.front ||
    currentCard.prompt ||
    currentCard.title ||
    "Flashcard";

  const backValue =
    currentCard.definition ||
    currentCard.answer ||
    currentCard.explanation ||
    currentCard.back ||
    currentCard.content ||
    currentCard.details ||
    "No answer available.";

  const frontText = displayValue(frontValue, "Flashcard");
  const backText = displayValue(backValue, "No answer available.");

  const isLastCard = currentIndex === flashcards.length - 1;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-purple-600">
              Flashcard Study
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              {typeof kit?.role === "object"
                ? kit.role.title || "Interview Flashcards"
                : kit?.role || "Interview Flashcards"}
            </h1>
          </div>

          <button
            onClick={() => router.push(`/kits/${kitId}`)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Back to Kit
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
            Flashcard {currentIndex + 1}
          </span>

          <span className="text-sm font-medium text-gray-600">
            {currentIndex + 1} of {flashcards.length}
          </span>
        </div>

        <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-purple-600 transition-all"
            style={{
              width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
            }}
          />
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Concept
          </p>

          <h2 className="whitespace-pre-line text-center text-2xl font-bold leading-relaxed text-gray-900">
            {frontText}
          </h2>

          <div className="mt-10">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="mx-auto block rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
              >
                Show Answer
              </button>
            ) : (
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
                <p className="mb-2 font-semibold text-purple-800">
                  Explanation / Answer
                </p>

                <p className="whitespace-pre-line leading-relaxed text-gray-800">
                  {backText}
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button
            onClick={goToPreviousCard}
            disabled={currentIndex === 0}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            onClick={restartStudy}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Restart
          </button>

          <button
            onClick={goToNextCard}
            disabled={isLastCard}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Flashcard
          </button>
        </div>

        {isLastCard && showAnswer && (
          <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-5 text-center">
            <h3 className="font-semibold text-purple-900">
              Flashcard session completed
            </h3>

            <p className="mt-1 text-sm text-purple-700">
              You have reviewed all flashcards in this kit.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}