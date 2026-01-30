import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";

export const gemini = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 生图直接从 gogole sdk 导入，只有需要生图的时候调用
export const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  chat: gemini('gemini-3-flash-preview'),
  code: gemini('gemini-3-pro-preview'),
}