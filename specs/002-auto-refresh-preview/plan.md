# Implementation Plan: Auto Refresh Preview

**Branch**: `002-auto-refresh-preview` | **Date**: 2026-01-26 | **Spec**: [Link](./spec.md)
**Input**: Feature specification from `specs/002-auto-refresh-preview/spec.md`

## Summary

在 `PreviewPanel` 组件中实现轮询机制，定期（每2秒）检查服务器端的游戏配置文件。若发现文件内容变更，则自动刷新预览 iframe，确保用户能即时看到数值调整的效果。

## Technical Context

**Language/Version**: TypeScript 5.x, React 19
**Primary Dependencies**: `ahooks` (useRequest for polling), `react`
**Storage**: N/A (Client-side logic)
**Testing**: Manual verification
**Target Platform**: Web
**Project Type**: web
**Performance Goals**: Minimal overhead for polling (lightweight JSON fetch).
**Constraints**: Only poll when panel is open.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. 语言要求 (Language Requirement)**: Plan and Spec are in Chinese. (Pass)
- **II. 技术栈一致性 (Tech Stack Consistency)**: Using existing React hooks and standard fetch. (Pass)

## Project Structure

### Documentation (this feature)

```text
specs/002-auto-refresh-preview/
├── plan.md              # This file
├── research.md          # N/A (Straightforward implementation)
├── data-model.md        # N/A
├── quickstart.md        # N/A
├── contracts/           # N/A
└── tasks.md             # Implementation tasks
```

### Source Code

```text
components/assistant-ui/
└── preview-panel.tsx    # Modified to include polling logic
```

**Structure Decision**: Single file modification.

## Complexity Tracking

No violations.
