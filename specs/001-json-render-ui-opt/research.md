# Research: JSON Render UI Optimization

**Feature**: `001-json-render-ui-opt`
**Date**: 2026-01-23

## 1. Styling Strategy

**Decision**: Migrate from inline `style` objects to Tailwind CSS utility classes.

**Rationale**:
- **Consistency**: The main app uses Tailwind (`app/globals.css` with `@theme`). Using inline styles creates a disconnect and makes theming harder.
- **Performance**: Utility classes are generally more performant than inline styles for repeated components.
- **Maintainability**: Tailwind allows using abstract classes like `bg-primary` instead of `var(--primary)`, making the code cleaner.

**Implementation Details**:
- **Colors**: Use Tailwind classes that map to variables: `bg-primary`, `text-primary-foreground`, `border-border`.
- **Spacing**: Replace pixel values (e.g., `padding: "16px"`) with Tailwind spacing (e.g., `p-4`).
- **Typography**: Use `text-sm`, `font-medium` instead of hardcoded font sizes.

**Alternatives Considered**:
- **CSS Modules**: Rejected because the project is already set up for Tailwind (v4).
- **Keep Inline Styles**: Rejected because it prevents using Tailwind's modifiers (hover, active, dark mode) easily and is harder to maintain.

## 2. Interactive Feedback & Animations

**Decision**: Use Tailwind's transition and state modifiers.

**Rationale**:
- **Simplicity**: No need for external animation libraries (like Framer Motion) for simple UI feedback.
- **Performance**: CSS transitions are GPU-accelerated.

**Implementation Details**:
- **Hover**: `hover:bg-primary/90` or similar opacity changes.
- **Active**: `active:scale-95` for buttons/cards to simulate a "press".
- **Focus**: `focus-visible:ring-2 focus-visible:ring-ring`.
- **Transitions**: `transition-all duration-200`.

## 3. Component Mapping

Current analysis of `components/json-render/ui/`:

| Component | Current Style | Target Tailwind Classes (Example) |
|-----------|---------------|-----------------------------------|
| `Button` | Inline `variants` | `bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95` |
| `Card` | Inline `var(--card)` | `bg-card text-card-foreground border border-border shadow-sm` |
| `Input` | (Assumed) Inline | `flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50` |

## 4. Unknowns Resolved

- **Animation Library**: Use standard CSS/Tailwind.
- **Theme Source**: `app/globals.css` is the source of truth.
