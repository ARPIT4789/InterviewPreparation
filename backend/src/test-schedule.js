import { generateSchedule } from "./services/schedule.service.js";

const requirements = [
  {
    id: "r1",
    text: "Strong knowledge of React",
    kind: "technical",
    priority: "must"
  },
  {
    id: "r2",
    text: "JavaScript experience",
    kind: "technical",
    priority: "must"
  },
  {
    id: "r3",
    text: "Good communication skills",
    kind: "behavioural",
    priority: "must"
  }
];

const questions = [
  {
    id: "q1",
    requirement_ids: ["r1"],
    category: "technical",
    prompt: "Explain React state.",
    answer_outline: "Explain state and updates.",
    difficulty: 3
  },
  {
    id: "q2",
    requirement_ids: ["r2"],
    category: "technical",
    prompt: "Explain the JavaScript event loop.",
    answer_outline: "Call stack and queues.",
    difficulty: 2
  },
  {
    id: "q3",
    requirement_ids: ["r3"],
    category: "behavioural",
    prompt: "Tell me about a communication challenge.",
    answer_outline: "Explain situation and resolution.",
    difficulty: 1
  }
];

const schedule = generateSchedule({
  daysAvailable: 3,
  questions,
  requirements
});

console.log(
  JSON.stringify(schedule, null, 2)
);