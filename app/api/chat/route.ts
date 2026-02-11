import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  tool,
  generateText,
  stepCountIs,
} from "ai";
import { modelConfig } from "../../models/config";
import { z } from "zod";
import {
  experimental_createSkillTool as createSkillTool,
  createBashTool,
} from "bash-tool";
import { LocalSandbox } from "@/lib/tools/local-sandbox";
import { join, resolve } from "path";
import { GameRequirementAnalystPrompt } from "@/prompt/game-requirement-analyst";
import { GameCodeGeneratorPrompt } from "@/prompt/game-coder";
import { MaterialGeneratorPrompt } from "@/prompt/material-generator-agent";
import fs from "fs";
import path from "path";
import { imageGenerationPrompt } from "@/prompt/generate-image";

// Discover skills and get files to upload
// const { skill, files, instructions } = await createSkillTool({
//   skillsDirectory: "./static/skills",
// });

// 检测 static 和 static/workspace 是否有文件夹，没有则创建一个
const workspacePath = join(process.cwd(), "./workspace");
if (!fs.existsSync(workspacePath)) {
  fs.mkdirSync(workspacePath, { recursive: true });
}

/**
 * Handle POST requests for the chat API
 * @param req The request object
 * @returns A streamed response with the chat result
 */
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const url = new URL(req.url);
  let threadId = url.searchParams.get("threadId") || "default";

  // Sanitize threadId to prevent path traversal
  threadId = threadId.replace(/[^a-zA-Z0-9-]/g, "");
  if (!threadId) threadId = "default";

  // Create bash tool with skill files
  const { tools: bashTools } = await createBashTool({
    // files,
    // extraInstructions: instructions,
    sandbox: new LocalSandbox(join(process.cwd(), "./workspace", threadId)),
    // Remove destination override to use default /workspace virtual path,
    // which maps to physical ./workspace via LocalSandbox
  });

  /** 核心工具集 - 包含 Image Generation Tool */
  const coreTools = {
    ...bashTools, // Expose bash, readFile, writeFile directly
    imageGenerationTool: tool({
      description:
        "根据文本描述生成图片。当用户想要画图、生成照片或设计图像时使用此工具。如果生成图片成功，返回图片URL用于预览",
      inputSchema: z.object({
        description: z
          .string()
          .describe(
            "图片描述，详细的英文绘图提示词，描述画面主体、风格、光照、构图等细节",
          ),
        name: z.string().describe("图片名称"),
        aspectRatio: z
          .enum(["1:1", "16:9", "9:16"])
          .describe("图片的宽高比")
          .default("1:1"),
      }),
      execute: async ({ description, name }) => {
        console.log(
          `[Image Tool] 正在生成图片，name: ${name} description: "${description.substring(0, 50)}..."`,
        );

        // 定义系统指令（风格、规则）
        const systemInstruction = imageGenerationPrompt;
        const prompt = `Generate an image with the following requirements:\n${description}`;

        // TODO: 替换 generateImage
        // TODO：并发调用，提高效率
        const response = await modelConfig.image.genAI.models.generateContent({
          model: "gemini-2.5-flash-image",
          config: {
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        });
        console.log(
          "[Image Tool] response candiadates",
          response.candidates?.length,
        );
        for (const part of response?.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;

            const imagesDir = resolve(
              process.cwd(),
              `workspace/${threadId}/images`,
            );
            if (!fs.existsSync(imagesDir)) {
              fs.mkdirSync(imagesDir, { recursive: true });
            }

            const fileName = resolve(imagesDir, `${name}.png`);
            const buffer = Buffer.from(imageData!, "base64");
            fs.writeFileSync(fileName, buffer);

            return {
              success: true,
              imagePath: `${threadId}/images/${path.basename(fileName)}`,
              message: "图片生成成功",
              revisedPrompt: prompt,
            };
          } else if (part?.text) {
            return {
              success: false,
              message: part.text,
            };
          }
        }
        // 如果循环结束还没返回，说明没找到图片
        console.error("[Image Tool] No image data found in response parts");
        throw new Error(
          "Failed to generate image: No image data received from model.",
        );
      },
    }),
  };

  /** 需求分析agent核心逻辑 */
  const requirementAnalystAgent = async (prompt: string) => {
    try {
      const result = await generateText({
        model: modelConfig.chat.gemini3Flash,
        system: GameRequirementAnalystPrompt,
        prompt,
        tools: bashTools, // Needs file access to write docs
        stopWhen: stepCountIs(20),
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
      return result;
    } catch (error) {
      console.log("requirementAnalystAgent error", error);
    }
  };

  /** 素材生成agent */
  const materialGeneratorAgent = (prompt: string) => {
    return generateText({
      model: modelConfig.chat.gemini3Flash,
      system: MaterialGeneratorPrompt,
      prompt,
      tools: coreTools, // Needs image generation tool and file access
      stopWhen: stepCountIs(20),
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
  };

  /** 游戏代码生成agent */
  const gameCodeGeneratorAgent = (prompt: string) => {
    return generateText({
      model: modelConfig.chat.gemini3Flash,
      system: GameCodeGeneratorPrompt,
      prompt,
      tools: bashTools, // Needs file access to read docs/images and write code
      stopWhen: stepCountIs(20),
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
  };

  /** 核心子Agent工具 */
  const coreSubAgent = {
    /** 游戏需求分析 */
    requirementAnalyst: tool({
      description: "游戏需求分析。输入用户需求，生成 gdd.md, art.md, tech.md。",
      inputSchema: z.object({
        prompt: z.string().describe("游戏需求描述"),
      }),
      execute: async (args) => {
        const result = await requirementAnalystAgent(args.prompt);
        return result?.text;
      },
    }),
    /** 素材生成 */
    materialGenerator: tool({
      description: "素材生成。基于 art.md 生成游戏素材。",
      inputSchema: z.object({
        prompt: z.string().describe("素材描述或指令"),
      }),
      execute: async (args) => {
        const result = await materialGeneratorAgent(args.prompt);
        return result.text;
      },
    }),
    /** 游戏代码生成 */
    gameCodeGenerator: tool({
      description: "游戏代码生成。基于设计文档和素材生成游戏代码。",
      inputSchema: z.object({
        prompt: z.string().describe("游戏代码生成指令"),
      }),
      execute: async (args) => {
        const result = await gameCodeGeneratorAgent(args.prompt);
        return result.text;
      },
    }),
  };

  /** a2ui工具 */
  const a2uiTools = {
    displayGameMockup: tool({
      description:
        "Display a mockup of a game with an image, title, and description.",
      inputSchema: z.object({
        title: z.string().describe("The title of the game"),
        description: z.string().describe("A description of the game"),
        imageUrl: z
          .string()
          .describe("游戏封面图，通常是路径在 images 目录下的 avatar.png")
          .default(`/api/sandbox/${threadId}/images/avatar.png`),
      }),
      execute: async (args) => args,
    }),
    displayGameNumericalSetting: tool({
      description: "title with game information",
      inputSchema: z.object({
        title: z
          .string()
          .describe("The title of the game numerical setting form"),
        initialData: z
          .string()
          .describe(
            "The initial JSON data for the game numerical setting form",
          ),
        dataSchema: z
          .string()
          .describe("The JSON schema for the game numerical setting form")
          .default("create a JSON schema based on the initialData"),
      }),
      execute: async (args) => args,
    }),
  };

  const result = streamText({
    model: modelConfig.chat.gemini2Flash,
    system: `你是一个游戏开发总指挥。你的目标是根据用户输入，指挥团队完成游戏开发。

    必须严格遵守以下工作流，依次调用工具：
    1.  **游戏需求分析 (requirementAnalyst)**: 分析用户需求，生成玩法设计(gdd.md)、素材需求(art.md)、技术方案(tech.md)和2个配置文件（config.json、assert.json），并将art.md、tech.md、gdd.md的内容展示给用户。
    2.  **素材生成 (materialGenerator)**: 根据 assert.json 生成所有需要的游戏图片素材。
    3.  **游戏代码生成 (gameCodeGenerator)**: 根据设计文档和生成的素材，编写 index.html, game.js, style.css。
    4.  **代码产物检测**：使用 bash 工具寻找代码文件（html、css、js），如果不在根目录下，则将文件移动指根目录。
    5.  **游戏数值展示（displayGameNumericalSetting）**：将config.json的内容作为 initialData，生成合适的schema定义，展示游戏数值配置。

    **重要约束**:
    *   工作流中每一步需要用户“确认无误”后方可进入下一步，不能跳跃。
    *   所有工作都在 ./workspace 沙箱中进行（workspace 是每个 thread 所在的父目录，你不必新建 workspace 目录)。
    *   严禁在沙箱外进行 bash 操作。
    *   最后使用 \`displayGameMockup\` 展示成果。

    使用中文与用户交流。
    `,
    // system: "你是一个精通图片生成的专家",
    messages: await convertToModelMessages(messages),
    headers: {
      "X-goog-api-key": "AIzaSyDqKSB-qZh11TzALa14O0R1xYIYAlW0fSY",
    },
    tools: {
      // skill,
      ...coreSubAgent,
      ...coreTools, // Main agent also has access to basic tools if needed
      ...a2uiTools,
    },
    stopWhen: stepCountIs(20),
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
