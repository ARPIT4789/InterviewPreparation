const DEFAULT_DELAY = 1000;
const MAX_RETRIES = 2;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(url, options = {}) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Rate limit requests
      if (attempt === 0) {
        await sleep(DEFAULT_DELAY);
      }

      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000)
      });

      // Retry temporary server/rate-limit errors
      if (
        response.status === 429 ||
        response.status === 500 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504
      ) {
        throw new Error(`Retryable HTTP error: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt === MAX_RETRIES) {
        break;
      }

      // Exponential backoff:
      // 1 second → 2 seconds
      const delay = 1000 * 2 ** attempt;

      console.log(
        `Request failed. Retrying in ${delay / 1000}s...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}