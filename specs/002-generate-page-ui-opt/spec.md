# Feature Specification: Generate Page UI Optimization

**Feature Branch**: `002-generate-page-ui-opt`
**Created**: 2026-01-24
**Status**: Draft
**Input**: User description: "按照相同的逻辑，修改 app/generate/page.tsx，将样式优化为与 app/globals.css 风格一致，并移除内联样式"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Visual Style (Priority: P1)

The user sees a dashboard generation interface that visually matches the rest of the application, utilizing the global design tokens (colors, fonts, radius).

**Why this priority**: Visual consistency is the primary goal of this refactor.

**Independent Test**: Visually compare the generation page with the JSON renderer components. They should share the same background colors, border styles, and typography.

**Acceptance Scenarios**:

1. **Given** the dashboard page, **When** displayed, **Then** the main container background, inputs, and buttons must use standard Tailwind classes (e.g., `bg-card`, `border-input`, `text-foreground`).
2. **Given** the "Generate" button, **When** viewed, **Then** it must use the `primary` variant style consistent with the Button component.
3. **Given** the example prompt buttons, **When** viewed, **Then** they should look like `secondary` or `outline` variant buttons.

---

### User Story 2 - Interactive & Responsive Feedback (Priority: P2)

The user receives visual feedback when interacting with inputs, buttons, and the export modal.

**Why this priority**: Improves usability by indicating interactive elements and states.

**Independent Test**: Hover over buttons and focus on inputs; observe color changes and focus rings.

**Acceptance Scenarios**:

1. **Given** the prompt input, **When** focused, **Then** a focus ring matching the global theme (`ring-ring`) should appear.
2. **Given** any button (Generate, Export, Clear, Examples), **When** hovered, **Then** its background should subtlely change (`hover:bg-primary/90` or `hover:bg-accent`).
3. **Given** the code export modal, **When** opened, **Then** the file list items should highlight when selected or hovered.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace all inline `style={{ ... }}` objects in `app/generate/page.tsx` with Tailwind CSS classes.
- **FR-002**: System MUST remove the unused `app/generate/page.css` file.
- **FR-003**: All color references MUST use semantic Tailwind classes (e.g., `bg-background`, `text-muted-foreground`, `border-border`) instead of hex codes or `var(--...)` usage.
- **FR-004**: Interactive elements (inputs, buttons) MUST support keyboard focus states (`focus-visible`).
- **FR-005**: The layout MUST use Flexbox/Grid via Tailwind utility classes.

### Key Entities

- **Page Layout**: The structure of the generation page (Prompt input, Examples, Preview area, Export modal).
- **Design Tokens**: The global CSS variables mapped to Tailwind classes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 occurrences of `style={{ ... }}` in `app/generate/page.tsx` (except potentially for dynamic values like chart heights, if any).
- **SC-002**: `app/generate/page.css` is deleted.
- **SC-003**: UI visual regression test passes (manual verification that layout is preserved but styled correctly).
- **SC-004**: Dark mode toggle correctly inverts colors on the generation page without extra code.
