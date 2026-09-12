import dotenv from "dotenv";
import { generateQuestionBank } from "./services/question-pipeline.service.js";

dotenv.config();

const role = {
  title: "Software Engineer",
  seniority: "Junior",
  responsibilities: [
    "Build web applications"
  ],
  requirements: [
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
    },
    {
      id: "r3",
      text: "Good communication skills",
      kind: "behavioural",
      priority: "must"
    }
  ]
};

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
  const result = await generateQuestionBank({
    role,
    researchSummary
  });

  console.log(
    JSON.stringify(result, null, 2)
  );
} catch (error) {
  console.error(
    "QUESTION PIPELINE ERROR:",
    error.message
  );
}