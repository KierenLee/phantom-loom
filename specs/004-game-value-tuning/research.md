# Research: 游戏数值修改 (Game Value Tuning)

## Decisions

### 1. Game Value Modification Actions
**Decision**: Implement standard actions: "保存" (Save), "重置" (Reset).
**Rationale**: These are the minimum viable actions for a value tuning workflow.
**Impact**:
- Update `lib/catalog.ts` `actions` definition.
- Update `app/debug/json_render/page.tsx` to handle `type: 'save'` and `type: 'reset'` events.

### 2. Slider Enforcement
**Decision**: Enforce via System Prompt instructions.
**Rationale**: `prompt/json-render.ts` controls the generation logic. Explicitly stating "For number fields, use Slider, do not use TextField" (in Chinese) is the most direct way.
**Alternatives**: Modifying `catalog.ts` schema to remove `TextField` from number types. This is safer but might break other use cases if the catalog is shared. Since the prompt is "game value modification" specific, prompt-level control is better for now.

## Unknowns Resolved

- **Actions**: Defined as Save/Reset.
- **Slider Rule**: Enforced via Prompt.
