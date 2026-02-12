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
import { Sandbox } from "@vercel/sandbox";
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

/** 进程内存缓存：threadId → sandboxId，避免重复读文件 */
const sandboxIdCache = new Map<string, string>();

/** 持久化文件路径：/tmp/sandbox-thread-map.json */
const SANDBOX_MAP_FILE = "/tmp/sandbox-thread-map.json";

/** 从文件加载 threadId → sandboxId 映射 */
function loadSandboxMap(): Record<string, string> {
  try {
    if (fs.existsSync(SANDBOX_MAP_FILE)) {
      return JSON.parse(fs.readFileSync(SANDBOX_MAP_FILE, "utf-8"));
    }
  } catch {
    // ignore corrupt file
  }
  return {};
}

/** 将 threadId → sandboxId 持久化写入文件 */
function saveSandboxMap(map: Record<string, string>) {
  try {
    fs.writeFileSync(SANDBOX_MAP_FILE, JSON.stringify(map, null, 2), "utf-8");
  } catch (e) {
    console.warn("[Sandbox] Failed to persist sandbox map:", e);
  }
}

const SANDBOX_PREVIEW_PORT = 3011;
const SANDBOX_CREDENTIALS = {
  teamId: process.env.VERCEL_TEAM_ID!,
  projectId: process.env.VERCEL_PROJECT_ID!,
  token: process.env.VERCEL_TOKEN!,
};

/**
 * 根据 threadId 获取或创建沙箱：
 * 1. 先查进程内存缓存
 * 2. 再查持久化文件（/tmp/sandbox-thread-map.json）
 * 3. 用 sandboxId 调 Sandbox.get 验证沙箱是否仍在 running 状态
 * 4. 以上均失败则创建新沙箱，并更新缓存
 */
async function getOrCreateSandbox(threadId: string): Promise<{
  sandbox: Sandbox;
  isNew: boolean;
}> {
  // 1. 先查进程内存缓存
  let sandboxId = sandboxIdCache.get(threadId);

  // 2. 缓存未命中时查持久化文件
  if (!sandboxId) {
    const map = loadSandboxMap();
    sandboxId = map[threadId];
    if (sandboxId) {
      sandboxIdCache.set(threadId, sandboxId); // 写回内存缓存
    }
  }

  // 3. 有 sandboxId 时尝试恢复已有沙箱
  if (sandboxId) {
    try {
      console.log(`[Sandbox] threadId=${threadId} → 尝试恢复沙箱 ${sandboxId}`);
      const existing = await Sandbox.get({
        sandboxId,
        ...SANDBOX_CREDENTIALS,
      });
      if (existing.status === "running" || existing.status === "pending") {
        console.log(
          `[Sandbox] 复用已有沙箱 ${sandboxId}，状态: ${existing.status}`,
        );
        return { sandbox: existing, isNew: false };
      }
      console.log(
        `[Sandbox] 沙箱 ${sandboxId} 状态为 ${existing.status}，需要重新创建`,
      );
    } catch (e) {
      console.warn(`[Sandbox] 恢复沙箱 ${sandboxId} 失败，将创建新沙箱:`, e);
    }
  }

  // 4. 创建新沙箱
  console.log(`[Sandbox] threadId=${threadId} → 创建新沙箱`);
  const sandbox = await Sandbox.create({
    timeout: 900000, // 15 minutes
    ...SANDBOX_CREDENTIALS,
    ports: [SANDBOX_PREVIEW_PORT],
  });

  // 更新内存缓存和持久化文件
  sandboxIdCache.set(threadId, sandbox.sandboxId);
  const map = loadSandboxMap();
  map[threadId] = sandbox.sandboxId;
  saveSandboxMap(map);
  console.log(
    `[Sandbox] 新沙箱已创建: ${sandbox.sandboxId}，已绑定 threadId=${threadId}`,
  );

  return { sandbox, isNew: true };
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

  // 获取或复用沙箱
  const { sandbox: vercelSandbox, isNew } = await getOrCreateSandbox(threadId);

  const { tools: bashTools } = await createBashTool({
    // files,
    // extraInstructions: instructions,
    sandbox: vercelSandbox,
  });

  // 新沙箱才需要启动 HTTP 服务器；已有沙箱服务器已在运行
  if (isNew) {
    await vercelSandbox.runCommand({
      cmd: "python3",
      args: ["-m", "http.server", String(SANDBOX_PREVIEW_PORT)],
      cwd: "/vercel/sandbox",
      detached: true,
    });
    console.log(`[Sandbox] HTTP 服务器已在端口 ${SANDBOX_PREVIEW_PORT} 启动`);
  }

  const sandboxPreviewUrl = vercelSandbox.domain(SANDBOX_PREVIEW_PORT);
  console.log("[Sandbox] Preview URL:", sandboxPreviewUrl);

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
            const buffer = Buffer.from(imageData!, "base64");

            // 写入沙箱文件系统
            const sandboxImagePath = `/vercel/sandbox/images/${name}.png`;
            await vercelSandbox.writeFiles([
              { path: sandboxImagePath, content: buffer },
            ]);

            // 返回相对于 HTTP 服务器根目录（/vercel/sandbox）的访问路径
            return {
              success: true,
              imagePath: `/vercel/sandbox/images/${name}.png`,
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
      execute: async (args) => ({
        ...args,
        sandboxData: {
          url: `${sandboxPreviewUrl}/index.html`,
          sessionId: "",
          configUrl: `/api/sandbox/${threadId}/config.json?type=query`,
        },
      }),
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
      execute: async (args) => ({
        ...args,
        sandboxData: {
          url: `${sandboxPreviewUrl}/index.html`,
          sessionId: "",
          configUrl: `/api/sandbox/${threadId}/config.json?type=query`,
        },
      }),
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
