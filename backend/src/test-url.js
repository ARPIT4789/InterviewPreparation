import { validateCompanyUrl } from "./services/url.service.js";

const testUrls = [
  "https://example.com",
  "http://localhost:3000",
  "http://127.0.0.1:5000",
  "ftp://example.com",
  "not-a-url"
];

for (const url of testUrls) {
  try {
    const result = validateCompanyUrl(url);
    console.log("ALLOWED:", result.href);
  } catch (error) {
    console.log("BLOCKED:", url, "→", error.message);
  }
}