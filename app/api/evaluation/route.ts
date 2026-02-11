import { createGameEvaluationPrompt } from "@/prompt/game-evaluation";
import { generateImage } from "ai";
import { modelConfig } from "../../models/config";
import { streamText, convertToModelMessages, type UIMessage, tool } from "ai";
import { z } from "zod";
import {
  experimental_createSkillTool as createSkillTool,
  createBashTool,
} from "bash-tool";
import { LocalSandbox } from "@/lib/tools/local-sandbox";
import { join, resolve } from "path";
import fs from "fs";

const { skill, files, instructions } = await createSkillTool({
  skillsDirectory: "./static/skills",
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const url = new URL(req.url);
  let threadId = url.searchParams.get("threadId") || "default";

  // Sanitize threadId to prevent path traversal
  threadId = threadId.replace(/[^a-zA-Z0-9-]/g, "");
  if (!threadId) threadId = "default";

  // Create bash tool with skill files
  const { tools: bashTools } = await createBashTool({
    files,
    extraInstructions: instructions,
    sandbox: new LocalSandbox(process.cwd()),
    // Remove destination override to use default /workspace virtual path,
    // which maps to physical ./workspace via LocalSandbox
  });

  /** 核心工具集 - 包含 Image Generation Tool */
  const coreTools = {
    ...bashTools, // Expose bash, readFile, writeFile directly
    imageGenerationTool: tool({
      description:
        "根据文本描述生成图片。当用户想要画图、生成照片或设计图像时使用此工具。",
      inputSchema: z.object({
        prompt: z
          .string()
          .describe(
            "详细的英文绘图提示词，描述画面主体、风格、光照、构图等细节。",
          ),
        aspectRatio: z
          .enum(["1:1", "16:9", "9:16"])
          .describe("图片的宽高比")
          .default("1:1"),
      }),
      execute: async ({ prompt, aspectRatio }) => {
        console.log(
          `[Image Tool] 正在生成图片，Prompt: "${prompt.substring(0, 50)}..."`,
        );

        // 1. 调用生图模型
        const { image } = await generateImage({
          model: modelConfig.image.doubaoSeed,
          prompt,
          aspectRatio: aspectRatio, // 注意：部分模型可能对比例支持有限制
          n: 1,
        });

        // 2. 处理结果 (生产环境中上传到 TOS 并返回 URL)
        const imagesDir = resolve(
          process.cwd(),
          `workspace/${threadId}/images`,
        );
        if (!fs.existsSync(imagesDir)) {
          fs.mkdirSync(imagesDir, { recursive: true });
        }

        const fileName = resolve(imagesDir, `img_${Date.now()}.png`);
        const buffer = Buffer.from(image.base64, "base64");
        fs.writeFileSync(fileName, buffer);

        return {
          success: true,
          imageUrl: fileName,
          revisedPrompt: prompt,
        };
      },
    }),
  };

  const result = streamText({
    model: modelConfig.chat.gemini3Flash,
    system: createGameEvaluationPrompt({ sessionId: threadId }),
    messages: await convertToModelMessages(messages),
    tools: {
      skill,
      ...coreTools, // Main agent also has access to basic tools if needed
    },
    // 移除不兼容的reasoningSummary选项，避免API错误
    providerOptions: {
      openai: {
        reasoningEffort: "low",
      },
      gemini: {
        reasoningEffort: "low",
      },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
