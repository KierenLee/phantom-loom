import React from "react";
import {
  MessagePartState,
  ToolCallMessagePartComponent,
} from "@assistant-ui/react";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import { ToolUIPart } from "ai";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { safeParseJson } from "@/lib/json";
import { isDebug } from "@/lib/debug";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { useInterval } from "ahooks";
import { AnimatePresence, motion } from "framer-motion";

const statusType2state: Record<
  MessagePartState["status"]["type"],
  ToolUIPart["state"]
> = {
  running: "input-available",
  complete: "output-available",
  incomplete: "input-streaming",
  "requires-action": "output-available",
};

export const ToolFallback: ToolCallMessagePartComponent = ({
  toolName,
  argsText,
  result,
  status,
}) => {
  const state = statusType2state[status.type];
  if (isDebug()) {
    return (
      <Tool>
        <ToolHeader state={state} title={toolName} type={`tool-${toolName}`} />
        <ToolContent>
          <ToolInput input={safeParseJson(argsText, argsText)} />
          <Confirmation
            approval={{ approved: true, id: nanoid() }}
            state="output-available"
          >
            <ConfirmationTitle>
              <ConfirmationRequest>是否执行此工具？</ConfirmationRequest>
              <ConfirmationAccepted>
                <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                <span>接受</span>
              </ConfirmationAccepted>
              <ConfirmationRejected>
                <XIcon className="size-4 text-destructive" />
                <span>拒接</span>
              </ConfirmationRejected>
            </ConfirmationTitle>
          </Confirmation>
          {state === "output-available" && (
            <ToolOutput errorText={(status as any).error} output={result} />
          )}
        </ToolContent>
      </Tool>
    );
  }
  return (
    <div className="flex w-full items-center justify-start">
      {
        {
          running: <Thinking />,
          complete: null,
          incomplete: null,
          "requires-action": null,
        }[status.type]
      }
    </div>
  );
};

const thinkingTexts = [
  "🎮 正在为你打造一个超有趣的游戏世界！",
  "✨ 让我想想，加点什么惊喜元素呢？",
  "🎨 正在疯狂绘制游戏地图中...",
  "🤖 智能AI正在疯狂编写代码！",
  "🎉 即将解锁你的专属游戏体验！",
  "🚀 游戏引擎正在全速运转！",
  "🧩 正在把所有好玩的元素拼在一起！",
  "🎯 目标：让你玩得停不下来！",
  "💡 灵感爆发中，创意无限！",
  "🎪 准备好迎接一场游戏盛宴了吗？",
];

const Thinking = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % thinkingTexts.length);
  }, 2500);

  return (
    <Reasoning className="w-full">
      <ReasoningTrigger getThinkingMessage={() => "策划中..."} />
      <ReasoningContent>
        <div className="relative h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              {thinkingTexts[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </ReasoningContent>
    </Reasoning>
  );
};
