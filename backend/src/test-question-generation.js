import dotenv from "dotenv";
import {
  generateQuestions
} from "./services/question-generation.service.js";

dotenv.config();

const role = {
  title: "Software Engineer",
  seniority: "Junior",
  responsibilities: [
    "Build and maintain web applications"
  ]
};

const requirements = [
  {
    id: "r1",
    text: "JavaScript experience",
    kind: "technical",
    priority: "must"
  },
  {
    id: "r2",
    text: "React experience",
    kind: "technical",
    priority: "must"
  }
];

const researchSummary = {
  summary: "Example company research.",
  what_they_do: "Build software products.",
  interview_process: "Technical and behavioral interviews.",
  important_topics: [
    "JavaScript",
    "React"
  ],
  sources: [],
  confidence_notes: ""
};

try {
  const questions = await generateQuestions({
    role,
    researchSummary,
    category: "technical",
    requirements
  });

  console.log(
    JSON.stringify(questions, null, 2)
  );
} catch (error) {
  console.error(
    "QUESTION GENERATION ERROR:",
    error.message
  );
}