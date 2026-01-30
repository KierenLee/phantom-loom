---
description: "Tasks for implementing Game Setting Sidebar"
---

# Tasks: Game Setting Sidebar

**Input**: Design documents from `/specs/006-game-setting-sidebar/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Tests are manual verification as per plan. No automated tests requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

- Source: `app/`, `components/`, `lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Ensure specs directories exist (Already done)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [US1] Define GameSettingsState interface and useGameSettingsStore store in lib/store.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Persistent Game Settings Sidebar (Priority: P1) 🎯 MVP

**Goal**: Sidebar visible on right, not in chat, updates global store.

**Independent Test**: Can be fully tested by verifying the `GameNumericalSetting` component appears on the right sidebar and not in the chat flow.

### Implementation for User Story 1

- [x] T003 [P] [US1] Create GameNumericalSettingSidebar component in components/assistant-ui/game-numerical-setting/sidebar.tsx
- [x] T004 [US1] Refactor GameNumericalSetting tool (Tool UI) in components/assistant-ui/game-numerical-setting/index.tsx
- [x] T005 [US1] Integrate Sidebar into layout in app/assistant.tsx
- [x] T006 [US1] Verify Sidebar coexistence with PreviewPanel (Manual layout check)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T007 [P] Clean up any unused code in components/assistant-ui/game-numerical-setting/
- [x] T008 [P] Update styles for adjacent layout in app/assistant.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Store definition before component usage
- Components before layout integration

### Parallel Opportunities

- T003 (Sidebar) and T004 (Tool Refactor) can theoretically be parallelized if they agree on the store contract (T002).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (Store)
3. Complete Phase 3: User Story 1 (Refactor & Integrate)
4. **STOP and VALIDATE**: Test User Story 1 independently
