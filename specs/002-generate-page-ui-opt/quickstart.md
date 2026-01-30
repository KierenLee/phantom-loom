# Quickstart: Generate Page UI Optimization

**Feature**: `002-generate-page-ui-opt`

## Verification Guide

1.  **Start the app**: `npm run dev`
2.  **Navigate to**: `http://localhost:3000/generate` (or wherever the generate page is accessible).
3.  **Visual Check**:
    *   Background should match the main app (not black if main app is white, unless dark mode).
    *   Inputs and Buttons should look identical to the `json-render` components in the sandbox.
    *   Focus on the input field: should show a ring.
    *   Hover over "Generate": should change color.
4.  **Functional Check**:
    *   Type "dashboard": should generate UI.
    *   Click "Export Project": Modal should open.
    *   Modal file list should be scrollable and selectable.
    *   Close modal works.
5.  **Dark Mode**:
    *   Toggle system/app dark mode. The page should adapt automatically.
