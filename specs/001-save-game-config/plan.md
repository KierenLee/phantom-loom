# Implementation Plan: Game Config Save

**Branch**: `001-save-game-config` | **Date**: 2026-01-26 | **Spec**: [Link](./spec.md)
**Input**: Feature specification from `specs/001-save-game-config/spec.md`

## Summary

实现游戏数值配置的保存功能。前端在 `components/assistant-ui/game-numerical-setting/index.tsx` 中调用保存接口，后端扩展 `app/api/sandbox/[...path]/route.ts` 以支持 `POST` 请求，将配置数据写入 `./workspace/${threadId}/config.json`。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v22
**Primary Dependencies**: Next.js App Router, React 19, @douyinfe/semi-ui-19 (UI)
**Storage**: File System (JSON files in `workspace/`)
**Testing**: Manual verification (Independent Test)
**Target Platform**: Web (Next.js)
**Project Type**: web
**Performance Goals**: N/A
**Constraints**: Must use `sessionStorage` for `thread_id`; Must validate paths to prevent traversal.
**Scale/Scope**: Single file write per save action.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. 语言要求 (Language Requirement)**: Plan and Spec are in Chinese. (Pass)
- **II. 技术栈一致性 (Tech Stack Consistency)**: Using existing Next.js API routes and React components. No new deps. (Pass)

## Project Structure

### Documentation (this feature)

```text
specs/001-save-game-config/
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # Data entities
├── quickstart.md        # Usage guide
├── contracts/           # API definitions
│   └── api.yaml
└── tasks.md             # Implementation tasks
```

### Source Code

```text
app/api/sandbox/[...path]/
└── route.ts             # Modified to support POST

components/assistant-ui/game-numerical-setting/
└── index.tsx            # Modified to call API on save
```

**Structure Decision**: Modifying existing files in `app/` and `components/` to add functionality. No new modules required.

## Complexity Tracking

No violations.
