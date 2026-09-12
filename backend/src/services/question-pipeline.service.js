import { generateQuestions } from "./question-generation.service.js";
import { checkCoverage } from "./coverage.service.js";

const CATEGORIES = [
  "technical",
  "behavioural",
  "domain"
];

export async function generateQuestionBank({
  role,
  researchSummary
}) {
  const allQuestions = [];

  // First pass
  for (const category of CATEGORIES) {
    const categoryRequirements = role.requirements.filter(
      (requirement) => requirement.kind === category
    );

    if (categoryRequirements.length === 0) {
      continue;
    }

    const questions = await generateQuestions({
      role,
      researchSummary,
      category,
      requirements: categoryRequirements
    });

    allQuestions.push(...questions);
  }

  // First coverage check
  let coverage = checkCoverage(
    role.requirements,
    allQuestions
  );

  let passes = 1;

  // Second pass: generate questions only for uncovered
  // must-have requirements.
  if (!coverage.complete) {
    passes++;

    const missingRequirements = role.requirements.filter(
      (requirement) =>
        coverage.uncovered_requirement_ids.includes(
          requirement.id
        )
    );

    for (const category of CATEGORIES) {
      const categoryRequirements = missingRequirements.filter(
        (requirement) => requirement.kind === category
      );

      if (categoryRequirements.length === 0) {
        continue;
      }

      const questions = await generateQuestions({
        role,
        researchSummary,
        category,
        requirements: categoryRequirements
      });

      allQuestions.push(...questions);
    }

    // Check coverage again
    coverage = checkCoverage(
      role.requirements,
      allQuestions
    );
  }

  return {
    questions: allQuestions,
    coverage: {
      uncovered_requirement_ids:
        coverage.uncovered_requirement_ids,
      passes
    }
  };
}