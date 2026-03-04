"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { usePreviewStore } from "@/lib/store";

import { GameCard } from "@/components/assistant-ui/game-card";
import { GameNumericalSetting } from "@/components/assistant-ui/game-numerical-setting";
import { ImageTool } from "@/components/assistant-ui/image-tool";
import { GameNumericalSettingSidebar } from "@/components/assistant-ui/game-numerical-setting/sidebar";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "./components/thread";
import { PreviewPanel } from "@/components/assistant-ui/preview-panel";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { memo } from "react";
import { Ghost } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSessionId } from "@/lib/utils";

const DEFAULT_API_URL = //"/api/mock-stream";
  "http://[fdbd:dc02:ff:fd00:c:387:17:2e92]:6789/game_agent/api/generate";

/**
 * Debug 页面组件
 * 包含聊天界面、预览面板和 API 设置
 */
const Page = memo(() => {
  const { isOpen } = usePreviewStore();

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

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-dvh w-full flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <Ghost className="size-5" />
            <Tooltip>
              <TooltipTrigger asChild>
                <h1 className="cursor-help font-semibold">Phantom Loom</h1>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  幻影织机。将 AI
                  比作一台织布机，将代码（丝线）编织成肉眼可见的虚拟幻象（游戏）。
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Thread />
            <GameCard />
            <ImageTool />
            <GameNumericalSetting />
          </div>
          <GameNumericalSettingSidebar />
          {isOpen ? <PreviewPanel /> : null}
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
});

export default Page;
