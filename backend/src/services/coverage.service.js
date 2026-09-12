export function checkCoverage(requirements, questions) {
  const uncoveredRequirementIds = [];

  for (const requirement of requirements) {
    if (requirement.priority !== "must") {
      continue;
    }

    const covered = questions.some((question) =>
      Array.isArray(question.requirement_ids) &&
      question.requirement_ids.includes(requirement.id)
    );

    if (!covered) {
      uncoveredRequirementIds.push(requirement.id);
    }
  }

  return {
    uncovered_requirement_ids: uncoveredRequirementIds,
    complete: uncoveredRequirementIds.length === 0
  };
}