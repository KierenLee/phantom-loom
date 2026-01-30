# Feature Specification: Phantom Loom UI Transformation

**Feature Branch**: `001-phantom-loom-ui`  
**Created**: 2026-01-23  
**Status**: Draft  
**Input**: User description: "将app/assistant.tsx改造成一个agentic驱动的游戏生成平台核心页面，保留对话部分，去掉历史消息列表，header进行适当改造，增加logo和 'phantom loom' 的slogen（解释：“幻影织机”。将 AI 比作一台织布机，将代码（丝线）编织成肉眼可见的虚拟幻象（游戏）。）"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Game Generation Platform (Priority: P1)

As a Game Creator, I want to access the Phantom Loom interface with clear branding and a focused workspace, so that I can generate games without distractions.

**Why this priority**: Defines the core identity and user experience of the new platform page.

**Independent Test**: Verify the page loads with the correct branding and simplified layout.

**Acceptance Scenarios**:

1. **Given** the user lands on the assistant page, **When** the page loads, **Then** the header displays the "Phantom Loom" logo/text and slogan.
2. **Given** the user hovers over the slogan/logo, **When** hovering, **Then** a tooltip or description appears explaining "幻影织机。将 AI 比作一台织布机，将代码（丝线）编织成肉眼可见的虚拟幻象（游戏）。".
3. **Given** the user looks at the page layout, **When** viewing the sidebar area, **Then** the history message list is NOT visible.

---

### User Story 2 - Focused Conversation Flow (Priority: P1)

As a Game Creator, I want to converse with the agent and view generated games in a unified view, so that the creation process is seamless.

**Why this priority**: Ensures the core functionality (chat + preview) remains intact after UI changes.

**Independent Test**: Verify chat and preview interaction works without the sidebar.

**Acceptance Scenarios**:

1. **Given** the history list is removed, **When** the user sends a message, **Then** the conversation continues in the main thread view.
2. **Given** the user requests a game generation, **When** the game is generated, **Then** the preview panel updates correctly alongside the chat.

## Edge Cases

- **Mobile View**: How does the layout adapt on smaller screens without the sidebar toggle? The system should ensure the chat and preview stack or remain accessible.
- **Long Slogan**: If the slogan text is too long for the header on small screens, it should truncate or wrap gracefully.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display "Phantom Loom" branding in the header.
- **FR-002**: System MUST display the slogan explanation ("幻影织机。将 AI 比作一台织布机，将代码（丝线）编织成肉眼可见的虚拟幻象（游戏）。") as a tooltip or subtitle in the header.
- **FR-003**: System MUST remove the history message list sidebar from the interface.
- **FR-004**: System MUST remove sidebar-related controls (trigger buttons, separators) that are no longer functional.
- **FR-005**: System MUST maintain the existing Chat and Preview side-by-side layout (or adaptive layout) filling the available space.

### Key Entities

- **Logo/Branding**: Visual representation of "Phantom Loom".
- **Slogan**: The text and its explanation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The history list sidebar is completely removed from the page view.
- **SC-002**: The Header contains the exact text "Phantom Loom".
- **SC-003**: The Slogan explanation is visible upon user interaction (hover) or permanently displayed.
- **SC-004**: Game generation and preview workflow functions without errors in the new layout.

## Assumptions

- **A-001**: Since no specific logo asset was provided, a text-based representation or a placeholder icon will be used.
