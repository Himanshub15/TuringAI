import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://turing-ai-one.vercel.app",
    "X-Title": "TuringAI",
  },
});

// Model routing — free models for different tasks
export const MODELS = {
  chat: "google/gemma-3n-e4b-it:free",
  title: "google/gemma-3n-e4b-it:free",
} as const;
