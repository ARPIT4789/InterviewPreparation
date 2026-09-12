import { crawlCompany } from "./services/crawler.service.js";

const companyUrl = "https://www.microsoft.com";

try {
  const result = await crawlCompany(companyUrl);

  console.log("\nPAGES FOUND:");
  console.log(result.pages_used);

  console.log("\nPAGE COUNT:");
  console.log(result.pages.length);

  for (const page of result.pages) {
    console.log("\n---");
    console.log("TITLE:", page.title);
    console.log("URL:", page.url);
  }
} catch (error) {
  console.error("CRAWLER ERROR:", error.message);
}