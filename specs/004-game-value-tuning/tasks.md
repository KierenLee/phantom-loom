# Tasks: 游戏数值修改 (Game Value Tuning)

## Implementation Tasks

- [x] **Refactor Catalog** (`lib/catalog.ts`) <!-- id: 0 -->
    - Update `GameNumericalCatalog` descriptions to Chinese.
    - Define `actions` schema to include "save" (保存) and "reset" (重置).
- [x] **Update Prompt Definition** (`prompt/json-render.ts`) <!-- id: 1 -->
    - Translate `GameVisualizationPrompt` description and instructions to Chinese.
    - Add explicit rule: "对于数字类型的字段，必须使用 Slider 组件，禁止使用 TextField" (For number fields, must use Slider, forbid TextField).
- [x] **Update API Route** (`app/api/json_render/route.ts`) <!-- id: 2 -->
    - Verify prompt injection.
    - Localize any inline error messages or supplementary prompts.
- [x] **Implement Debug Handlers** (`app/debug/json_render/page.tsx`) <!-- id: 3 -->
    - Add `onAction` handler to `JSONRender` component (or wherever actions are emitted).
    - Implement `save`: Log current JSON to console/alert.
    - Implement `reset`: Reset JSON to initial state.

## Verification Tasks

- [x] **Verify Prompt Generation** <!-- id: 4 -->
    - Use Debug page to generate UI for number fields.
    - Confirm Slider is used.
- [x] **Verify Actions** <!-- id: 5 -->
    - Click "保存" and "重置", verify behavior.
