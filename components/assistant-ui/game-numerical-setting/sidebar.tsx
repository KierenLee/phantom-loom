"use client";

import { memo, useMemo } from "react";
import { Sparkles, X } from "lucide-react";
import {
  DataProvider,
  ActionProvider,
  VisibilityProvider,
  useUIStream,
  Renderer,
  ValidationProvider,
  useData,
} from "@json-render/react";
import { componentRegistry } from "@/components/json-render/ui";
import { Toast } from "@douyinfe/semi-ui-19";
import { useMemoizedFn, useRequest } from "ahooks";
import { useGameSettingsStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

function ActionWrapper({
  children,
}: {
  children: React.ReactNode;
  initialData: Record<string, unknown>;
}) {
  const { data } = useData();

  const save = useMemoizedFn(async () => {
    const threadId = sessionStorage.getItem("thread_id");
    if (!threadId) {
      Toast.error("无法获取 thread_id，保存失败");
      return;
    }

    try {
      const response = await fetch(`/api/sandbox/${threadId}/config.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Toast.success(`保存成功!`);
        console.log("GameNumericalSetting saved data:", data);
      } else {
        const errorText = await response.text();
        Toast.error(`保存失败: ${errorText}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      Toast.error("保存失败: 网络错误");
    }
  });

  return <ActionProvider handlers={{ save }}>{children}</ActionProvider>;
}

const DashboardContent = memo(
  ({
    initialData,
    prompt,
  }: {
    initialData: Record<string, unknown>;
    prompt: string;
  }) => {
    const { data } = useData();

    const { tree, isStreaming, error, send } = useUIStream({
      api: "/api/json_render",
      onError: (err) => console.error("Generation error:", err),
    });

    useRequest(
      async () => {
        if (!prompt.trim()) return;
        await send(
          `schema是：${prompt}。需要完整的展示结构化表单，包含保存按钮。`,
          {
            data: data || initialData,
          },
        );
      },
      {
        manual: false,
        debounceWait: 200,
        debounceLeading: false,
      },
    );

    const hasElements = tree && Object.keys(tree.elements).length > 0;

    return (
      <div className="mx-auto max-w-screen-lg p-4">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 p-4 text-sm text-destructive dark:border-destructive">
            {error.message}
          </div>
        )}

        <div className="group relative min-h-[200px] min-w-[400px] rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={async () => {
                // Append optimization instruction to the original prompt
                const optimizedPrompt = `schema是：${prompt}。需要完整的展示结构化表单，包含保存按钮。`;
                await send(optimizedPrompt, {
                  data: data || initialData,
                  currentTree: tree,
                });
              }}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              title="Optimize UI"
            >
              <Sparkles className="size-4" />
            </button>
          </div>
          {!hasElements && !isStreaming ? (
            <div className="px-5 py-12 text-center text-muted-foreground">
              <p className="m-0">加载中...</p>
            </div>
          ) : tree ? (
            <Renderer
              tree={tree}
              registry={componentRegistry}
              loading={isStreaming}
            />
          ) : null}
        </div>

        {hasElements && (
          <details className="group mt-6">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              View JSON
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground">
              {JSON.stringify(data || initialData, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  },
);

export const GameNumericalSettingSidebar = memo(() => {
  const { settingArgs, isOpen, closeSettings } = useGameSettingsStore();

  const key = useMemo(() => {
    if (!settingArgs) return "empty";
    // Use length and title as simple change detection
    return `${settingArgs.initialData.length}-${settingArgs.title}`;
  }, [settingArgs]);

  if (!isOpen || !settingArgs) {
    return null;
  }

  // Ensure initialData is at least an empty object if undefined/null
  const { initialData, dataSchema, title } = settingArgs;

  if (!initialData || !dataSchema) {
    return null;
  }

  let initialDataObj;

  try {
    initialDataObj = JSON.parse(initialData);
  } catch {
    return null;
  }

  return (
    <div className="flex h-full w-[500px] shrink-0 flex-col overflow-y-auto border-l bg-background transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-semibold">{title || "游戏数值设置"}</h2>
        <Button variant="ghost" size="icon" onClick={closeSettings}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <DataProvider key={key} initialData={initialDataObj}>
        <ValidationProvider>
          <VisibilityProvider>
            <ActionWrapper initialData={initialDataObj}>
              <DashboardContent
                initialData={initialDataObj}
                prompt={dataSchema || ""}
              />
            </ActionWrapper>
          </VisibilityProvider>
        </ValidationProvider>
      </DataProvider>
    </div>
  );
});
