import { generateQuestionBank } from "./question-pipeline.service.js";
import { generateFlashcards } from "./flashcard.service.js";
import { generateSchedule } from "./schedule.service.js";

export async function regenerateQuestions({
  role,
  companyBrief,
  existingQuestions = []
}) {
  const researchSummary = {
    summary: companyBrief?.summary || "",
    what_they_do: companyBrief?.what_they_do || "",
    interview_process: "",
    important_topics: [],
    sources: companyBrief?.sources || [],
    confidence_notes:
      "Regenerated using the saved company brief."
  };

  const questionResult = await generateQuestionBank({
    role,
    researchSummary
  });

  // Preserve manually edited or user-created questions
  const userQuestions = existingQuestions.filter(
    (question) =>
      question.source === "user" || question.edited === true
  );

  const generatedQuestions = questionResult.questions.filter(
    (question) =>
      !userQuestions.some(
        (userQuestion) => userQuestion.id === question.id
      )
  );

  return {
    questions: [...userQuestions, ...generatedQuestions],
    coverage: questionResult.coverage
  };
}

export async function regenerateFlashcardSection(questions) {
  return await generateFlashcards(questions);
}

export function regenerateScheduleSection({
  daysAvailable,
  questions,
  requirements
}) {
  return generateSchedule({
    daysAvailable,
    questions,
    requirements
  });
}