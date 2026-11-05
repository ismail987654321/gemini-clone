import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // CHANGED: no hardcoded key

if (!apiKey) {
  console.error("Missing VITE_GEMINI_API_KEY. Add it to your .env file.");
}

const ai = new GoogleGenAI({ apiKey });

const MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-3-flash-preview",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isOverloaded = (err) =>
  err?.status === 503 ||
  err?.status === 429 ||
  String(err?.message).includes("503") ||
  String(err?.message).includes("UNAVAILABLE");

async function main(prompt) {
  let lastError;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        return response.text;
      } catch (err) {
        lastError = err;
        if (!isOverloaded(err)) throw err;
        await sleep(1000 * (attempt + 1));
      }
    }
  }

  throw lastError;
}

export default main;