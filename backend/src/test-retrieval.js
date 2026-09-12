import { fetchPage } from "./services/retrieval.service.js";

const url = "https://example.com";

try {
  const result = await fetchPage(url);

  console.log("TITLE:");
  console.log(result.title);

  console.log("\nTEXT:");
  console.log(result.text.slice(0, 500));

  console.log("\nLINKS:");
  console.log(result.links);
} catch (error) {
  console.error("RETRIEVAL ERROR:", error.message);
}