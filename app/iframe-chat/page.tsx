"use client";
import { ModeToggle } from "@/components/mode-toggle";

import { IframeThread } from "@/components/assistant-ui/iframe-thread";
import { IframeMessageTool } from "@/components/assistant-ui/iframe-message-tool";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { memo, useEffect, useState } from "react";
import { MessageSquare, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSessionId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const DEFAULT_API_URL = "/api/mock-stream";

interface HostMessage {
  type: string;
  data: any;
  source: string;
}

interface ReceivedMessage extends HostMessage {
  id: string;
  receivedAt: number;
}

/**
 * Iframe 嵌入的 Agent Chat 页面
 * 包含聊天界面和 postMessage 工具，用于与宿主编辑器通信
 */
const Page = memo(() => {
  const [receivedMessages, setReceivedMessages] = useState<ReceivedMessage[]>(
    [],
  );
  const [showMessageList, setShowMessageList] = useState(false);

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: DEFAULT_API_URL,
      headers: {
        "custom-session-id": getSessionId(),
        "x-tt-env": "ppe_csj_game_agent",
        "X-use-ppe": "1",
      },
    }),
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as HostMessage;

      if (message.source !== "stylex-editor") {
        return;
      }

      const receivedMessage: ReceivedMessage = {
        ...message,
        id: Date.now().toString(),
        receivedAt: Date.now(),
      };

      setReceivedMessages((prev) => [receivedMessage, ...prev]);

      handleHostMessage(message);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleHostMessage = (message: HostMessage) => {
    switch (message.type) {
      case "debug-message":
        console.log("[Seco] 收到调试消息:", message);
        break;
      default:
        console.log("[Seco] 收到未知类型消息:", message);
    }
  };

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-dvh w-full flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            <Tooltip>
              <TooltipTrigger asChild>
                <h1 className="cursor-help font-semibold">Seco</h1>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Seco 助手。作为 iframe 嵌入到编辑器中，通过 postMessage
                  与宿主通信。
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowMessageList(!showMessageList)}
                  className="relative rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <Bell className="size-5" />
                  {receivedMessages.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs"
                    >
                      {receivedMessages.length}
                    </Badge>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>收到的宿主消息</p>
              </TooltipContent>
            </Tooltip>
            <ModeToggle />
          </div>
        </header>

        {showMessageList && (
          <div className="border-b bg-background/95 px-4 py-3 backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">收到的宿主消息</h3>
              <button
                onClick={() => setReceivedMessages([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                清空
              </button>
            </div>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {receivedMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无消息</p>
              ) : (
                receivedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-lg border bg-card p-3 text-sm"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium">{msg.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.receivedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="overflow-x-auto text-xs text-muted-foreground">
                      {JSON.stringify(msg.data, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <IframeThread />
            <IframeMessageTool />
          </div>
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
});

export default Page;
