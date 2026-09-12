import { generateJSON } from "./llm.service.js";

function normalizeRequirements(requirements = []) {
  return requirements.map((requirement, index) => ({
    id: `r${index + 1}`,
    text: requirement.text.trim(),
    kind: requirement.kind,
    priority: requirement.priority
  }));
}

export async function extractRequirements(jd) {
  const prompt = `
You are extracting structured information from a job description.

IMPORTANT RULES:

1. Use ONLY information explicitly present in the job description.
2. Do NOT invent technologies, responsibilities, qualifications,
   years of experience, or domain knowledge.
3. Extract requirements that the candidate is expected or preferred
   to have.
4. Mark a requirement as "must" when the JD presents it as required,
   essential, expected, or mandatory.
5. Mark it as "nice" when the JD presents it as preferred,
   bonus, desirable, or nice-to-have.
6. Classify each requirement as:
   - technical
   - behavioural
   - domain
7. Keep requirement text concise but faithful to the JD.
8. If the JD contains very little information, return only what
   can honestly be extracted.

Return ONLY valid JSON in this exact shape:

{
  "title": "",
  "seniority": "",
  "responsibilities": [],
  "requirements": [
    {
      "text": "",
      "kind": "technical",
      "priority": "must"
    }
  ]
}

JOB DESCRIPTION:

${jd}
`;

  const result = await generateJSON(prompt);

  if (!result || typeof result !== "object") {
    throw new Error("Invalid extraction result.");
  }

  if (!Array.isArray(result.requirements)) {
    throw new Error("Requirements must be an array.");
  }

  return {
    title: result.title || "",
    seniority: result.seniority || "",
    responsibilities: Array.isArray(result.responsibilities)
      ? result.responsibilities
      : [],
    requirements: normalizeRequirements(result.requirements)
  };
}