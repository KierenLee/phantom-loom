# Research: Generate Page UI Optimization

**Feature**: `002-generate-page-ui-opt`
**Date**: 2026-01-24

## 1. Styling Strategy

**Decision**: Replace all inline `style` objects with Tailwind utility classes.

**Rationale**:
- **Unified Theme**: Ensures the generation page looks like the rest of the app (which now uses `app/globals.css` and Tailwind).
- **Maintainability**: Utility classes are easier to read and maintain than mixed inline styles and CSS files.
- **Dark Mode**: Tailwind classes like `bg-card` automatically handle dark mode switching via CSS variables defined in `globals.css`.

**Specific Mappings**:

| Inline Style | Tailwind Class |
|--------------|----------------|
| `background: "var(--card)"` | `bg-card` |
| `color: "var(--foreground)"` | `text-foreground` |
| `border: "1px solid var(--border)"` | `border border-border` |
| `borderRadius: "var(--radius)"` | `rounded-[var(--radius)]` (or `rounded-lg` if matches) |
| `padding: "12px 16px"` | `px-4 py-3` |
| `display: "flex", gap: 8` | `flex gap-2` |

## 2. Component Identification

The `page.tsx` contains several inline UI elements that act as components:
- **Prompt Input**: Text input with styling.
- **Action Buttons**: "Generate", "Export Project", "Clear".
- **Example Buttons**: Small pills for example prompts.
- **Preview Container**: The main area rendering the result.
- **Export Modal**: A fixed overlay with a file list and code preview.

**Refactoring Approach**:
- Keep them in the same file for now (as per "in-place refactor" scope).
- Apply Tailwind classes directly to the JSX elements.
- Use `cn()` helper if conditional logic is complex (e.g., streaming state).

## 3. `page.css` Analysis

The file `app/generate/page.css` contains:
- `* { box-sizing: border-box; }`: Handled by Tailwind Preflight.
- Root variables (`--background`, `--foreground`...): Redefinitions of what's already in `globals.css`.
- Global element styles (`html`, `body`, `button`, `input`...): Redundant or conflicting with `globals.css`.

**Conclusion**: Delete `page.css` entirely. The global styles will be provided by `app/globals.css` via `layout.tsx`.

## 4. Unknowns Resolved

- **Modal Implementation**: It's a custom inline modal. We will style it with `fixed inset-0 z-50 bg-black/80 flex items-center justify-center`.
- **Layout**: It uses a max-width container centered on screen. We'll use `max-w-screen-lg mx-auto p-6`.
