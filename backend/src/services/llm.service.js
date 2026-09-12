import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Add it to backend/.env"
  );
}

const ai = new GoogleGenAI({ apiKey });

export async function generateJSON(prompt) {
  const maxRetries = 2;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;

      if (!text) {
        throw new Error("LLM returned an empty response.");
      }

      try {
        return JSON.parse(text);
      } catch {
        throw new Error("LLM returned invalid JSON.");
      }
    } catch (error) {
      lastError = error;

      const status = error?.status || error?.code;

      const retryable =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (!retryable || attempt === maxRetries) {
        break;
      }

      const delay = 1000 * 2 ** attempt;

      console.log(
        `LLM request failed (${status}). Retrying in ${delay / 1000}s...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }

  throw lastError;
}