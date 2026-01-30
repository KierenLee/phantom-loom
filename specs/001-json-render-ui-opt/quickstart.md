# Quickstart: JSON Render UI Optimization

**Feature**: `001-json-render-ui-opt`

This feature refactors the `json-render` components to use the global application theme.

## Verifying Changes

Since this is a UI refactor, verification is primarily visual.

### 1. Launch the Sandbox

Use the local sandbox to preview the JSON components.

```bash
npm run dev
# Open http://localhost:3000/sandbox/json-render (or appropriate route)
```

*(Note: Verify the exact sandbox route for json-render components)*

### 2. Check Visual Consistency

1.  **Buttons**: Hover over buttons. They should darken slightly. Click them; they should scale down briefly.
2.  **Cards**: Should match the main dashboard cards (white/black background, subtle border).
3.  **Inputs**: Focus on an input. It should have a ring matching the brand color (`--ring`).
4.  **Dark Mode**: Toggle the app's dark mode. Components should update colors automatically without page reload.

## Development Guidelines

When adding new components to `json-render`:

1.  **Do NOT use `style={{ ... }}`**.
2.  Use **Tailwind classes** for all styling.
3.  Use **Semantic Colors** (`bg-card`, `text-muted-foreground`) instead of hardcoded hex values.
4.  Ensure `element.props.className` is merged with default classes using `cn()` (classnames utility) if available, or template literals.

```typescript
// Example
import { cn } from "@/lib/utils"; // If available

export function MyComponent({ element }) {
  return (
    <div className={cn("p-4 bg-card rounded-lg border", element.props.className)}>
      {/* content */}
    </div>
  );
}
```
