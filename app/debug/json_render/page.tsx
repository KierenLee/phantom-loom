"use client";

import { useState, useCallback, useMemo } from "react";
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
import { generateNextJSProject } from "@/lib/codegen";
import {
  CodeHighlight,
  getLanguageFromPath,
} from "@/components/json-render/code-highlight";
import { cn } from "@/lib/utils";
import { Toast } from "@douyinfe/semi-ui-19";
import { ModeToggle } from "@/components/mode-toggle";

function ActionWrapper({
  children,
}: {
  children: React.ReactNode;
  initialData: Record<string, unknown>;
}) {
  const { data, update } = useData();

  const handlers = useMemo(
    () => ({
      save: () => {
        Toast.success(`保存成功!`);
        console.log("data", data);
      },
    }),
    [data, update],
  );

  return <ActionProvider handlers={handlers}>{children}</ActionProvider>;
}

function DashboardContent({
  initialData,
}: {
  initialData: Record<string, unknown>;
}) {
  const [prompt, setPrompt] = useState("");
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data } = useData();

  const { tree, isStreaming, error, send, clear } = useUIStream({
    api: "/api/json_render",
    onError: (err) => console.error("Generation error:", err),
  });

  const exportedFiles = useMemo(
    () =>
      tree
        ? generateNextJSProject(tree, {
            projectName: "my-dashboard",
            data: data || initialData,
          })
        : [],
    [tree, data, initialData],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) return;
      await send(prompt, { data: data || initialData });
    },
    [prompt, send, data, initialData],
  );

  // Handle Cmd+Enter to submit
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const downloadAllFiles = useCallback(() => {
    // Create a simple zip-like download by creating individual file downloads
    // For a real implementation, you'd use a library like JSZip
    const allContent = exportedFiles
      .map((f) => `// ========== ${f.path} ==========\n${f.content}`)
      .join("\n\n");

    const blob = new Blob([allContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-dashboard-project.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportedFiles]);

  const copyFileContent = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const examples = [
    "随机生成一个游戏配置",
    `{"$schema":"http://json-schema.org/draft-07/schema#","title":"飞机大战数值配置","description":"定义游戏核心数值，包括全局设置、玩家属性、敌人图鉴及关卡波次。","type":"object","required":["global","player","weapons","enemies","levels"],"properties":{"global":{"type":"object","description":"全局通用参数","properties":{"screen_width":{"type":"integer"},"screen_height":{"type":"integer"},"fps":{"type":"integer","default":60},"difficulty_scaling":{"type":"number","description":"全局难度系数，用于动态调整"}}},"player":{"type":"object","description":"玩家基础属性","properties":{"base_hp":{"type":"integer","minimum":1},"speed":{"type":"number"},"hitbox_radius":{"type":"number"},"invincible_time":{"type":"number","description":"受击无敌时间(秒)"},"initial_weapon_id":{"type":"string"}},"required":["base_hp","speed","initial_weapon_id"]},"weapons":{"type":"array","description":"武器系统定义","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"damage":{"type":"integer"},"fire_rate":{"type":"number","description":"射击间隔(秒)"},"projectile_speed":{"type":"number"},"spread_angle":{"type":"integer","description":"散射角度"},"projectile_count":{"type":"integer","description":"单次发射子弹数"}},"required":["id","damage","fire_rate"]}},"enemies":{"type":"array","description":"敌人图鉴与属性","items":{"type":"object","properties":{"id":{"type":"string"},"type":{"type":"string","enum":["minion","elite","boss"]},"hp":{"type":"integer"},"speed":{"type":"number"},"score_value":{"type":"integer"},"drop_rate":{"type":"number","minimum":0,"maximum":1},"behavior_pattern":{"type":"string","enum":["straight","sine","tracking","hover"]}},"required":["id","type","hp","score_value"]}},"levels":{"type":"array","description":"关卡流程配置","items":{"type":"object","properties":{"level_id":{"type":"integer"},"bgm_asset":{"type":"string"},"waves":{"type":"array","items":{"type":"object","properties":{"time_start":{"type":"number","description":"波次开始时间(秒)"},"enemy_id":{"type":"string"},"count":{"type":"integer"},"spawn_interval":{"type":"number"}}}}}}}}}`,
  ];

  const hasElements = tree && Object.keys(tree.elements).length > 0;

  // Auto-select first file when modal opens
  const activeFile =
    selectedFile || (exportedFiles.length > 0 ? exportedFiles[0]?.path : null);
  const activeFileContent = exportedFiles.find(
    (f) => f.path === activeFile,
  )?.content;

  return (
    <div className="mx-auto max-w-screen-lg p-6 md:p-12">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want... (Cmd+Enter to submit)"
            disabled={isStreaming}
            rows={3}
            className={cn(
              "flex-1 resize-y rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
          <div className="flex flex-col gap-2 sm:w-auto">
            <button
              type="submit"
              disabled={isStreaming || !prompt.trim()}
              className={cn(
                "w-full rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto",
              )}
            >
              {isStreaming ? "Generating..." : "Generate"}
            </button>
            {hasElements && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setShowCodeExport(true);
                  }}
                  className="w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:w-auto"
                >
                  Export
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:w-auto"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              className="max-w-[300px] overflow-hidden rounded-lg border border-input bg-card px-3 py-1.5 text-sm text-nowrap wrap-break-word text-clip text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              {ex}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 p-4 text-sm text-destructive dark:border-destructive">
          {error.message}
        </div>
      )}

      <div className="min-h-[300px] rounded-lg border border-border bg-card p-6 shadow-sm">
        {!hasElements && !isStreaming ? (
          <div className="px-5 py-16 text-center text-muted-foreground">
            <p className="m-0">Enter a prompt to generate a widget</p>
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
            {JSON.stringify(tree, null, 2)}
          </pre>
        </details>
      )}

      {/* Code Export Modal */}
      {showCodeExport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowCodeExport(false)}
        >
          <div
            className="flex h-[80vh] w-[90%] max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="m-0 text-lg font-semibold">
                  Export Next.js Project
                </h2>
                <p className="m-1 text-sm text-muted-foreground">
                  {exportedFiles.length} files generated
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadAllFiles}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Download All
                </button>
                <button
                  onClick={() => setShowCodeExport(false)}
                  className="rounded-lg border border-input bg-transparent px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* File List */}
              <div className="w-60 overflow-auto border-r border-border py-2">
                {exportedFiles.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file.path)}
                    className={cn(
                      "block w-full px-4 py-2 text-left font-mono text-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                      activeFile === file.path
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {file.path}
                  </button>
                ))}
              </div>

              {/* File Content */}
              <div className="flex flex-1 flex-col overflow-auto">
                {activeFile && (
                  <>
                    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
                      <span className="font-mono text-xs text-foreground">
                        {activeFile}
                      </span>
                      <button
                        onClick={() =>
                          activeFileContent &&
                          copyFileContent(activeFileContent)
                        }
                        className="rounded border border-input bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="flex-1 overflow-auto bg-card p-4">
                      <CodeHighlight
                        code={activeFileContent || ""}
                        language={getLanguageFromPath(activeFile)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardRender(props: { initialDataString: string }) {
  const { initialDataString } = props;
  const initialData = useMemo(() => {
    try {
      return JSON.parse(initialDataString || "{}");
    } catch {
      return {};
    }
  }, [initialDataString]);

  if (!initialDataString) {
    return null;
  }

  return (
    <DataProvider initialData={initialData}>
      <ValidationProvider>
        <VisibilityProvider>
          <ActionWrapper initialData={initialData}>
            <DashboardContent initialData={initialData} />
          </ActionWrapper>
        </VisibilityProvider>
      </ValidationProvider>
    </DataProvider>
  );
}

export default function DashboardPage() {
  const [initialDataString, setInitialData] = useState("");

  return (
    <>
      <div className="border-b border-border bg-card p-4">
        <div className="mx-auto flex max-w-screen-lg flex-row">
          <label className="mb-2 block text-sm font-medium text-foreground">
            初始数据 (JSON)
          </label>
          <textarea
            value={initialDataString}
            onChange={(e) => {
              setInitialData(e.target.value);
            }}
            placeholder='{ "key": "value" }'
            rows={5}
            className="w-full resize-y rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
          <ModeToggle />
        </div>
      </div>
      <DashboardRender initialDataString={initialDataString} />
    </>
  );
}
