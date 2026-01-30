---
description: "Task list for JSON Render UI Optimization"
---

# Tasks: JSON Render UI Optimization

**Input**: Design documents from `/specs/001-json-render-ui-opt/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the feature specification, but tasks include visual verification steps.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- `components/json-render/ui/`: Target UI components for refactoring

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `specs/001-json-render-ui-opt/tasks.md` (this file)
- [x] T002 Verify `app/globals.css` exists and contains required Tailwind theme variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Ensure `tailwind.config.ts` or equivalent is configured to scan `components/json-render/` for classes

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Unified Visual Theme (Priority: P1) 🎯 MVP

**Goal**: Ensure all JSON-rendered components match the global application theme (colors, typography, spacing).

**Independent Test**: Visually compare components in the sandbox against standard app components.

### Implementation for User Story 1

- [x] T004 [P] [US1] Refactor `components/json-render/ui/button.tsx` to use Tailwind utility classes (replace inline styles)
- [x] T005 [P] [US1] Refactor `components/json-render/ui/card.tsx` to use Tailwind utility classes (replace inline styles)
- [x] T006 [P] [US1] Refactor `components/json-render/ui/input.tsx` (if exists) or equivalent text field to use Tailwind utility classes
- [x] T007 [P] [US1] Refactor `components/json-render/ui/text.tsx` and `heading.tsx` to use global typography classes
- [x] T008 [P] [US1] Refactor `components/json-render/ui/badge.tsx` and `alert.tsx` to use Tailwind utility classes
- [x] T009 [P] [US1] Refactor remaining layout components (`stack.tsx`, `grid.tsx`, `divider.tsx`) to use Tailwind spacing classes

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Enhanced Interactive Feedback (Priority: P2)

**Goal**: Add immediate visual feedback (hover, active, focus) to interactive elements.

**Independent Test**: Click/hover interactions in sandbox trigger visual changes.

### Implementation for User Story 2

- [x] T010 [P] [US2] Add `:hover` and `:active` classes to `components/json-render/ui/button.tsx`
- [x] T011 [P] [US2] Add `:focus-visible` ring classes to form inputs (`text-field.tsx`, `text-area.tsx`, `select.tsx`)
- [x] T012 [P] [US2] Add interactive states to selection controls (`checkbox.tsx`, `radio-group.tsx`, `switch.tsx`)
- [x] T013 [P] [US2] Add hover effects to clickable cards or list items (`card.tsx`, `list.tsx`)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Smooth UI Animations (Priority: P3)

**Goal**: Add smooth transitions for state changes and entry animations.

**Independent Test**: Toggling states results in smooth transitions; new items fade in.

### Implementation for User Story 3

- [x] T014 [P] [US3] Add `transition-all` and duration classes to interactive components (`button.tsx`, `input.tsx`, `switch.tsx`)
- [x] T015 [P] [US3] Add entry animations (fade-in) to `list.tsx` items or dynamic content
- [x] T016 [P] [US3] Add smooth height transitions to collapsible elements (if applicable in `accordion.tsx` or similar)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 Verify all components in `components/json-render/ui/` have removed `style={{...}}` props where possible
- [x] T018 Verify Dark Mode compatibility for all refactored components
- [x] T019 Run local sandbox validation according to `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Best implemented after US1 refactoring, but can be done in parallel if files are locked/merged carefully.
- **User Story 3 (P3)**: Best implemented after US1 refactoring.

### Parallel Opportunities

- All component refactoring tasks in Phase 3 (T004-T009) can run in parallel.
- Interactive state additions in Phase 4 (T010-T013) can run in parallel.
- Animation additions in Phase 5 (T014-T016) can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1) -> **MVP Delivered** (Consistent Look & Feel).
3. Validate visual consistency.

### Incremental Delivery

1. **Iteration 1**: Static styling (US1) - makes it look right.
2. **Iteration 2**: Interactive states (US2) - makes it feel responsive.
3. **Iteration 3**: Animations (US3) - makes it feel polished.
