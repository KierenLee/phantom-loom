# Feature Specification: Optimize Generate Inputs

**Feature Branch**: `003-optimize-generate-inputs`
**Created**: 2026-01-24
**Status**: Draft
**Input**: User description: "优化 app/generate/page.tsx 中 Initial Data Input 和 Prompt Input的交互和类型，改为多行输入，并统一style"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multi-line Prompt Input (Priority: P1)

The user can enter multi-line descriptions in the prompt input area, allowing for more detailed and structured generation requests.

**Why this priority**: Core interaction improvement for better user experience with complex prompts.

**Independent Test**:
1. Type a long prompt with multiple lines in the prompt input.
2. Verify that the input expands or has scroll capability.
3. Verify that the "Generate" action still works correctly (e.g. Enter to submit might need adjustment, or rely on the button).

**Acceptance Scenarios**:

1. **Given** the prompt input, **When** viewed, **Then** it should be a `textarea` instead of `input[type=text]`.
2. **Given** the prompt input, **When** typed into, **Then** it should support line breaks.
3. **Given** the prompt input, **When** focused, **Then** it should have the same visual style (border, ring, background) as other inputs in the app (following `globals.css`).

---

### User Story 2 - Multi-line Initial Data Input (Priority: P2)

The user can enter and view JSON data in a multi-line format for the "Initial Data" input, making it easier to read and edit large JSON objects.

**Why this priority**: Editing JSON in a single-line input is difficult and error-prone.

**Independent Test**:
1. Paste a multi-line JSON object into the Initial Data input.
2. Verify it preserves formatting and is readable.
3. Verify that valid JSON updates the `initialData` state.

**Acceptance Scenarios**:

1. **Given** the initial data input, **When** viewed, **Then** it should be a `textarea` (or code editor style input) instead of `input[type=text]`.
2. **Given** the initial data input, **When** valid JSON is entered, **Then** it should be parsed correctly.
3. **Given** the initial data input, **When** styled, **Then** it should match the global theme (Tailwind classes).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Replace `input` with `textarea` for Prompt Input in `DashboardContent`.
- **FR-002**: Replace `input` with `textarea` for Initial Data Input in `DashboardPage`.
- **FR-003**: Apply consistent Tailwind styling to both textareas (matching `bg-card`, `border-input`, `text-foreground`, `focus-visible:ring`).
- **FR-004**: Ensure `textarea` auto-resizes or has a reasonable default height (e.g., `rows={3}` for prompt, `rows={5}` for data).
- **FR-005**: (Optional but good UX) Support "Cmd+Enter" to submit the prompt form since "Enter" will now create a new line.

### Key Entities

- **Prompt Input**: The main interaction point for generation.
- **Initial Data Input**: The configuration input for providing context data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both inputs accept multi-line text.
- **SC-002**: Visual consistency is maintained (no unstyled native textareas).
- **SC-003**: Generation flow remains functional with the new input types.
