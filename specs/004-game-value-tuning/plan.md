# Implementation Plan: 游戏数值修改 (Game Value Tuning)

**Branch**: `004-game-value-tuning` | **Date**: 2026-01-25 | **Spec**: [specs/004-game-value-tuning/spec.md](specs/004-game-value-tuning/spec.md)
**Input**: Feature specification from `/specs/004-game-value-tuning/spec.md`

## Summary

将 JSON Render 系统的提示词（Prompt）和元数据全面中文化，并针对“游戏数值修改”场景定制生成规则（强制使用 Slider 修改数字）和交互操作（Actions），同时在调试页面实现配套逻辑。

## Technical Context

**Language/Version**: TypeScript 5.x, React 19 (inferred), Node v22
**Primary Dependencies**: Next.js App Router, @json-render/core (internal), Zod
**Storage**: N/A (Client-side state / Debug page)
**Testing**: Manual verification in Debug page
**Target Platform**: Web (Chrome/Edge)
**Project Type**: Web application
**Performance Goals**: N/A
**Constraints**: Prompt must be in Chinese; Numbers must use Slider.
**Scale/Scope**: Refactoring ~3 files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1.  **I. 语言要求 (Language Requirement)**: 本计划直接响应此原则，将 Prompt 和 Catalog 中文化。符合。
2.  **II. 技术栈一致性 (Tech Stack Consistency)**: 使用现有的 Next.js, React, Tailwind, Zod。未引入新依赖。符合。

## Project Structure

### Documentation (this feature)

```text
specs/004-game-value-tuning/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/
├── api/
│   └── json_render/
│       └── route.ts     # Update prompt injection
├── debug/
│   └── json_render/
│       └── page.tsx     # Update action handlers
prompt/
└── json-render.ts       # Update prompt content to Chinese & add Slider rule
lib/
└── catalog.ts           # Update descriptions & actions to Chinese
```

**Structure Decision**: Option 1: Single project (Standard Next.js structure)

## Complexity Tracking

N/A
