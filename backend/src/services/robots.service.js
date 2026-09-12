const robotsCache = new Map();

export async function canFetch(url) {
  const parsedUrl = new URL(url);
  const robotsUrl = `${parsedUrl.origin}/robots.txt`;

  if (!robotsCache.has(robotsUrl)) {
    try {
      const response = await fetch(robotsUrl, {
        headers: {
          "User-Agent": "TraoInterviewPrepBot/1.0"
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        robotsCache.set(robotsUrl, null);
      } else {
        const text = await response.text();
        robotsCache.set(robotsUrl, text);
      }
    } catch {
      robotsCache.set(robotsUrl, null);
    }
  }

  const robots = robotsCache.get(robotsUrl);

  // If robots.txt cannot be retrieved,
  // don't block the entire research process.
  if (!robots) {
    return true;
  }

  return isAllowedByRobots(robots, parsedUrl.pathname);
}

function isAllowedByRobots(robotsText, pathname) {
  const lines = robotsText
    .split(/\r?\n/)
    .map((line) => line.trim());

  let appliesToAll = false;
  let rules = [];

  for (const line of lines) {
    if (!line || line.startsWith("#")) {
      continue;
    }

    const [rawKey, ...rawValue] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rawValue.join(":").trim();

    if (key === "user-agent") {
      appliesToAll = value === "*";
      rules = [];
      continue;
    }

    if (appliesToAll && key === "disallow" && value) {
      rules.push(value);
    }
  }

  return !rules.some((rule) => pathname.startsWith(rule));
}