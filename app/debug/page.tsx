"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { PreviewPanel } from "@/components/assistant-ui/preview-panel";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useEffect, useState } from "react";
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

const STORAGE_KEY = "phantom_loom_api_url";

/**
 * Debug 页面组件
 * 包含聊天界面、预览面板和 API 设置
 */
const Page = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState("/api/chat");
  const [threadId, setThreadId] = useState("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("thread_id");
      if (!id) {
        id = Math.random().toString(36).substring(7);
        sessionStorage.setItem("thread_id", id);
      }
      setThreadId(id);

      const storedApi = localStorage.getItem(STORAGE_KEY);
      setApiBaseUrl(storedApi || "/api/chat");
    }
  }, []);

  // 计算最终使用的 API URL
  const getApiUrl = () => {
    let currentBaseUrl = apiBaseUrl;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        currentBaseUrl = stored;
      }
    }

    const separator = currentBaseUrl.includes("?") ? "&" : "?";
    const urlWithThread = `${currentBaseUrl}${separator}threadId=${threadId}`;

    // 如果是完整 URL (http/https)，使用代理
    if (
      currentBaseUrl.startsWith("http://") ||
      currentBaseUrl.startsWith("https://")
    ) {
      return `/api/proxy?url=${encodeURIComponent(urlWithThread)}`;
    }

    return urlWithThread;
  };

  const runtime = useChatRuntime({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new AssistantChatTransport({
      api: getApiUrl(),
    }),
  });

  const handleSaveApi = () => {
    localStorage.setItem(STORAGE_KEY, apiBaseUrl);
    window.location.reload();
  };

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
            </DialogContent>
          </Dialog>
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
