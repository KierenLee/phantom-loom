"use client";

import {
  makeAssistantToolUI,
  useAssistantApi,
  useAssistantState,
} from "@assistant-ui/react";
import { SandboxData, usePreviewStore } from "@/lib/store";
import { useEffect } from "react";
import { useMount } from "ahooks";

interface GameCardArgs {
  title: string;
  description: string;
  imageUrl: string;
  sandboxData?: SandboxData;
}

type GameCardResult = GameCardArgs;

const GameCardView = ({ result }: { result: GameCardResult }) => {
  const { setPreview, setSandboxData } = usePreviewStore();

  const getPreviewUrl = () => {
    return `/api/sandbox/${sessionStorage.getItem("thread_id")}/index.html`;
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = result.sandboxData?.url || getPreviewUrl();
    if (url) {
      setPreview(url, result.title);
    }
  };

  useEffect(() => {
    if (result.sandboxData) {
      setSandboxData(result.sandboxData);
      console.log("🛠️[debug] GameCardView args", result);
    }
  }, [result.sandboxData, setSandboxData]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.imageUrl || "/images/gameCardPlaceholder.jpeg"}
          alt={result.title}
          className="aspect-video w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {result.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {result.description}
        </p>
      </div>
      {
        <div className="flex justify-center">
          <button
            onClick={handlePreview}
            className="inline-block cursor-pointer rounded-md bg-primary px-14 py-2 text-center text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            启动 🚀
          </button>
        </div>
      }
    </div>
  );
};

/**
 * A component that displays a game card with an image, title, and description.
 * This is used as a tool UI for the 'display_game_mockup' tool.
 */
export const GameCard = makeAssistantToolUI<GameCardArgs, GameCardResult>({
  toolName: "displayGameMockup",
  render: ({ result }) =>
    result ? <GameCardView result={result} /> : <div>游戏卡片未生成</div>,
});
