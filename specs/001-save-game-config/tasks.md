---
description: "Implementation tasks for Game Config Save feature"
---

# Tasks: Game Config Save

**Input**: Design documents from `/specs/001-save-game-config/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual verification is planned. Automated tests are not explicitly requested but component tests could be added if needed. For now, following spec which mentions Independent Test (manual).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify `app/api/sandbox/[...path]/route.ts` exists and understands current implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Verify `sessionStorage` access pattern in `components/assistant-ui/game-numerical-setting/index.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 保存游戏数值配置 (Priority: P1) 🎯 MVP

**Goal**: Enable saving of game numerical configuration to the server

**Independent Test**: Modify values in UI, click save, verify `workspace/${threadId}/config.json` is updated.

### Implementation for User Story 1

- [x] T003 [US1] Implement POST handler in `app/api/sandbox/[...path]/route.ts` to support file writing
- [x] T004 [US1] Implement save button logic in `components/assistant-ui/game-numerical-setting/index.tsx` to call API

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 异常处理：缺少 Thread ID (Priority: P2)

**Goal**: Prevent saving when thread_id is missing and show error

**Independent Test**: Clear sessionStorage, click save, verify error toast and no network request (or request aborted).

### Implementation for User Story 2

- [x] T005 [US2] Add client-side validation for `thread_id` in `components/assistant-ui/game-numerical-setting/index.tsx`
- [x] T006 [US2] Add server-side validation for path/content in `app/api/sandbox/[...path]/route.ts` (if additional to T003)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T007 Manual verification of the entire flow
- [x] T008 Update documentation if API behavior changed significantly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup
- **User Stories (Phase 3+)**: Depend on Foundational
- **Polish (Final Phase)**: Depends on User Stories

### User Story Dependencies

- **User Story 1 (P1)**: Independent
- **User Story 2 (P2)**: Independent (can be added before or after, but logically after for refinement)

### Parallel Opportunities

- T003 and T005 can theoretically be worked on if files allow, but T004 depends on API being ready ideally, though they can be dev'd in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test saving works
4. Deploy/demo

### Incremental Delivery

1. Foundation
2. US1 (Save)
3. US2 (Error Handling)
