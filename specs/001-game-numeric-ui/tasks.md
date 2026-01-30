# Implementation Tasks: Game Numerical System Visual Editor

**Feature Branch**: `001-game-numeric-ui`
**Feature Spec**: [spec.md](./spec.md)

## Phase 1: Setup
*Goal: Prepare the project structure for the new component.*

- [ ] T001 Verify/Create directory structure for components/assistant-ui/game-numerical-setting/

## Phase 2: Foundational
*Goal: Ensure all necessary types and dependencies are ready.*

- [ ] T002 Define `GameNumericalSettingArgs` and local interfaces in components/assistant-ui/game-numerical-setting/index.tsx

## Phase 3: User Story 1 - Visual Editing of Game Configuration
*Goal: Implement the visual editor component allowing users to view and modify game configurations.*
*Priority: P1*

**Independent Test**: Invoke the tool with a sample game config; verify UI renders and updates data.

- [ ] T003 [US1] Implement `ActionWrapper` to handle save actions in components/assistant-ui/game-numerical-setting/index.tsx
- [ ] T004 [US1] Implement `DashboardContent` (UI generation & rendering logic) in components/assistant-ui/game-numerical-setting/index.tsx
- [ ] T005 [US1] Implement `GameNumericalSettingView` (Provider composition) in components/assistant-ui/game-numerical-setting/index.tsx
- [ ] T006 [US1] Implement `displayGameNumericalSetting` export using `makeAssistantToolUI` in components/assistant-ui/game-numerical-setting/index.tsx

## Phase 4: Polish & Integration
*Goal: Register the tool and ensure it functions correctly within the Assistant environment.*

- [ ] T007 Register the new tool in the application tool registry (check `app/assistant.tsx` or `components/registry.tsx`)
- [ ] T008 [Manual] Verify the tool renders correctly with sample data in the Assistant UI

## Dependencies
- T003, T004, T005 depend on T001, T002
- T006 depends on T005
- T007 depends on T006

## Implementation Strategy
- We will build the component in a single file (`index.tsx`) as it is a self-contained tool UI, mirroring the structure of the reference implementation (`app/debug/json_render/page.tsx`).
- We will prioritize the visual rendering capability over the code export feature if conflicts arise, as the primary goal is "Visual Editing".
