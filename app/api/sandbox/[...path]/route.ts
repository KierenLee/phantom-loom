import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ path: string[] }> },
) {
  const params = await props.params;
  const filePathParams = params.path || [];

  if (filePathParams.length === 0) {
    return new NextResponse("File path not specified", { status: 400 });
  }

  // 映射到项目根目录下的 workspace 目录
  // 注意：process.cwd() 在 Next.js 中通常是项目根目录
  const workspaceRoot = path.join(process.cwd(), "workspace");
  const relativePath = path.join(...filePathParams);
  // resolve 确保没有 ../.. 等路径穿越
  const fullPath = path.resolve(workspaceRoot, relativePath);

  // 安全检查：确保解析后的路径仍在 workspaceRoot 内
  if (!fullPath.startsWith(workspaceRoot)) {
    return new NextResponse("Access denied", { status: 403 });
  }

  if (!existsSync(fullPath)) {
    return new NextResponse(`File not found: ${relativePath}`, { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    let contentType = "application/octet-stream";
    switch (ext) {
      case ".html":
        contentType = "text/html; charset=utf-8";
        break;
      case ".css":
        contentType = "text/css; charset=utf-8";
        break;
      case ".js":
        contentType = "application/javascript; charset=utf-8";
        break;
      case ".json":
        contentType = "application/json; charset=utf-8";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      case ".ico":
        contentType = "image/x-icon";
        break;
      case ".txt":
        contentType = "text/plain; charset=utf-8";
        break;
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ path: string[] }> },
) {
  const params = await props.params;
  const filePathParams = params.path || [];

  if (filePathParams.length === 0) {
    return new NextResponse("File path not specified", { status: 400 });
  }

  const workspaceRoot = path.join(process.cwd(), "workspace");
  const relativePath = path.join(...filePathParams);
  const fullPath = path.resolve(workspaceRoot, relativePath);

  // 安全检查
  if (!fullPath.startsWith(workspaceRoot)) {
    return new NextResponse("Access denied", { status: 403 });
  }

  // 确保父目录存在
  const dir = path.dirname(fullPath);
  if (!existsSync(dir)) {
    // 如果是 thread 目录不存在，可能需要先创建
    // 简单起见，这里假设 thread 目录由 agent 流程创建，或者我们允许创建
    // 安全起见，只允许在 workspace 下创建目录
    if (dir.startsWith(workspaceRoot)) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  try {
    // 增加读取逻辑
    if (request.url.includes("type=query")) {
      const config = await fs.readFile(fullPath, "utf-8");
      return new NextResponse(config, { status: 200 });
    }
    const contentType = request.headers.get("content-type") || "";
    let content: string | Buffer;

    if (contentType.includes("application/json")) {
      const json = await request.json();
      content = JSON.stringify(json, null, 2);
    } else if (contentType.includes("text/")) {
      content = await request.text();
    } else {
      // 默认作为 buffer 处理
      const arrayBuffer = await request.arrayBuffer();
      content = Buffer.from(arrayBuffer);
    }

    await fs.writeFile(fullPath, content);
    return new NextResponse("File saved successfully", { status: 200 });
  } catch (error) {
    console.error("Error writing file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
