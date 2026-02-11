// 模型相关配置，用于一键切换

import { doubaoSeed, doubaoSeedImage, kimiK2 } from "./ark";
import { gemini, genAI } from "./gemini";

export const modelConfig = {
  chat: {
    doubaoSeed,
    kimiK2,
    gemini3Flash: gemini("gemini-3-flash-preview"),
    gemini3Pro: gemini("gemini-3-pro-preview"),
    gemini2Flash: gemini("gemini-2.0-flash"),
  },
  image: {
    doubaoSeed: doubaoSeedImage,
    genAI,
  },
};
