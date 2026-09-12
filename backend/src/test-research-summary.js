import dotenv from "dotenv";
import { crawlCompany } from "./services/crawler.service.js";
import { researchInterviewProcess } from "./services/interview-research.service.js";
import { summarizeResearch } from "./services/research-summary.service.js";

dotenv.config();

const company = "Microsoft";
const role = "Software Engineer";
const companyUrl = "https://www.microsoft.com";

try {
  console.log("1. Crawling company...");
  const companyResearch = await crawlCompany(companyUrl);

  console.log("2. Researching interviews...");
  const interviewResearch = await researchInterviewProcess(
    company,
    role
  );

  console.log("3. Summarizing research...");
  const summary = await summarizeResearch({
    company,
    role,
    companyPages: companyResearch.pages,
    interviewResults: interviewResearch.results
  });

  console.log("\nRESEARCH SUMMARY:");
  console.log(JSON.stringify(summary, null, 2));
} catch (error) {
  console.error("RESEARCH SUMMARY ERROR:", error.message);
}