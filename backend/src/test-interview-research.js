import dotenv from "dotenv";
import { researchInterviewProcess } from "./services/interview-research.service.js";

dotenv.config();

try {
  const result = await researchInterviewProcess(
    "Microsoft",
    "Software Engineer"
  );

  console.log("\nQUERIES:");
  console.log(result.queries);

  console.log("\nRESULTS:");

  for (const item of result.results) {
    console.log("\n---");
    console.log("TITLE:", item.title);
    console.log("URL:", item.url);
    console.log("TYPE:", item.source_type);
    console.log("SNIPPET:", item.snippet.slice(0, 300));
  }
} catch (error) {
  console.error("INTERVIEW RESEARCH ERROR:", error.message);
}