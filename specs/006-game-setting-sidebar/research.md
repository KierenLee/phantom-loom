# Research: Game Setting Sidebar

## Decisions

### 1. State Management
**Decision**: Use `zustand` to manage the visibility and data of the Game Settings Sidebar.
**Rationale**: `zustand` is already used in the project (`lib/store.ts` for `PreviewStore`). It provides a simple, lightweight way to share state between the Chat Tool (which receives data) and the Sidebar (which displays it).
**Alternatives**:
- **Context API**: Could work, but `zustand` avoids provider wrapping hell and is already established.
- **URL Search Params**: Not suitable for large JSON objects (initialData).

### 2. Component Separation
**Decision**: Split `GameNumericalSetting` into:
1.  **Tool Component** (`GameNumericalSettingTool`): Registers with `@assistant-ui/react`, receives args, updates the Store, and renders a minimal status message ("Settings opened in sidebar").
2.  **Sidebar Component** (`GameNumericalSettingSidebar`): Subscribes to the Store and renders the actual `GameNumericalSettingView` (UI with `json-render`).
**Rationale**: Decouples the data reception (chat flow) from the data presentation (sidebar), satisfying the requirement to move it out of the flow.

### 3. Layout Integration
**Decision**: Add `GameNumericalSettingSidebar` to `app/assistant.tsx` as a sibling to `PreviewPanel`.
**Rationale**: Allows them to coexist. If both are open, they can share the space or stack. Given "adjacent" requirement, a simple flex layout or conditional rendering (tabs) might be needed if space is tight. For MVP, we will render it alongside `PreviewPanel`.

## Unknowns Resolved

- **Where is PreviewPanel?**: Found in `components/assistant-ui/preview-panel.tsx` and used in `app/assistant.tsx`.
- **How to hide from chat?**: The Tool Component will render minimal UI or `null` (though `makeAssistantToolUI` expects some render, a small "View Settings" button or text is good UX).
