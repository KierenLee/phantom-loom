---
name: semi-color-enforcer
description: Expert in the Semi Design color system. Ensures all frontend code uses standard CSS variables (tokens) instead of hardcoded hex/RGB values to maintain consistency and dark mode compatibility.
triggers: When writing CSS, SCSS, Less, Styled Components, or inline styles involving colors.
---

# Core Rules (Critical)
1.  **No Hardcoded Colors**: Never use hex codes (e.g., `#0064fa`) or RGB values. Always use the corresponding CSS variable (e.g., `var(--semi-color-primary)`).
2.  **Semantic Usage**:
    *   Use `primary` for main actions/buttons.
    *   Use `danger` for destructive actions/errors.
    *   Use `text-0` to `text-3` for typography hierarchy (0 is darkest/main, 3 is lightest/placeholder).
    *   Use `bg-0` to `bg-4` for container backgrounds/layers.
3.  **State Modifiers**: Respect state tokens for interaction:
    *   `:hover` $\rightarrow$ `-hover`
    *   `:active` $\rightarrow$ `-active`
    *   `:disabled` $\rightarrow$ `-disabled`

# Token Knowledge Base
*Refer to this mapping when selecting colors:*

## Brand & Functional Colors
| Category | Base Token | States (Active/Disabled/Hover) |
| :--- | :--- | :--- |
| **Primary** | `var(--semi-color-primary)` | `-active`, `-disabled`, `-hover` |
| **Secondary** | `var(--semi-color-secondary)` | `-active`, `-disabled`, `-hover` |
| **Tertiary** | `var(--semi-color-tertiary)` | `-active`, `-hover` |
| **Success** | `var(--semi-color-success)` | `-active`, `-disabled`, `-hover` |
| **Warning** | `var(--semi-color-warning)` | `-active`, `-hover` |
| **Danger** | `var(--semi-color-danger)` | `-active`, `-hover` |
| **Info** | `var(--semi-color-info)` | `-active`, `-disabled`, `-hover` |

## Neutral & Structural Colors
| Category | Tokens | Usage |
| :--- | :--- | :--- |
| **Text** | `text-0`, `text-1`, `text-2`, `text-3` | 0=Main, 1=Secondary, 2=Tertiary, 3=Placeholder |
| **Fill** | `fill-0`, `fill-1`, `fill-2` | Icons, decorative shapes, weak backgrounds |
| **Background** | `bg-0` ... `bg-4` | App background and card layers |
| **Border** | `border` | Standard borders |
| **Shadow** | `shadow` | Box shadows |

## Light Palette (Backgrounds/Weak States)
*   **Patterns**: `var(--semi-color-{type}-light-{state})`
*   **Types**: `primary`, `secondary`, `tertiary`, `success`, `warning`, `danger`, `info`
*   **States**: `default` (base), `hover`, `active`
*   *Example*: `var(--semi-color-primary-light-default)` for a light blue background tag.

## Data Visualization (Charts)
*   `data-0` through `data-19` (Sequential palette for categorical data)

# Coding Examples

## ✅ Correct Usage (CSS/SCSS)
```css
.submit-btn {
  background-color: var(--semi-color-primary);
  color: var(--semi-color-white);
  border: 1px solid var(--semi-color-primary);
}

.submit-btn:hover {
  background-color: var(--semi-color-primary-hover);
  border-color: var(--semi-color-primary-hover);
}

.error-message {
  color: var(--semi-color-danger);
  background: var(--semi-color-danger-light-default); /* Light red bg */
}

.card {
  background: var(--semi-color-bg-1);
  border: 1px solid var(--semi-color-border);
  color: var(--semi-color-text-0);
}
```

## ✅ Correct Usage (React Inline Styles)
```jsx
<div style={{ 
  backgroundColor: 'var(--semi-color-bg-2)',
  color: 'var(--semi-color-text-1)',
  borderBottom: '1px solid var(--semi-color-border)' 
}}>
  <span style={{ color: 'var(--semi-color-warning)' }}>Alert</span>
</div>
```

## ❌ Incorrect Usage (DO NOT DO THIS)
```css
/* Forbidden: Hardcoded hex codes */
.btn {
  background-color: #0064fa; /* VIOLATION: Use --semi-color-primary */
  color: #1c1f23;            /* VIOLATION: Use --semi-color-text-0 */
}

/* Forbidden: Wrong state logic */
.btn:hover {
  opacity: 0.8;              /* VIOLATION: Use --semi-color-primary-hover instead */
}
```