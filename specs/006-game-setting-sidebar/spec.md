# Feature Specification: Game Setting Sidebar

**Feature Branch**: `006-game-setting-sidebar`  
**Created**: 2026-01-27  
**Status**: Draft  
**Input**: User description: "将 components/assistant-ui/game-numerical-setting/index.tsx 从对话流中，改为固定在页面的右侧区域，紧挨着PreviewPanel"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persistent Game Settings Sidebar (Priority: P1)

As a game creator, I want the game numerical settings to be always visible on the right side of the screen so that I can tweak values without losing context or scrolling through the chat history.

**Why this priority**: This is the core requirement of the feature, improving usability by making settings persistent and easily accessible.

**Independent Test**: Can be fully tested by verifying the `GameNumericalSetting` component appears on the right sidebar and not in the chat flow.

**Acceptance Scenarios**:

1. **Given** the user is on the game creation page, **When** the page loads, **Then** the game numerical settings panel should be visible on the right side of the page, adjacent to the PreviewPanel.
2. **Given** the chat conversation is active, **When** the agent would previously render settings in the chat, **Then** the settings should NOT appear in the chat stream (or be replaced by a text notification), and the right sidebar should be available for interaction.
3. **Given** the user interacts with the settings in the sidebar, **When** values are changed, **Then** the game configuration should update immediately (preserving existing functionality).

---

### Edge Cases

- **Small Screens**: What happens on mobile or small screens?
  - *Assumption*: On mobile devices, the sidebar might be hidden behind a toggle or stacked, but for this specific request (workbench tool), we prioritize desktop layout.
- **Empty State**: What happens if no game is generated yet?
  - The settings panel should handle the empty state gracefully (e.g., showing a placeholder or being hidden until data is available).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render the `components/assistant-ui/game-numerical-setting/index.tsx` component in a fixed sidebar area on the right side of the page.
- **FR-002**: The sidebar MUST be positioned adjacent to the `PreviewPanel`.
- **FR-003**: The system MUST remove the `GameNumericalSetting` component from the Chat Message rendering logic (so it no longer appears inline with messages).
- **FR-004**: The sidebar layout MUST allow the user to view the PreviewPanel and Settings simultaneously (or toggle between them if space is constrained, though "adjacent" implies side-by-side or tabbed). *Assumption*: We will place it in a way that allows easy access, likely splitting the right pane or adding a tab/toggle if space is tight, but "fixed on the right" implies a permanent dedicated space.
- **FR-005**: The settings component MUST maintain its existing state management and functionality (updating game values).

### Key Entities

- **GameConfiguration**: The data structure holding the numerical settings.
- **UI Layout**: The overall page layout structure (Chat | Preview | Settings).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Game Numerical Setting component is always visible on the right side of the viewport on desktop screens.
- **SC-002**: The Game Numerical Setting component does NOT appear in the chat message history.
- **SC-003**: Users can successfully modify game values using the sidebar component.
