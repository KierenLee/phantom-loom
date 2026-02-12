import { SANDBOX_PREVIEW_PORT } from "@/constants/sandbox";
import { Sandbox } from "@vercel/sandbox";
import fs from "fs";

/** 持久化文件路径：/tmp/sandbox-thread-map.json */
const SANDBOX_MAP_FILE = "/tmp/sandbox-thread-map.json";

export const SANDBOX_CREDENTIALS = {
  teamId: process.env.VERCEL_TEAM_ID!,
  projectId: process.env.VERCEL_PROJECT_ID!,
  token: process.env.VERCEL_TOKEN!,
};

/** 进程内存缓存：threadId → sandboxId，避免重复读文件 */
export const sandboxIdCache = new Map<string, string>();

/** 从文件加载 threadId → sandboxId 映射 */
export function loadSandboxMap(): Record<string, string> {
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
export function saveSandboxMap(map: Record<string, string>) {
  try {
    fs.writeFileSync(SANDBOX_MAP_FILE, JSON.stringify(map, null, 2), "utf-8");
  } catch (e) {
    console.warn("[Sandbox] Failed to persist sandbox map:", e);
  }
}

/**
 * 根据 threadId 获取或创建沙箱：
 * 1. 先查进程内存缓存
 * 2. 再查持久化文件（/tmp/sandbox-thread-map.json）
 * 3. 用 sandboxId 调 Sandbox.get 验证沙箱是否仍在 running 状态
 * 4. 以上均失败则创建新沙箱，并更新缓存
 */
export async function getOrCreateSandbox(threadId: string): Promise<{
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
    timeout: 1200000, // 20 minutes
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
 * 根据 sandboxId 直接获取沙箱实例（不创建新沙箱）
 */
export async function getSandboxById(sandboxId: string): Promise<Sandbox> {
  return Sandbox.get({ sandboxId, ...SANDBOX_CREDENTIALS });
}
