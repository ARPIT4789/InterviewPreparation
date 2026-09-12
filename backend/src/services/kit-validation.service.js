const VALID_KINDS = [
  "technical",
  "behavioural",
  "domain"
];

const VALID_PRIORITIES = [
  "must",
  "nice"
];

const VALID_CATEGORIES = [
  "technical",
  "behavioural",
  "domain"
];

export function validateKit(kit) {
  if (!kit || typeof kit !== "object") {
    throw new Error("Kit must be an object.");
  }

  validateSource(kit.source);
  validateRole(kit.role);
  validateQuestions(
    kit.questions,
    kit.role.requirements
  );
  validateFlashcards(
    kit.flashcards,
    kit.questions,
    kit.role.requirements
  );
  validateSchedule(
    kit.schedule,
    kit.questions,
    kit.role.requirements
  );
  validateCoverage(
    kit.coverage,
    kit.role.requirements,
    kit.questions
  );

  return true;
}

function validateSource(source) {
  if (!source || typeof source !== "object") {
    throw new Error("Invalid source.");
  }

  if (!source.company_url) {
    throw new Error("Company URL is required.");
  }

  if (!Number.isInteger(source.jd_chars)) {
    throw new Error("jd_chars must be an integer.");
  }

  if (!Array.isArray(source.pages_used)) {
    throw new Error("pages_used must be an array.");
  }
}

function validateRole(role) {
  if (!role || typeof role !== "object") {
    throw new Error("Invalid role.");
  }

  if (!Array.isArray(role.requirements)) {
    throw new Error("Requirements must be an array.");
  }

  const ids = new Set();

  for (const requirement of role.requirements) {
    if (!requirement.id) {
      throw new Error("Requirement is missing an ID.");
    }

    if (ids.has(requirement.id)) {
      throw new Error(
        `Duplicate requirement ID: ${requirement.id}`
      );
    }

    ids.add(requirement.id);

    if (!requirement.text) {
      throw new Error(
        `Requirement ${requirement.id} is missing text.`
      );
    }

    if (!VALID_KINDS.includes(requirement.kind)) {
      throw new Error(
        `Invalid requirement kind: ${requirement.kind}`
      );
    }

    if (!VALID_PRIORITIES.includes(requirement.priority)) {
      throw new Error(
        `Invalid requirement priority: ${requirement.priority}`
      );
    }
  }
}

function validateQuestions(questions, requirements) {
  if (!Array.isArray(questions)) {
    throw new Error("Questions must be an array.");
  }

  const requirementIds = new Set(
    requirements.map(
      (requirement) => requirement.id
    )
  );

  const questionIds = new Set();

  for (const question of questions) {
    if (!question.id) {
      throw new Error("Question is missing an ID.");
    }

    if (questionIds.has(question.id)) {
      throw new Error(
        `Duplicate question ID: ${question.id}`
      );
    }

    questionIds.add(question.id);

    if (!VALID_CATEGORIES.includes(question.category)) {
      throw new Error(
        `Invalid question category: ${question.category}`
      );
    }

    if (!question.prompt) {
      throw new Error(
        `Question ${question.id} is missing a prompt.`
      );
    }

    if (!question.answer_outline) {
      throw new Error(
        `Question ${question.id} is missing an answer outline.`
      );
    }

    if (
      !Number.isInteger(question.difficulty) ||
      question.difficulty < 1 ||
      question.difficulty > 3
    ) {
      throw new Error(
        `Invalid difficulty for ${question.id}.`
      );
    }

    if (
      !Array.isArray(question.requirement_ids) ||
      question.requirement_ids.length === 0
    ) {
      throw new Error(
        `Question ${question.id} must reference a requirement.`
      );
    }

    for (const requirementId of question.requirement_ids) {
      if (!requirementIds.has(requirementId)) {
        throw new Error(
          `Question ${question.id} references unknown requirement ${requirementId}.`
        );
      }
    }
  }
}

function validateFlashcards(
  flashcards,
  questions,
  requirements
) {
  if (!Array.isArray(flashcards)) {
    throw new Error("Flashcards must be an array.");
  }

  const requirementIds = new Set(
    requirements.map(
      (requirement) => requirement.id
    )
  );

  const flashcardIds = new Set();

  for (const card of flashcards) {
    if (!card.id) {
      throw new Error("Flashcard is missing an ID.");
    }

    if (flashcardIds.has(card.id)) {
      throw new Error(
        `Duplicate flashcard ID: ${card.id}`
      );
    }

    flashcardIds.add(card.id);

    if (!card.front || !card.back) {
      throw new Error(
        `Flashcard ${card.id} is incomplete.`
      );
    }

    if (!Array.isArray(card.requirement_ids)) {
      throw new Error(
        `Flashcard ${card.id} has invalid requirement_ids.`
      );
    }

    for (const requirementId of card.requirement_ids) {
      if (!requirementIds.has(requirementId)) {
        throw new Error(
          `Flashcard ${card.id} references unknown requirement ${requirementId}.`
        );
      }
    }
  }
}

function validateSchedule(
  schedule,
  questions,
  requirements
) {
  if (!schedule || typeof schedule !== "object") {
    throw new Error("Invalid schedule.");
  }

  if (
    !Number.isInteger(schedule.days_available) ||
    schedule.days_available < 1
  ) {
    throw new Error(
      "days_available must be a positive integer."
    );
  }

  if (!Array.isArray(schedule.days)) {
    throw new Error("Schedule days must be an array.");
  }

  if (
    schedule.days.length !==
    schedule.days_available
  ) {
    throw new Error(
      "Schedule must contain exactly days_available days."
    );
  }

  const questionIds = new Set(
    questions.map(
      (question) => question.id
    )
  );

  for (const day of schedule.days) {
    if (!Number.isInteger(day.day)) {
      throw new Error("Schedule day must be an integer.");
    }

    if (!day.focus) {
      throw new Error(
        `Day ${day.day} is missing focus.`
      );
    }

    if (!Array.isArray(day.question_ids)) {
      throw new Error(
        `Day ${day.day} has invalid question_ids.`
      );
    }

    if (!Number.isInteger(day.minutes)) {
      throw new Error(
        `Day ${day.day} minutes must be an integer.`
      );
    }

    for (const questionId of day.question_ids) {
      if (!questionIds.has(questionId)) {
        throw new Error(
          `Day ${day.day} references unknown question ${questionId}.`
        );
      }
    }
  }

  // Verify every must-have requirement
  // appears somewhere in the schedule.
  const scheduledQuestionIds = new Set(
    schedule.days.flatMap(
      (day) => day.question_ids
    )
  );

  const mustRequirements = requirements.filter(
    (requirement) =>
      requirement.priority === "must"
  );

  for (const requirement of mustRequirements) {
    const covered = questions.some(
      (question) =>
        scheduledQuestionIds.has(question.id) &&
        question.requirement_ids.includes(
          requirement.id
        )
    );

    if (!covered) {
      throw new Error(
        `Must-have requirement ${requirement.id} is not covered by the schedule.`
      );
    }
  }
}

function validateCoverage(
  coverage,
  requirements,
  questions
) {
  if (!coverage || typeof coverage !== "object") {
    throw new Error("Invalid coverage.");
  }

  if (!Array.isArray(
    coverage.uncovered_requirement_ids
  )) {
    throw new Error(
      "uncovered_requirement_ids must be an array."
    );
  }

  if (!Number.isInteger(coverage.passes)) {
    throw new Error(
      "coverage.passes must be an integer."
    );
  }

  const mustRequirementIds = new Set(
    requirements
      .filter(
        (requirement) =>
          requirement.priority === "must"
      )
      .map(
        (requirement) => requirement.id
      )
  );

  const actuallyUncovered = [];

  for (const requirementId of mustRequirementIds) {
    const covered = questions.some(
      (question) =>
        question.requirement_ids.includes(
          requirementId
        )
    );

    if (!covered) {
      actuallyUncovered.push(requirementId);
    }
  }

  const reported = [
    ...coverage.uncovered_requirement_ids
  ].sort();

  const actual = [
    ...actuallyUncovered
  ].sort();

  if (
    JSON.stringify(reported) !==
    JSON.stringify(actual)
  ) {
    throw new Error(
      "Coverage result does not match the actual question coverage."
    );
  }
}