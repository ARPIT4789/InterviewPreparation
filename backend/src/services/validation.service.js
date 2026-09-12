const VALID_KINDS = [
  "technical",
  "behavioural",
  "domain"
];

const VALID_PRIORITIES = [
  "must",
  "nice"
];

export function validateRequirements(role) {
  if (!role || typeof role !== "object") {
    throw new Error("Invalid role data.");
  }

  if (!Array.isArray(role.requirements)) {
    throw new Error("Requirements must be an array.");
  }

  for (const requirement of role.requirements) {
    if (!requirement.id) {
      throw new Error("Requirement is missing an id.");
    }

    if (!requirement.text) {
      throw new Error(
        `Requirement ${requirement.id} is missing text.`
      );
    }

    if (!VALID_KINDS.includes(requirement.kind)) {
      throw new Error(
        `Invalid requirement kind for ${requirement.id}.`
      );
    }

    if (!VALID_PRIORITIES.includes(requirement.priority)) {
      throw new Error(
        `Invalid requirement priority for ${requirement.id}.`
      );
    }
  }

  return true;
}