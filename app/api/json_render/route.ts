import { GameVisualizationPrompt } from "@/prompt/json-render";
import { streamText } from "ai";
import { kimiK2 } from "../models/ark";
import { models } from "../models/gemini";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, context } = await req.json();

  let fullPrompt = prompt;

  if (context?.schema) {
    fullPrompt += `\n\n游戏配置 SCHEMA:\n${JSON.stringify(context.schema, null, 2)}`;
  }

  // Add data context
  if (context?.data) {
    fullPrompt += `\n\n当前数据:\n${JSON.stringify(context.data, null, 2)}`;
  }

  const result = streamText({
    model: kimiK2,
    system: GameVisualizationPrompt,
    prompt: fullPrompt,
    temperature: 0.7,
  });

  return new Response(result.textStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
