# Data Model: 游戏数值修改 (Game Value Tuning)

## Catalog Schema Updates (`lib/catalog.ts`)

### Actions
The `actions` property in `gameNumericalCatalog` will be updated to support the following action types:

| Action ID | Label (CN) | Description |
|-----------|------------|-------------|
| `save`    | 保存       | Persist current values to backend/file |
| `reset`   | 重置       | Revert values to initial state |

### Component Constraints (Prompt-driven)

While the Zod schema allows `TextField`, the *generated* JSON for number fields must adhere to:

```json
{
  "component": "Slider",
  "props": {
    "min": number,
    "max": number,
    "step": number,
    "valuePath": string
  }
}
```

Instead of:
```json
{
  "component": "TextField",
  "props": {
    "type": "number"
  }
}
```
