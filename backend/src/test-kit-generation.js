import dotenv from "dotenv";
import { generateKit } from "./services/kit-generation.service.js";

dotenv.config();

const jd = `
Junior Software Engineer

We are looking for someone with JavaScript and React experience.

Requirements:
- Experience with JavaScript.
- Strong knowledge of React.
- Good communication skills.

Responsibilities:
- Build and maintain web applications.
- Work with the engineering team.
`;

try {
  console.log("Starting full kit generation...\n");

  const result = await generateKit({
    jd,
    companyUrl: "https://www.microsoft.com",
    daysAvailable: 3
  });

  console.log("\n===== RESEARCH STATUS =====");
  console.log(
    JSON.stringify(
      result.research_status,
      null,
      2
    )
  );

  console.log("\n===== FINAL KIT =====");
  console.log(
    JSON.stringify(
      result.kit,
      null,
      2
    )
  );

  console.log("\n✅ FULL KIT GENERATION PASSED");
} catch (error) {
  console.error("\n❌ FULL KIT GENERATION FAILED");
  console.error(error.message);
}