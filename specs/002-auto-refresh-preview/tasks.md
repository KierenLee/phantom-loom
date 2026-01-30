---
description: "Implementation tasks for Auto Refresh Preview feature"
---

# Tasks: Auto Refresh Preview

**Input**: Design documents from `/specs/002-auto-refresh-preview/`
**Prerequisites**: plan.md, spec.md

**Tests**: Manual verification planned.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to
- Include exact file paths

## Phase 1: Setup

**Purpose**: Verify environment

- [x] T001 Verify `components/assistant-ui/preview-panel.tsx` exists

---

## Phase 2: User Story 1 - 自动刷新预览 (Priority: P1)

**Goal**: Implement polling and refresh logic

**Independent Test**: Update `workspace/${threadId}/config.json` manually (or via UI), check if iframe reloads.

### Implementation for User Story 1

- [x] T002 [US1] Implement `usePolling` logic in `components/assistant-ui/preview-panel.tsx` using `useRequest` or `setInterval`
- [x] T003 [US1] Add logic to fetch `config.json` and compare content/hash
- [x] T004 [US1] Trigger iframe reload when change detected (key update or src reload)

**Checkpoint**: Feature complete.

---

## Phase 3: Polish

- [x] T005 Verify performance (polling stops when closed)
