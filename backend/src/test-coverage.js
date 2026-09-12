import { checkCoverage } from "./services/coverage.service.js";

const requirements = [
  {
    id: "r1",
    text: "JavaScript",
    kind: "technical",
    priority: "must"
  },
  {
    id: "r2",
    text: "React",
    kind: "technical",
    priority: "must"
  },
  {
    id: "r3",
    text: "AWS",
    kind: "technical",
    priority: "nice"
  }
];

const questions = [
  {
    id: "q1",
    requirement_ids: ["r1"],
    category: "technical"
  },
  {
    id: "q2",
    requirement_ids: ["r1"],
    category: "technical"
  }
];

const result = checkCoverage(requirements, questions);

console.log(JSON.stringify(result, null, 2));