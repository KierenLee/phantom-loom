"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import Image from "next/image";

interface ImageGenerationArgs {
  prompt: string;
  aspectRatio: string;
}

interface ImageGenerationResult {
  success: boolean;
  imageUrl: string;
  imagePath?: string;
  revisedPrompt: string;
  message: string;
}

// TODO: 支持多个图片同时展示，作为素材库预览，提升展示效率
const ImageToolView = ({
  args,
  result,
}: {
  args: ImageGenerationArgs;
  result?: ImageGenerationResult;
}) => {
  if (!result) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-foreground">正在生成图片...</p>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {args.prompt}
        </p>
      </div>
    );
  }

  if (!result.success) {
    // 展示 result.message
    return (
      <div className="flex w-full max-w-sm flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-success border-2 border-success border-t-transparent" />
          <p className="text-sm font-medium text-foreground">{result.message}</p>
        </div>
      </div>
    )
  }

  // 构建预览 URL：使用 /api/sandbox 路由
  // 如果 result.imagePath 存在，则使用它；否则尝试从 result.imageUrl 解析（兼容旧数据）
  const imageSrc = result.imagePath
    ? `/api/sandbox/${result.imagePath}`
    : null;

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="overflow-hidden rounded-lg bg-muted">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={result.revisedPrompt || args.prompt}
            className="w-full object-contain"
            style={{
                aspectRatio: args.aspectRatio === "16:9" ? "16/9" : args.aspectRatio === "9:16" ? "9/16" : "1/1",
            }}
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
            图片路径无效
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Prompt</p>
        <p className="text-sm text-foreground">{result.revisedPrompt || args.prompt}</p>
      </div>
    </div>
  );
};

export const ImageTool = makeAssistantToolUI<
  ImageGenerationArgs,
  ImageGenerationResult
>({
  toolName: "imageGenerationTool",
  render: ({ args, result }) => <ImageToolView args={args} result={result} />,
});
