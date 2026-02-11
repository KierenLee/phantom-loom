"use client";
import { getSessionId } from "@/lib/utils";

import { X } from "lucide-react";
import { usePreviewStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRequest } from "ahooks";

export const PreviewPanel = () => {
  const { previewUrl, title, isOpen, sandboxData, closePreview } =
    usePreviewStore();
  const [iframeKey, setIframeKey] = useState(0);
  const [lastConfig, setLastConfig] = useState<string>("");

  useRequest(
    async () => {
      if (!isOpen) return;

      const threadId = sessionStorage.getItem("thread_id");
      if (!threadId) return;

      const previewUrlWithSessionId =
        sandboxData?.configUrl ||
        `/api/sandbox/${threadId}/config.json?type=query`;

      try {
        const res = await fetch(previewUrlWithSessionId, {
          headers: {
            "Content-Type": "application/json",
            "custom-session-id": getSessionId(),
          },
        });
        if (res.ok) {
          const text = await res.text();
          // Initialize lastConfig on first load without triggering reload
          if (lastConfig === "") {
            setLastConfig(text);
            return;
          }

          if (text !== lastConfig) {
            setLastConfig(text);
            setIframeKey((prev) => prev + 1);
            console.log("Config changed, reloading preview...");
          }
        }
      } catch (e) {
        console.error("Polling config failed", e);
      }
    },
    {
      refreshDeps: [isOpen],
      pollingInterval: isOpen ? 2000 : 0,
      pollingWhenHidden: false,
    },
  );

  useEffect(() => {
    if (!isOpen) {
      setLastConfig("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="flex h-full w-[600px] shrink-0 flex-col border-l border-border bg-background shadow-xl transition-all duration-300 ease-in-out xl:w-[800px]">
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <h3 className="truncate font-semibold text-foreground">
          {title || "预览"}
        </h3>
        <Button variant="ghost" size="icon" onClick={closePreview}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden bg-muted/10">
        {previewUrl ? (
          <iframe
            key={iframeKey}
            src={previewUrl}
            className="h-full w-full border-0"
            title={title || "预览"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            暂无预览内容
          </div>
        )}
      </div>
    </div>
  );
};
