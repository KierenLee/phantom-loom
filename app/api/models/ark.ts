import { createOpenAI } from "@ai-sdk/openai";

export const ark = createOpenAI({
  baseURL: process.env.ARK_API_BASE_URL,
  apiKey: process.env.ARK_API_KEY,
});

export const doubaoSeed = ark.chat("ep-20251219142201-9glx6");

export const doubaoSeedImage = ark.imageModel("ep-20251219142201-9glx6");
