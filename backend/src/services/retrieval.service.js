import * as cheerio from "cheerio";
import { validateCompanyUrl } from "./url.service.js";
import { fetchWithRetry } from "./request.service.js";

export async function fetchPage(inputUrl) {
  const url = validateCompanyUrl(inputUrl);

 const response = await fetchWithRetry(url.href, {
  headers: {
    "User-Agent": "TraoInterviewPrepBot/1.0"
  }
});

  if (!response.ok) {
    throw new Error(`Failed to fetch page: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    throw new Error("URL did not return an HTML page.");
  }

  const html = await response.text();

  const $ = cheerio.load(html);

  // Remove things that aren't useful for research
  $("script, style, noscript, svg").remove();

  const title = $("title").text().trim();

  const text = $("body")
  .text()
  .replace(/\s+/g, " ")
  .trim();

  const links = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    const linkText = $(element).text().trim();

    if (!href) return;

    try {
      const absoluteUrl = new URL(href, url.href).href;

      links.push({
        url: absoluteUrl,
        text: linkText
      });
    } catch {
      // Ignore invalid URLs
    }
  });

return {
  url: url.href,
    title,
    text,
    links
  };
}