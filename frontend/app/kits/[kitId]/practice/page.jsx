"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "../../../../src/lib/api";

export default function PracticePage() {
    const { kitId } = useParams();
    const router = useRouter();

    const [kit, setKit] = useState(null);
    const [questions, setQuestions] = useState([]);
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
                setQuestions(data.kit?.questions || []);

            } catch (error) {
                console.error("Failed to load practice kit:", error);
                setError(error.message || "Failed to load practice questions.");
            } finally {
                setLoading(false);
            }
        }

        if (kitId) {
            fetchKit();
        }
    }, [kitId]);

    function goToNextQuestion() {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((previousIndex) => previousIndex + 1);
            setShowAnswer(false);
        }
    }

    function goToPreviousQuestion() {
        if (currentIndex > 0) {
            setCurrentIndex((previousIndex) => previousIndex - 1);
            setShowAnswer(false);
        }
    }

    function restartPractice() {
        setCurrentIndex(0);
        setShowAnswer(false);
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-10">
                <p className="text-gray-600">Loading practice mode...</p>
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

    if (!questions.length) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-10">
                <div className="rounded-xl border bg-white p-6">
                    <h1 className="text-2xl font-bold">Practice Mode</h1>
                    <p className="mt-3 text-gray-600">
                        No questions are available for this kit.
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

    const currentQuestion = questions[currentIndex];

    const rawQuestionText =
        currentQuestion.question ||
        currentQuestion.prompt ||
        currentQuestion.title ||
        "Question unavailable";

    const questionText =
        typeof rawQuestionText === "object"
            ? rawQuestionText.title ||
            rawQuestionText.text ||
            JSON.stringify(rawQuestionText)
            : rawQuestionText;

    const rawAnswerText =
  currentQuestion.answer_outline ||
  currentQuestion.answer ||
  currentQuestion.model_answer ||
  currentQuestion.expected_answer ||
  currentQuestion.explanation ||
  "No model answer available.";

    const answerText =
        typeof rawAnswerText === "object"
            ? JSON.stringify(rawAnswerText, null, 2)
            : rawAnswerText;

    const category =
        currentQuestion.category || currentQuestion.type || "General";

    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-blue-600">
                            Practice Mode
                        </p>

                        <h1 className="text-2xl font-bold text-gray-900">
                            {typeof kit?.role === "object"
                                ? kit.role.title || "Interview Practice"
                                : kit?.role || "Interview Practice"}
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
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {category}
                    </span>

                    <span className="text-sm font-medium text-gray-600">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                </div>

                <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                            width: `${((currentIndex + 1) / questions.length) * 100}%`,
                        }}
                    />
                </div>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="mb-3 text-sm font-medium text-gray-500">
                        Interview Question
                    </p>

                    <h2 className="text-xl font-semibold leading-relaxed text-gray-900">
                        {questionText}
                    </h2>

                    <div className="mt-8">
                        {!showAnswer ? (
                            <button
                                onClick={() => setShowAnswer(true)}
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                            >
                                Reveal Model Answer
                            </button>
                        ) : (
                            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                                <p className="mb-2 font-semibold text-green-800">
                                    Model Answer
                                </p>

                                <p className="whitespace-pre-line leading-relaxed text-gray-800">
                                    {answerText}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <div className="mt-6 flex flex-wrap justify-between gap-3">
                    <button
                        onClick={goToPreviousQuestion}
                        disabled={currentIndex === 0}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <button
                        onClick={restartPractice}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        Restart
                    </button>

                    <button
                        onClick={goToNextQuestion}
                        disabled={isLastQuestion}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next Question
                    </button>
                </div>

                {isLastQuestion && showAnswer && (
                    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 text-center">
                        <h3 className="font-semibold text-blue-900">
                            Practice session completed
                        </h3>

                        <p className="mt-1 text-sm text-blue-700">
                            You have reviewed all questions in this kit.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}