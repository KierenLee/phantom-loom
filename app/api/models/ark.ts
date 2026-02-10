import { createOpenAI } from "@ai-sdk/openai";

export const ark = createOpenAI({
  baseURL: "https://ark-cn-beijing.bytedance.net/api/v3",
  apiKey: process.env.ARK_API_KEY,
});

export const doubaoSeed = ark.chat(process.env.ARK_DOUBAO_SEED_MODEL || "");

export const doubaoSeedImage = ark.imageModel("ep-20251219142201-9glx6");

export const kimiK2 = ark.chat(process.env.ARK_KIMI_K2_MODEL || "");
