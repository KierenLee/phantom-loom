import { NextRequest, NextResponse } from "next/server";
import { getSandboxById } from "@/lib/sandbox";
import { SANDBOX_WORKSPACE_PATH } from "@/constants/sandbox";

/**
 * POST /api/sandbox/write/file
 *
 * 向 Vercel Sandbox 指定路径写入文件内容。
 *
 * Request Body (JSON):
 * {
 *   sandboxId: string        // Vercel Sandbox ID
 *   filePath:  string        // 沙箱内文件路径，相对路径会自动补全为 workspace 绝对路径
 *                            // 例如："config.json" → "/vercel/sandbox/workspace/config.json"
 *                            // 绝对路径直接使用："/vercel/sandbox/workspace/config.json"
 *   content:   string        // 文件内容（UTF-8 字符串）
 * }
 *
 * Response:
 *   200 { success: true, path: string }
 *   400 { error: string }
 *   500 { error: string }
 */
export async function POST(req: NextRequest) {
  let body: { sandboxId?: string; filePath?: string; content?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { sandboxId, filePath, content } = body;

  if (!sandboxId || typeof sandboxId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid field: sandboxId" },
      { status: 400 },
    );
  }
  if (!filePath || typeof filePath !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid field: filePath" },
      { status: 400 },
    );
  }
  if (content === undefined || content === null) {
    return NextResponse.json(
      { error: "Missing field: content" },
      { status: 400 },
    );
  }

  // 相对路径自动补全为 workspace 绝对路径
  const absolutePath = filePath.startsWith("/")
    ? filePath
    : `${SANDBOX_WORKSPACE_PATH}/${filePath}`;

  try {
    const sandbox = await getSandboxById(sandboxId);

    if (sandbox.status !== "running" && sandbox.status !== "pending") {
      return NextResponse.json(
        { error: `Sandbox is not running (status: ${sandbox.status})` },
        { status: 409 },
      );
    }

    await sandbox.writeFiles([
      { path: absolutePath, content: Buffer.from(content, "utf-8") },
    ]);

    console.log(
      `[Sandbox Write] sandboxId=${sandboxId} filePath=${absolutePath} (${content.length} bytes)`,
    );

    return NextResponse.json({ success: true, path: absolutePath });
  } catch (e) {
    console.error("[Sandbox Write] Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 },
    );
  }
}
