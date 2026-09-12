import { validateKit } from "./services/kit-validation.service.js";

const kit = {
  source: {
    company: "Test Company",
    company_url: "https://example.com",
    role: "Software Engineer",
    location: "",
    jd_chars: 100,
    researched_at: new Date().toISOString(),
    pages_used: ["https://example.com"]
  },

  company_brief: {
    summary: "A test company.",
    what_they_do: "Builds software.",
    sources: ["https://example.com"]
  },

  role: {
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
      }
    ]
  },

  questions: [
    {
      id: "q1",
      requirement_ids: ["r1"],
      category: "technical",
      prompt: "Explain the JavaScript event loop.",
      answer_outline: "Call stack and queues.",
      difficulty: 2
    },
    {
      id: "q2",
      requirement_ids: ["r2"],
      category: "technical",
      prompt: "Explain React state.",
      answer_outline: "State stores component data.",
      difficulty: 2
    }
  ],

  flashcards: [
    {
      id: "f1",
      front: "What is the JavaScript event loop?",
      back: "Call stack and queues.",
      requirement_ids: ["r1"]
    },
    {
      id: "f2",
      front: "What is React state?",
      back: "State stores component data.",
      requirement_ids: ["r2"]
    }
  ],

  schedule: {
    days_available: 2,
    days: [
      {
        day: 1,
        focus: "Technical",
        question_ids: ["q1"],
        minutes: 15
      },
      {
        day: 2,
        focus: "Technical",
        question_ids: ["q2"],
        minutes: 15
      }
    ]
  },

  coverage: {
    uncovered_requirement_ids: [],
    passes: 1
  }
};

try {
  validateKit(kit);

  console.log("✅ KIT VALIDATION PASSED");
} catch (error) {
  console.error("❌ KIT VALIDATION FAILED");
  console.error(error.message);
}