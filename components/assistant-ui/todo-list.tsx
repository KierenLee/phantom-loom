"use client";

import { useState } from "react";
import { safeParseJson } from "@/lib/json";
import { makeAssistantToolUI } from "@assistant-ui/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, CheckCircle2, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import * as m from "motion/react-m";

type TodoItem = {
  content: string;
  status: "in_progress" | "completed" | "pending";
};
type TodoResult = TodoItem[] | string;
type TodoArgs = TodoItem;

/**
 * Todo List 组件 - 用于显示和管理待办事项
 */
export const TodoListUI = makeAssistantToolUI<TodoArgs, TodoResult>({
  toolName: "write_todos",
  render: ({ args, result, status }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (status.type === "running") {
      return (
        <div className="sticky top-0 z-0 mx-auto mb-0 flex w-full max-w-[var(--thread-max-width)] animate-pulse items-center gap-2 rounded-xl border border-input bg-muted/50 px-4 py-3">
          <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />
          <span className="text-sm text-muted-foreground">
            正在处理待办事项...
          </span>
        </div>
      );
    }

    if (!result) return null;

    let finalResult: TodoItem[] = [];
    if (typeof result === "string") {
      finalResult = safeParseJson(result, []);
    } else {
      finalResult = result;
    }

    const completedCount = finalResult.filter(
      (t) => t.status === "completed",
    ).length;
    const totalCount = finalResult.length;
    const allCompleted = totalCount > 0 && completedCount === totalCount;
    const activeTodoIndex = finalResult.findIndex(
      (t) => t.status === "in_progress",
    );

    return (
      <div
        style={{
          zIndex: allCompleted ? 0 : 1,
        }}
        className="sticky top-0 z-0 mx-auto mb-0 w-full max-w-[var(--thread-max-width)]"
      >
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center justify-between border border-input bg-card px-4 py-3 text-left transition-all hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                isOpen ? "rounded-t-xl border-b-0" : "rounded-xl",
              )}
            >
              <div className="flex items-center gap-3">
                {allCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <m.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <CircleCheck className="h-4 w-4 text-muted-foreground" />
                  </m.div>
                )}
                <span className="text-sm font-medium">
                  {allCompleted
                    ? "All todos done"
                    : `${completedCount}/${totalCount} todos`}
                </span>
              </div>
              <m.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </m.div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent forceMount>
            <m.div
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{
                height: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.2, ease: "easeInOut" },
              }}
              className="overflow-hidden"
            >
              <ul
                className={cn(
                  "space-y-1 border-x border-b border-input bg-card px-4 pb-3",
                  isOpen ? "rounded-b-xl" : "",
                )}
              >
                {finalResult.map((todo, index) => {
                  const isActive = index === activeTodoIndex;
                  console.log(args, isActive);
                  return (
                    <m.li
                      key={todo.content}
                      initial={false}
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        x: isOpen ? 0 : -20,
                      }}
                      transition={{
                        delay: isOpen ? index * 0.05 : 0,
                        duration: 0.3,
                      }}
                      className="flex items-center gap-3 py-1.5"
                    >
                      <m.div
                        animate={
                          isActive
                            ? {
                                scale: [1, 1.15, 1],
                                borderColor: [
                                  "var(--muted-foreground)",
                                  "var(--primary)",
                                  "var(--muted-foreground)",
                                ],
                              }
                            : {}
                        }
                        transition={
                          isActive
                            ? {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                            : {}
                        }
                        className={cn(
                          "relative flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors duration-300",
                          todo.status === "completed"
                            ? "border-green-500 bg-green-500"
                            : isActive
                              ? "border-primary"
                              : "border-muted-foreground",
                        )}
                      >
                        {isActive && (
                          <m.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: [0, 0.5, 0],
                              scale: [1, 1.8, 2.2],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                            className="absolute inset-0 rounded-full bg-primary"
                          />
                        )}
                        {todo.status === "completed" && (
                          <m.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 20,
                            }}
                            className="h-2.5 w-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={4}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </m.svg>
                        )}
                      </m.div>
                      <span
                        className={cn(
                          "text-sm transition-all duration-300",
                          todo.status === "completed"
                            ? "text-muted-foreground line-through opacity-70"
                            : isActive
                              ? "font-medium text-foreground"
                              : "text-muted-foreground",
                        )}
                      >
                        {todo.content}
                      </span>
                    </m.li>
                  );
                })}
              </ul>
            </m.div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
});
