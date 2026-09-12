import { fetchPage } from "./retrieval.service.js";
import { canFetch } from "./robots.service.js";

const MAX_PAGES = 6;

const keywordWeights = {
  careers: 10,
  career: 10,
  jobs: 10,
  job: 9,
  hiring: 10,
  recruitment: 10,
  "join-us": 10,
  "join our team": 10,
  about: 7,
  company: 6,
  culture: 6,
  team: 5,
  values: 4,
  mission: 4
};

function scoreLink(link) {
  const value = `${link.text} ${link.url}`.toLowerCase();

  let score = 0;

  for (const [keyword, weight] of Object.entries(keywordWeights)) {
    if (value.includes(keyword)) {
      score += weight;
    }
  }

  // Penalize pages that are usually less useful
  const lowValueKeywords = [
    "privacy",
    "terms",
    "legal",
    "cookie",
    "security",
    "support"
  ];

  for (const keyword of lowValueKeywords) {
    if (value.includes(keyword)) {
      score -= 10;
    }
  }

  return score;
}

function isSameDomain(urlA, urlB) {
  return new URL(urlA).hostname === new URL(urlB).hostname;
}

export async function crawlCompany(companyUrl) {
  const pages = [];
  const visited = new Set();

  const homepage = await fetchPage(companyUrl);

  pages.push(homepage);
  visited.add(homepage.url);

  const candidates = homepage.links
    .filter((link) => isSameDomain(homepage.url, link.url))
    .map((link) => ({
      ...link,
      score: scoreLink(link)
    }))
    .filter((link) => link.score > 0)
    .sort((a, b) => b.score - a.score);

 for (const candidate of candidates) {
  if (pages.length >= MAX_PAGES) {
    break;
  }

  if (visited.has(candidate.url)) {
    continue;
  }

  // Mark as visited BEFORE fetching.
  // This prevents the same URL from being requested twice.
  visited.add(candidate.url);

  try {
        const allowed = await canFetch(candidate.url);

if (!allowed) {
  console.log(`Skipping disallowed URL: ${candidate.url}`);
  continue;
}
      const page = await fetchPage(candidate.url);

      pages.push(page);
      visited.add(candidate.url);
    } catch (error) {
      console.log(
        `Skipping ${candidate.url}: ${error.message}`
      );
    }
  }

  return {
    pages,
    pages_used: pages.map((page) => page.url)
  };
}