"use client";
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
import { Thread } from "@/components/assistant-ui/thread";
import { PreviewPanel } from "@/components/assistant-ui/preview-panel";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { memo, useEffect, useState } from "react";
import { Ghost, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSessionId } from "@/lib/utils";

const STORAGE_KEY = "phantom_loom_api_url";

const RemoteApiUrl = memo(() => {
  const [apiBaseUrl, setApiBaseUrl] = useState("/api/chat");

  useEffect(() => {
    const storedApi = localStorage.getItem(STORAGE_KEY);
    setApiBaseUrl(storedApi || "/api/chat");
  }, []);

  const handleSaveApi = () => {
    localStorage.setItem(STORAGE_KEY, apiBaseUrl);
    window.location.reload();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="api-url" className="text-sm font-medium">
          API URL
        </label>
        <Input
          id="api-url"
          value={apiBaseUrl}
          onChange={(e) => setApiBaseUrl(e.target.value)}
          placeholder="/api/chat"
        />
        <p className="text-sm text-muted-foreground">
          支持本地路径 (如 /api/chat) 或完整 URL (如 https://...)。
        </p>
        <Button onClick={handleSaveApi} className="w-full">
          确认并重载
        </Button>
      </div>
    </div>
  );
});

// 计算最终使用的 API URL
const getApiUrl = () => {
  let currentBaseUrl = "";
  let threadId = "default";
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      currentBaseUrl = stored;
    }

    threadId = getSessionId();
  }

  const separator = currentBaseUrl.includes("?") ? "&" : "?";
  const urlWithThread = `${currentBaseUrl}${separator}threadId=${threadId}`;

  // 如果是完整 URL (http/https)，使用代理
  if (
    currentBaseUrl.startsWith("http://") ||
    currentBaseUrl.startsWith("https://")
  ) {
    return urlWithThread;
  }

  return urlWithThread;
};

/**
 * Debug 页面组件
 * 包含聊天界面、预览面板和 API 设置
 */
const Page = memo(() => {
  const { isOpen } = usePreviewStore();

  const runtime = useChatRuntime({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new AssistantChatTransport({
      api: getApiUrl(),
      prepareSendMessagesRequest: (request) => {
        const sessionId = getSessionId();
        return {
          ...request,
          body: request.body || {},
          headers: {
            ...request.headers,
            "custom-session-id": sessionId || "",
          },
        };
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
                <p className="max-w-xs">游戏的质量评估助手</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="设置 API">
                <Settings className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>设置 API Endpoint</DialogTitle>
              </DialogHeader>
              <RemoteApiUrl />
            </DialogContent>
          </Dialog>
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
