"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { GameCard } from "@/components/assistant-ui/game-card";
import { GameNumericalSetting } from "@/components/assistant-ui/game-numerical-setting";
import { GameNumericalSettingSidebar } from "@/components/assistant-ui/game-numerical-setting/sidebar";
import { PreviewPanel } from "@/components/assistant-ui/preview-panel";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useMemo } from "react";
import { Ghost } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageTool } from "@/components/assistant-ui/image-tool";
import { usePreviewStore } from "@/lib/store";
import { ModeToggle } from "@/components/mode-toggle";

export const Assistant = () => {
  const threadId = useMemo(() => {
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("thread_id");
      if (!id) {
        id = Math.random().toString(36).substring(7);
        sessionStorage.setItem("thread_id", id);
      }
      return id;
    }
    return "default";
  }, []);

  const runtime = useChatRuntime({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new AssistantChatTransport({
      api: `/api/chat?threadId=${threadId}`,
    }),
  });

  const { isOpen } = usePreviewStore();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-dvh w-full flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
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
          <div className="ml-auto">
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
};
