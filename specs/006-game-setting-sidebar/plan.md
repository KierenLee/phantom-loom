# Implementation Plan: Game Setting Sidebar

**Branch**: `006-game-setting-sidebar` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-game-setting-sidebar/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

将 `components/assistant-ui/game-numerical-setting/index.tsx` 中的游戏数值设置组件从对话流（Tool UI）中移出，改为通过全局状态管理（Zustand）控制，并固定显示在页面右侧区域，紧挨着 `PreviewPanel`。Tool UI 将仅负责触发状态更新，不再直接渲染复杂的配置表单。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, React 19
**Primary Dependencies**: `zustand` (State Management), `@assistant-ui/react` (Tool Integration), `@json-render/react` (Form Rendering)
**Storage**: Client-side Store (`zustand`), Server-side JSON files (via `/api/sandbox/${threadId}/config.json`)
**Testing**: Manual Verification (Check rendering in sidebar, disappearance from chat)
**Target Platform**: Web (Desktop optimized)
**Project Type**: Single project (Next.js App Router)
**Performance Goals**: N/A
**Constraints**: Must maintain existing functionality (save to API). Sidebar must coexist with PreviewPanel.
**Scale/Scope**: UI Refactor + State Management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Language Requirement**: Plan and docs are in Chinese.
- [x] **Tech Stack Consistency**: Uses existing `zustand`, `Next.js`, `React`.

## Project Structure

### Documentation (this feature)

```text
specs/006-game-setting-sidebar/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── assistant.tsx               # Update layout to include GameSettingsPanel
components/
├── assistant-ui/
│   ├── game-numerical-setting/
│   │   ├── index.tsx           # Split into Tool and Sidebar component
│   │   └── sidebar.tsx         # New component for Sidebar UI (optional, or keep in index)
lib/
├── store.ts                    # Add useGameSettingsStore
```

**Structure Decision**: Refactor existing component and add global store.
