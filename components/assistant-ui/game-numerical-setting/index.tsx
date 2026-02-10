"use client";

import { useEffect } from "react";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { useGameSettingsStore, GameNumericalSettingArgs } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { Toast } from "@douyinfe/semi-ui-19";

const GameNumericalSettingTool = ({
  args,
}: {
  args: GameNumericalSettingArgs;
}) => {
  const { setSettings, openSettings } = useGameSettingsStore();

  useEffect(() => {
    if (args && args.initialData && args.dataSchema) {
      setSettings(args);
    }
  }, [args, setSettings]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-muted-foreground">
      <div className="flex items-center gap-2">
        <Settings2 className="size-4" />
        <span>游戏数值配置已就绪</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (args && args.initialData) {
            console.log("🛠️[debug] GameNumericalSettingTool args", args);
            setSettings(args);
            openSettings();
          } else {
            Toast.error("Ops....未生成游戏配置");
          }
        }}
      >
        在右侧面板打开设置
      </Button>
    </div>
  );
};

export const GameNumericalSetting = makeAssistantToolUI<
  GameNumericalSettingArgs,
  undefined
>({
  toolName: "displayGameNumericalSetting",
  render: ({ args, status }) => {
    if (status.type === "running") {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings2 className="size-4 animate-spin" />
          <span>正在生成数值配置...</span>
        </div>
      );
    }

    if (status.type === "incomplete" && status.reason === "error") {
      return <div className="text-destructive">生成配置出错</div>;
    }

    return <GameNumericalSettingTool args={args} />;
  },
});
