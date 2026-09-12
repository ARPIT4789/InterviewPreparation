import dotenv from "dotenv";
import { generateFlashcards } from "./services/flashcard.service.js";

dotenv.config();

const questions = [
  {
    id: "q-1",
    requirement_ids: ["r1"],
    category: "technical",
    prompt:
      "What is the JavaScript event loop?",
    answer_outline:
      "Explain the call stack, microtask queue, macrotask queue, and execution order.",
    difficulty: 2
  },
  {
    id: "q-2",
    requirement_ids: ["r2"],
    category: "technical",
    prompt:
      "What is the difference between React state and props?",
    answer_outline:
      "Props are inputs passed from a parent; state is managed by a component.",
    difficulty: 1
  }
];

try {
  const flashcards = await generateFlashcards(questions);

  console.log(
    JSON.stringify(flashcards, null, 2)
  );
} catch (error) {
  console.error(
    "FLASHCARD ERROR:",
    error.message
  );
}