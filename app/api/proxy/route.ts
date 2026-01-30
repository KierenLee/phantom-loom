import { NextRequest } from "next/server";

/**
 * 转发请求到目标 URL
 * @param req NextRequest 对象
 * @returns 转发后的响应
 */
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const body = await req.json();
    
    // 转发请求到目标 URL
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 可以根据需要转发其他 header
      },
      body: JSON.stringify(body),
    });

    // 返回流式响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(`Error proxying request: ${error}`, { status: 500 });
  }
}
