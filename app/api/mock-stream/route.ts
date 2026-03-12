import { a2uiMessage, secoMessage } from "./message";

export const dynamic = "force-dynamic";

/**
 * Mock API that returns a text/event-stream response with predefined data.
 * This simulates a tool call response for "displayGameMockup".
 */
export async function POST(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const messages = [...secoMessage];

      for (const msg of messages) {
        controller.enqueue(encoder.encode(msg + "\n\n"));
        // Add a small delay to simulate streaming
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      // 允许所有跨域请求
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function GET(req: Request) {
  return POST(req);
}
