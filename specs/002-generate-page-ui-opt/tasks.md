---
description: "Task list for Generate Page UI Optimization"
---

# Tasks: Generate Page UI Optimization

**Input**: Design documents from `/specs/002-generate-page-ui-opt/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual visual verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- `app/generate/page.tsx`: Main target file
- `app/generate/page.css`: File to remove

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `specs/002-generate-page-ui-opt/tasks.md` (this file)
- [x] T002 Verify `app/globals.css` defines root variables
- [x] T003 Remove unused `app/generate/page.css` file

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Remove `import "./page.css";` from `app/generate/page.tsx` (if present)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Consistent Visual Style (Priority: P1) 🎯 MVP

**Goal**: The user sees a dashboard generation interface that visually matches the rest of the application.

**Independent Test**: Visually compare the generation page with the JSON renderer components.

### Implementation for User Story 1

- [x] T005 [US1] Refactor main container in `app/generate/page.tsx` to use Tailwind (`max-w-screen-lg mx-auto p-6` etc.)
- [x] T006 [US1] Refactor prompt input in `app/generate/page.tsx` to use Tailwind classes (`bg-card`, `border-input`, `text-foreground`, `rounded-[var(--radius)]`)
- [x] T007 [US1] Refactor "Generate" button in `app/generate/page.tsx` to use Tailwind `primary` styles
- [x] T008 [US1] Refactor "Export" and "Clear" buttons in `app/generate/page.tsx` to use Tailwind `secondary`/`outline` styles
- [x] T009 [US1] Refactor example prompt buttons in `app/generate/page.tsx` to use Tailwind styles
- [x] T010 [US1] Refactor error message and empty state container in `app/generate/page.tsx`
- [x] T011 [US1] Refactor "View JSON" details block in `app/generate/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Interactive & Responsive Feedback (Priority: P2)

**Goal**: The user receives visual feedback when interacting with inputs, buttons, and the export modal.

**Independent Test**: Hover over buttons and focus on inputs; observe color changes and focus rings.

### Implementation for User Story 2

- [x] T012 [P] [US2] Add focus ring states to prompt input in `app/generate/page.tsx` (`focus-visible:ring-2`)
- [x] T013 [P] [US2] Add hover states to all buttons in `app/generate/page.tsx`
- [x] T014 [US2] Refactor "Code Export Modal" overlay and content in `app/generate/page.tsx` to use Tailwind (fixed position, backdrop, card styling)
- [x] T015 [US2] Add hover/active states to file list items in the Export Modal in `app/generate/page.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 Verify no inline `style={{ ... }}` remains in `app/generate/page.tsx` (except unavoidable dynamic styles)
- [x] T017 Verify Dark Mode compatibility
- [x] T018 Run verification steps from `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Best implemented after US1 (or concurrently if editing different sections of the file, though challenging in a single file)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1).
3. Validate visual consistency.

### Incremental Delivery

1. **Iteration 1**: Basic styling (US1).
2. **Iteration 2**: Modal and Interactions (US2).
