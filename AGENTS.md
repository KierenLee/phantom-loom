# phantom-loom Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-24

## Active Technologies
- TypeScript 5.x, Node.js v22 + Next.js App Router, React 19, @douyinfe/semi-ui-19 (UI) (001-save-game-config)
- File System (JSON files in `workspace/`) (001-save-game-config)
- TypeScript 5.x, React 19 + `zustand` (State Management), `@assistant-ui/react` (Tool Integration), `@json-render/react` (Form Rendering) (006-game-setting-sidebar)
- Client-side Store (`zustand`), Server-side JSON files (via `/api/sandbox/${threadId}/config.json`) (006-game-setting-sidebar)

- TypeScript 5.x, React 19 (inferred), Node v22 + Next.js App Router, @json-render/core (internal), Zod (004-game-value-tuning)
- N/A (Client-side state / Debug page) (004-game-value-tuning)

- node v22、pnpm v10.9.0
- TypeScript 5.x, React 19 (inferred) + Tailwind CSS v4
- @json-render/react、@json-render/core
- @assistant-ui/react、@@assistant-ui/react-ai-sdk、@assistant-ui/react-markdown

## Project Structure

```text
src/
tests/
```

## Commands

- `pnpm run dev`: Start the development server
- `pnpm run build`: Build the project
- `pnpm test && npm run lint`: Run tests and linting

## Code Style

TypeScript 5.x, React 19 (inferred): Follow standard conventions

## Recent Changes
- 006-game-setting-sidebar: Added TypeScript 5.x, React 19 + `zustand` (State Management), `@assistant-ui/react` (Tool Integration), `@json-render/react` (Form Rendering)
- 001-save-game-config: Added TypeScript 5.x, Node.js v22 + Next.js App Router, React 19, @douyinfe/semi-ui-19 (UI)
- 001-save-game-config: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]




<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
