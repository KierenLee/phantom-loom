"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { GameCard } from "@/components/assistant-ui/game-card";
import { GameNumericalSetting } from "@/components/assistant-ui/game-numerical-setting";
import { PreviewPanel } from "@/components/assistant-ui/preview-panel";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useMemo } from "react";
import { Ghost } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Page = () => {
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
      api: `/api/evaluation?threadId=${threadId}`,
    }),
  });

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
              <p className="max-w-xs">游戏的质量评估助手</p>
            </TooltipContent>
          </Tooltip>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Thread />
          </div>
          <PreviewPanel />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};

export default Page;
