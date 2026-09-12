import dotenv from "dotenv";

dotenv.config();

const SEARCH_TIMEOUT = 10000;

function classifySource(url, company) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    const companyName = company
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const hostnameWithoutWww = hostname.replace(/^www\./, "");

    if (hostnameWithoutWww.includes(companyName)) {
      return "official_company";
    }

    return "public_interview";
  } catch {
    return "public_interview";
  }
}

if (!process.env.TAVILY_API_KEY) {
  throw new Error(
    "TAVILY_API_KEY is missing. Add it to backend/.env"
  );
}

async function searchWeb(query) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "basic",
      max_results: 5,
      include_answer: false
    }),
    signal: AbortSignal.timeout(SEARCH_TIMEOUT)
  });

  if (!response.ok) {
    throw new Error(
      `Tavily search failed: HTTP ${response.status}`
    );
  }

  const data = await response.json();

 return (data.results || []).map((result) => ({
  title: result.title || "",
  url: result.url || "",
  snippet: result.content || "",
  source_type: "public_interview"
}));
}

export async function researchInterviewProcess(company, role) {
  const queries = [
    `"${company}" interview process`,
    `"${company}" "${role}" interview`,
    `"${company}" interview questions`,
    `"${company}" technical interview`
  ];

  const allResults = [];

  for (const query of queries) {
    try {
      const searchResults = await searchWeb(query);

      for (const result of searchResults) {
        allResults.push(result);
      }
    } catch (error) {
      console.log(
        `Interview research failed for "${query}": ${error.message}`
      );
    }
  }

  // Remove duplicate URLs
  const uniqueResults = [];
  const seenUrls = new Set();

  for (const result of allResults) {
    if (!result.url || seenUrls.has(result.url)) {
      continue;
    }

    seenUrls.add(result.url);
    uniqueResults.push(result);
  }

  // Remove obvious low-value sources
  const filteredResults = uniqueResults.filter((result) => {
    const value = `${result.title} ${result.url}`.toLowerCase();

    const blockedKeywords = [
      "privacy",
      "cookie",
      "terms-of-service",
      "login",
      "signup",
      "advertisement"
    ];

    return !blockedKeywords.some((keyword) =>
      value.includes(keyword)
    );
  });

  const classifiedResults = filteredResults.map((result) => ({
  ...result,
  source_type: classifySource(result.url, company)
}));

const results = classifiedResults.slice(0, 12);

  return {
    queries,
    results
  };
}