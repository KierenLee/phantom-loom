---
name: game-quality-inspector
description: 游戏质量检测工具，使用 Midscene 进行基于视觉的自动化测试。
---

# Game Evaluation Skill

使用 Midscene (Puppeteer) 根据 YAML 描述对游戏进行自动化视觉检测。

## Available Scripts

## read-game-docs.js

用于读取指定会话的游戏文档（art.md、gdd.md、tech.md）。

```bash
node ./skills/game-quality-inspector/scripts/read-game-docs.js --sessionId <session_id>
```

## write-evaluation.js

用于将测试结果写入指定的 YAML 文件，生成 evaluation.yaml。

```bash
node ./skills/game-quality-inspector/scripts/write-evaluation.js --sessionId <session_id> --content <yaml_content>
```

## run-evaluation.mjs

用于初始化 Midscene 环境、执行测试任务并生成报告。

```bash
node ./skills/game-quality-inspector/scripts/run-evaluation.mjs --sessionId <session_id>
```
