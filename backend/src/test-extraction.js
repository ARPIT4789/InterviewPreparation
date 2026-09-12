import dotenv from "dotenv";
import { extractRequirements } from "./services/extraction.service.js";

dotenv.config();

const jd = `
Software Engineer

We are looking for a Software Engineer to join our team.

Requirements:
- 2+ years of experience with JavaScript.
- Strong knowledge of React.
- Experience building REST APIs.
- Good communication skills.
- AWS experience is a plus.

Responsibilities:
- Build and maintain web applications.
- Work with backend engineers.
`;

try {
  const result = await extractRequirements(jd);

  console.log(
    JSON.stringify(result, null, 2)
  );
} catch (error) {
  console.error(error);
}