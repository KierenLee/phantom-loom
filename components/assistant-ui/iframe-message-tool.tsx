"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface IframeMessageArgs {
  data: Record<string, any>;
  messageType?: string;
}

interface IframeMessageResult {
  success: boolean;
  message: string;
  timestamp?: number;
}

const IframeMessageToolView = ({
  args,
  result,
}: {
  args: IframeMessageArgs;
  result?: IframeMessageResult;
}) => {
  const [sendStatus, setSendStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const sendPostMessage = useCallback(() => {
    setSendStatus("sending");
    setStatusMessage("正在发送消息...");

    try {
      const messagePayload = {
        type: args.messageType || "iframe-tool-message",
        data: args.data || {
          presets: {},
          menus: [],
          formPanels: [],
          formConfigs: {},
          canvas: {},
          presetEvents: {},
          globalConfigs: {},
        },
        timestamp: Date.now(),
        source: "phantom-loom-iframe",
      };

      window.parent.postMessage(messagePayload, "*");
      setSendStatus("success");
      setStatusMessage("消息已成功发送到宿主");
    } catch (error) {
      setSendStatus("error");
      setStatusMessage(
        `发送失败: ${error instanceof Error ? error.message : "未知错误"}`,
      );
    }
  }, [args]);

  useEffect(() => {
    if (!result && sendStatus === "idle") {
      sendPostMessage();
    }
  }, [result, sendStatus, sendPostMessage]);

  if (!result) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          {sendStatus === "sending" && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
          {sendStatus === "success" && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {sendStatus === "error" && (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <p className="text-sm font-medium text-foreground">{statusMessage}</p>
        </div>
        <div className="mt-2">
          <p className="mb-1 text-xs text-muted-foreground">消息数据:</p>
          <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
            {JSON.stringify(args.data, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {result.success ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <p className="text-sm font-medium text-foreground">{result.message}</p>
      </div>
      {result.timestamp && (
        <p className="text-xs text-muted-foreground">
          时间: {new Date(result.timestamp).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export const IframeMessageTool = makeAssistantToolUI<
  IframeMessageArgs,
  IframeMessageResult
>({
  toolName: "iframeMessageTool",
  render: ({ args, result }) => (
    <IframeMessageToolView args={args} result={result} />
  ),
});
