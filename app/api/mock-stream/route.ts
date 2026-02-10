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

        'data: {"id":"0","type":"text-start"}',

        'data: {"toolCallId":"call_awtama06iktyj05l7f3doaed","toolName":"displayGameNumericalSetting","type":"tool-input-start"}',
        'data: {"input":{"initialData":"{}","title":"打砖块大冒险 - 游戏数值配置","description":"这是游戏的核心数值配置文件，包含了游戏所有可调整的参数。您可以通过修改这些数值来改变游戏的难度、体验和视觉效果。","dataSchema":"{  type: object,  title: 打砖块大冒险 - 游戏配置,  properties: {    game: {      type: object,      title: 游戏基础设置,      properties: {        title: {          type: string,          title: 游戏标题        }}}","link":"https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/config.json","sandboxData":{"url":"https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/index.html","sessionId":"v1-alvbqcnx-agoeavww4j52bd7jih2ad5dgku","configUrl":"`https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/config.json` "}},"toolCallId":"call_awtama06iktyj05l7f3doaed","toolName":"displayGameNumericalSetting","type":"tool-input-available"}',
        'data: {"output":{"initialData":"{}","title":"打砖块大冒险 - 游戏数值配置","description":"这是游戏的核心数值配置文件，包含了游戏所有可调整的参数。您可以通过修改这些数值来改变游戏的难度、体验和视觉效果。","dataSchema":"{  type: object,  title: 打砖块大冒险 - 游戏配置,  properties: {    game: {      type: object,      title: 游戏基础设置,      properties: {        title: {          type: string,          title: 游戏标题        }}}","link":"https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/config.json","sandboxData":{"url":"https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/index.html","sessionId":"v1-alvbqcnx-agoeavww4j52bd7jih2ad5dgku","configUrl":"`https://debugport-8089-v1-alvbqcnx-agodmazmf53wxhgbqvzel3zkzu.cn-north.ai-sandbox-boe.byted.org/config.json` "}},"toolCallId":"call_awtama06iktyj05l7f3doaed","toolName":"displayGameNumericalSetting","type":"tool-output-available"}',
        'data: {"id":"0","type":"text-end"}',

        'data: {"type":"finish-step"}',

        'data: {"finishReason":"tool-calls","type":"finish"}',

        "data: [DONE]",
      ];

      for (const msg of messages) {
        controller.enqueue(encoder.encode(msg + "\n\n"));
        // Add a small delay to simulate streaming
        await new Promise((resolve) => setTimeout(resolve, 200));
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
