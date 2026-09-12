import { extractRequirements } from "./extraction.service.js";
import { crawlCompany } from "./crawler.service.js";
import { researchInterviewProcess } from "./interview-research.service.js";
import { summarizeResearch } from "./research-summary.service.js";
import { generateQuestionBank } from "./question-pipeline.service.js";
import { generateFlashcards } from "./flashcard.service.js";
import { generateSchedule } from "./schedule.service.js";
import { validateKit } from "./kit-validation.service.js";

export async function generateKit({
  jd,
  companyUrl,
  daysAvailable
}) {
  if (!jd || typeof jd !== "string") {
    throw new Error("Job description is required.");
  }

  if (!companyUrl || typeof companyUrl !== "string") {
    throw new Error("Company URL is required.");
  }

  if (
    !Number.isInteger(daysAvailable) ||
    daysAvailable < 1 ||
    daysAvailable > 60
  ) {
    throw new Error(
      "daysAvailable must be between 1 and 60."
    );
  }

  // STEP 1: Extract requirements
  console.log("1/7 Extracting requirements...");

  const role = await extractRequirements(jd);

  // Extract company name once and reuse it.
  const companyName = extractCompanyName(companyUrl);

  // STEP 2: Crawl company website
  console.log("2/7 Crawling company website...");

  let companyResearch = {
    pages: [],
    pages_used: []
  };

  let companyResearchError = null;

  try {
    companyResearch = await crawlCompany(companyUrl);
  } catch (error) {
    companyResearchError = error.message;

    console.log(
      `Company research unavailable: ${error.message}`
    );
  }

  // STEP 3: Research interview process
  console.log("3/7 Researching interview process...");

  let interviewResearch = {
    queries: [],
    results: []
  };

  let interviewResearchError = null;

  try {
    interviewResearch =
      await researchInterviewProcess(
        companyName,
        role.title || "Software Engineer"
      );
  } catch (error) {
    interviewResearchError = error.message;

    console.log(
      `Interview research unavailable: ${error.message}`
    );
  }

  // STEP 4: Summarize research
  console.log("4/7 Summarizing research...");

  let researchSummary = {
    summary: "",
    what_they_do: "",
    interview_process: "",
    important_topics: [],
    sources: [],
    confidence_notes: ""
  };

  try {
    researchSummary = await summarizeResearch({
      company: companyName,
      role: role.title || "Software Engineer",
      companyPages: companyResearch.pages,
      interviewResults: interviewResearch.results
    });
  } catch (error) {
    console.log(
      `Research summary unavailable: ${error.message}`
    );

    researchSummary.confidence_notes =
      "Research summary could not be generated.";
  }

  // STEP 5: Generate questions + coverage passes
  console.log("5/7 Generating question bank...");

  const questionResult =
    await generateQuestionBank({
      role,
      researchSummary
    });

  // STEP 6: Generate flashcards
  console.log("6/7 Generating flashcards...");

  const flashcards =
    await generateFlashcards(
      questionResult.questions
    );

  // STEP 7: Generate deterministic schedule
  console.log("7/7 Generating schedule...");

  const schedule =
    generateSchedule({
      daysAvailable,
      questions: questionResult.questions,
      requirements: role.requirements
    });

  // Build final Appendix A kit
  const kit = {
    source: {
      company: companyName,
      company_url: companyUrl,
      role: role.title || "",
      location: "",
      jd_chars: jd.length,
      researched_at: new Date().toISOString(),
      pages_used: companyResearch.pages_used
    },

    company_brief: {
      summary: researchSummary.summary,
      what_they_do: researchSummary.what_they_do,
      sources: researchSummary.sources
    },

    role: {
      title: role.title || "",
      seniority: role.seniority || "",
      responsibilities: role.responsibilities || [],
      requirements: role.requirements
    },

    questions: questionResult.questions,

    flashcards,

    schedule,

    coverage: questionResult.coverage
  };

  // Validate before returning.
  validateKit(kit);

  return {
    kit,

    research_status: {
      company_research:
        companyResearchError
          ? "partial"
          : "ok",

      interview_research:
        interviewResearchError
          ? "partial"
          : "ok",

      company_research_error:
        companyResearchError,

      interview_research_error:
        interviewResearchError
    }
  };
}

function extractCompanyName(companyUrl) {
  try {
    const hostname =
      new URL(companyUrl).hostname;

    return hostname
      .replace(/^www\./, "")
      .split(".")[0]
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  } catch {
    return "Company";
  }
}