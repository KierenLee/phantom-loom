export const dynamic = "force-dynamic";

/**
 * Mock API that returns a text/event-stream response with predefined data.
 * This simulates a tool call response for "displayGameMockup".
 */
export async function POST(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const messages = [
        // 'data: {"type":"start"}',
        // 'data: {"type":"start-step"}',
        // 'data: {"type":"text-start","id":"0"}',
        // 'data: {"type":"tool-input-start","toolCallId":"call_bsts03as1oaac7irnzrbrrcz","toolName":"displayGameMockup"}',
        // 'data: {"type":"tool-input-available","toolCallId":"call_bsts03as1oaac7irnzrbrrcz","toolName":"displayGameMockup","input":{"title":"赛博打砖块","description":"一款充满未来科技感的打砖块游戏，绚丽的粒子特效带来极致的视觉冲击！控制霓虹挡板，击碎层层砖块，体验畅快的破坏美学。","imageUrl":"file:///home/tiger/images/avatar.png","sandboxData":{"url":"https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/index.html","sessionId":"v1-alvbqcnx-agoeavww4j52bd7jih2ad5dgku","configUrl":" `https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/config.json` "}}}',
        // 'data: {"type":"tool-output-available","toolCallId":"call_bsts03as1oaac7irnzrbrrcz","output":{"title":"赛博打砖块","description":"一款充满未来科技感的打砖块游戏，绚丽的粒子特效带来极致的视觉冲击！控制霓虹挡板，击碎层层砖块，体验畅快的破坏美学。","imageUrl":"file:///home/tiger/images/avatar.png","sandboxData":{"url":" `https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/index.html` ","sessionId":"v1-alvbqcnx-agoeavww4j52bd7jih2ad5dgku","configUrl":" `https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/config.json` "}}}',
        // 'data: {"type":"text-end","id":"0"}',
        // 'data: {"type":"finish-step"}',
        // 'data: {"type":"finish","finishReason":"tool-calls"}',
        // "data: [DONE]",
        'data: {"type":"start"}',
        'data: {"type":"start-step"}',

        'data: {"type":"start-step"}',
        'data: {"type":"text-start","id":"0"}',
        'data: {"type":"tool-input-start","toolCallId":"call_88pop2z138ayb3vzk0jicgd4","toolName":"write_todos"}',
        'data: {"type":"tool-input-delta","toolCallId":"call_88pop2z138ayb3vzk0jicgd4","inputTextDelta":"Updated todo list to [{\\"content\\":\\"读取/home/tiger/u86l8o/docs/art.md文档内容\\",\\"status\\":\\"completed\\"},{\\"content\\":\\"解析文档中的素材需求，生成资产索引JSON结构\\",\\"status\\":\\"completed\\"},{\\"content\\":\\"遍历资产索引，为每个素材调用generate_image_1k生成复古风格图片\\",\\"status\\":\\"in_progress\\"},{\\"content\\":\\"更新资产索引中的image_url字段为实际生成的图片路径\\",\\"status\\":\\"pending\\"},{\\"content\\":\\"生成交付报告，列出所有成功/失败的素材\\",\\"status\\":\\"pending\\"}]"}',
        'data: {"toolName":"write_todos","input":"Updated todo list to [{\\"content\\":\\"读取/home/tiger/u86l8o/docs/art.md文档内容\\",\\"status\\":\\"completed\\"},{\\"content\\":\\"解析文档中的素材需求，生成资产索引JSON结构\\",\\"status\\":\\"completed\\"},{\\"content\\":\\"遍历资产索引，为每个素材调用generate_image_1k生成复古风格图片\\",\\"status\\":\\"in_progress\\"},{\\"content\\":\\"更新资产索引中的image_url字段为实际生成的图片路径\\",\\"status\\":\\"pending\\"},{\\"content\\":\\"生成交付报告，列出所有成功/失败的素材\\",\\"status\\":\\"pending\\"}]","type":"tool-input-available","toolCallId":"call_88pop2z138ayb3vzk0jicgd4"}',
        'data: {"output":"Updated todo list to [{\\"content\\":\\"读取/home/tiger/u86l8o/docs/art.md文档内容\\",\\"status\\":\\"completed\\"},{\\"content\\":\\"解析文档中的素材需求，生成资产索引JSON结构\\",\\"status\\":\\"completed\\"},{\\"content\\":\\"遍历资产索引，为每个素材调用generate_image_1k生成复古风格图片\\",\\"status\\":\\"in_progress\\"},{\\"content\\":\\"更新资产索引中的image_url字段为实际生成的图片路径\\",\\"status\\":\\"pending\\"},{\\"content\\":\\"生成交付报告，列出所有成功/失败的素材\\",\\"status\\":\\"pending\\"}]","type":"tool-output-available","toolCallId":"call_88pop2z138ayb3vzk0jicgd4"}',
        'data: {"type":"text-end","id":"0"}',

        'data: {"id":"0","type":"text-start"}',
        'data: {"type":"text-delta","id":"0","delta":"成了"}',
        'data: {"type":"text-delta","id":"0","delta":"。"}',
        'data: {"type":"text-end","id":"0"}',

        'data: {"type":"text-start","id":"0"}',
        'data: {"type":"tool-input-start","toolCallId":"call_bsts03as1oaac7irnzrbrrcz","toolName":"displayGameMockup"}',
        'data: {"type":"tool-input-available","toolCallId":"call_bsts03as1oaac7irnzrbrrcz","toolName":"displayGameMockup","input":{"title":"赛博打砖块","description":"一款充满未来科技感的打砖块游戏，绚丽的粒子特效带来极致的视觉冲击！控制霓虹挡板，击碎层层砖块，体验畅快的破坏美学。","imageUrl":"file:///home/tiger/images/avatar.png","sandboxData":{"url":"https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/index.html","sessionId":"v1-alvbqcnx-agoeavww4j52bd7jih2ad5dgku","configUrl":" `https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/config.json` "}}}',
        'data: {"type":"tool-output-available","toolCallId":"call_bsts03as1oaac7irnzrbrrcz","output":{"title":"赛博打砖块","description":"一款充满未来科技感的打砖块游戏，绚丽的粒子特效带来极致的视觉冲击！控制霓虹挡板，击碎层层砖块，体验畅快的破坏美学。","imageUrl":"file:///home/tiger/images/avatar.png","sandboxData":{"url":" `https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/index.html` ","sessionId":"v1-alvbqcnx-agoeavww4j52bd7jih2ad5dgku","configUrl":" `https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/config.json` "}}}',
        'data: {"type":"text-end","id":"0"}',

        'data: {"type":"finish-step"}',
        'data: {"type":"finish","finishReason":"tool-calls"}',

        "data: [DONE]",
      ];

      for (const msg of messages) {
        controller.enqueue(encoder.encode(msg + "\n\n"));
        // Add a small delay to simulate streaming
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function GET(req: Request) {
  return POST(req);
}
