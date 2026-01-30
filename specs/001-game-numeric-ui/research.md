# Phase 0: Research & Technical Decisions

**Feature**: Game Numerical System Visual Editor
**Status**: Completed

## Technical Context

- **Component Implementation**:
  - The feature will be implemented as a React component in `components/assistant-ui/game-numerical-setting/index.tsx`.
  - It will wrap the logic from `app/debug/json_render/page.tsx` but adapted for the Assistant UI tool interface.
  - **Pattern**: Usage of `makeAssistantToolUI` from `@assistant-ui/react` to register the tool UI.
  - **Tool Name**: `displayGameNumericalSetting`.

- **Dependencies**:
  - `@assistant-ui/react`: For `makeAssistantToolUI`.
  - `@json-render/react`: For `DataProvider`, `ActionProvider`, `VisibilityProvider`, `ValidationProvider`, `Renderer`, `useUIStream`, `useData`.
  - Internal Registry: `components/json-render/ui/index.ts` (exports `componentRegistry`).
  - Backend API: `/api/json_render` (used by `useUIStream`).

## Key Decisions

### 1. Tool UI Registration
**Decision**: Use `makeAssistantToolUI` generic helper.
**Rationale**: Consistent with existing tools (e.g., `GameCard` in `components/assistant-ui/game-card.tsx`).
**Implementation**:
```typescript
interface GameNumericalSettingArgs {
  initialData: Record<string, unknown>;
}

export const GameNumericalSetting = makeAssistantToolUI<GameNumericalSettingArgs, undefined>({
  toolName: "displayGameNumericalSetting",
  render: ({ args }) => <GameNumericalSettingView initialData={args.initialData} />,
});
```

### 2. State Management
**Decision**: Replicate the Provider stack from `app/debug/json_render/page.tsx`.
**Rationale**: The JSON Render engine requires specific providers (`DataProvider`, `ActionProvider`, etc.) to function correctly. These must wrap the renderer component.
**Structure**:
```tsx
<DataProvider initialData={args.initialData}>
  <ValidationProvider>
    <VisibilityProvider>
      <ActionWrapper>
        <DashboardContent />
      </ActionWrapper>
    </VisibilityProvider>
  </ValidationProvider>
</DataProvider>
```

### 3. API Integration
**Decision**: Reuse `/api/json_render` endpoint via `useUIStream`.
**Rationale**: No new backend endpoint needed; the existing one handles prompt-to-UI-schema generation.

### 4. Data Synchronization
**Decision**: Use `useData` hook for internal state.
**Rationale**: `DataProvider` manages the state. Changes in the generated UI (inputs) automatically update the context. We may need to expose this updated data back to the Assistant or user (e.g., via a "Save" action that logs to console or triggers a tool result update if supported).

## Alternatives Considered

- **Alternative**: Building a static form from JSON Schema.
  - **Rejected**: The requirement is to use "JSON Render" which supports dynamic, generative UI based on prompts, providing a richer experience than static forms.

## Unknowns Resolved

- **makeAssistantToolUI**: Validated usage via `components/assistant-ui/game-card.tsx`.
- **Component Registry**: Located at `components/json-render/ui/index.ts`.
- **API Endpoint**: Identified as `/api/json_render`.
