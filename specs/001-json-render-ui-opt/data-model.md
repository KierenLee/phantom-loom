# Data Model: JSON Render UI Optimization

**Feature**: `001-json-render-ui-opt`
**Date**: 2026-01-23

## Component Props

No changes to the *logic* data model (databases, API schemas) are required. However, we define the standard styling props that components are expected to handle gracefully via the styling update.

### Shared Props

All UI components in `json-render` typically receive:

```typescript
interface ComponentRenderProps {
  element: {
    props: {
      // Existing props that need strict typing/handling during style refactor
      variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
      size?: "sm" | "md" | "lg";
      disabled?: boolean;
      loading?: boolean;
      // ... specific component props
    };
  };
  // ... other render props
}
```

## Styling Mappings (Internal Model)

The "Data Model" for this feature is the mapping between *Logical Variants* and *Visual Styles*.

### Button Variants

| Variant | Tailwind Classes |
|---------|------------------|
| `primary` | `bg-primary text-primary-foreground hover:bg-primary/90` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `danger` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |
| `outline` | `border border-input bg-background hover:bg-accent hover:text-accent-foreground` |

### Input States

| State | Visual Style |
|-------|--------------|
| `Default` | `border-input bg-transparent` |
| `Focus` | `ring-1 ring-ring border-input` |
| `Disabled` | `opacity-50 cursor-not-allowed` |
| `Error` | `border-destructive text-destructive` |
