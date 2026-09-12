export function generateSchedule({
  daysAvailable,
  questions,
  requirements
}) {
  if (!Number.isInteger(daysAvailable) || daysAvailable < 1) {
    throw new Error("daysAvailable must be at least 1.");
  }

  if (!Array.isArray(questions)) {
    throw new Error("Questions must be an array.");
  }

  if (!Array.isArray(requirements)) {
    throw new Error("Requirements must be an array.");
  }

  if (questions.length === 0) {
    return {
      days_available: daysAvailable,
      days: Array.from(
        { length: daysAvailable },
        (_, index) => ({
          day: index + 1,
          focus: "Review",
          question_ids: [],
          minutes: 30
        })
      )
    };
  }

  const requirementMap = new Map(
    requirements.map((requirement) => [
      requirement.id,
      requirement
    ])
  );

  function questionScore(question) {
    let score = 0;

    for (const requirementId of question.requirement_ids || []) {
      const requirement = requirementMap.get(requirementId);

      if (!requirement) {
        continue;
      }

      // Must-have requirements get higher priority.
      if (requirement.priority === "must") {
        score += 10;
      }

      // Technical questions are slightly prioritized.
      if (requirement.kind === "technical") {
        score += 2;
      }
    }

    // Harder questions should appear earlier.
    score += Number(question.difficulty || 1);

    return score;
  }

  // Sort hardest / highest-priority questions first.
  const sortedQuestions = [...questions].sort(
    (a, b) => questionScore(b) - questionScore(a)
  );

  const days = Array.from(
    { length: daysAvailable },
    (_, index) => ({
      day: index + 1,
      focus: "",
      question_ids: [],
      minutes: 0
    })
  );

  // Distribute questions across days.
  sortedQuestions.forEach((question, index) => {
    const dayIndex = index % daysAvailable;

    days[dayIndex].question_ids.push(
      question.id
    );

    // 15 minutes per question.
    days[dayIndex].minutes += 15;
  });

  // Generate a focus for each day.
  for (const day of days) {
    const dayQuestions = questions.filter(
      (question) =>
        day.question_ids.includes(question.id)
    );

    const categories = [
      ...new Set(
        dayQuestions.map(
          (question) => question.category
        )
      )
    ];

    if (categories.length === 0) {
      day.focus = "Review";
    } else {
      day.focus = categories
        .map(
          (category) =>
            category.charAt(0).toUpperCase() +
            category.slice(1)
        )
        .join(" + ");
    }

    // Keep minutes as an integer.
    day.minutes = Math.round(day.minutes);
  }

  return {
    days_available: daysAvailable,
    days
  };
}