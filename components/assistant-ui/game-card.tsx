"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { usePreviewStore } from "@/lib/store";

interface GameCardArgs {
  title: string;
  description: string;
  imageUrl: string;
}

const GameCardView = ({ args }: { args: GameCardArgs }) => {
  const { setPreview } = usePreviewStore();

  const getPreviewUrl = () => {
    return `/api/sandbox/${sessionStorage.getItem("thread_id")}/index.html`;
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getPreviewUrl();
    if (url) {
      setPreview(url, args.title);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={args.imageUrl || "/images/gameCardPlaceholder.jpeg"}
          alt={args.title}
          className="aspect-video w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {args.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {args.description}
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
export const GameCard = makeAssistantToolUI<GameCardArgs, undefined>({
  toolName: "displayGameMockup",
  render: ({ args }) => <GameCardView args={args} />,
});
