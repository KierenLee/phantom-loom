# Quickstart

## Usage in Assistant UI

To use the `displayGameNumericalSetting` tool in the assistant, ensure it is registered in `components/registry.tsx` (or wherever the tool registry is maintained) and the corresponding component is imported.

### 1. Implementation

The component is implemented in `components/assistant-ui/game-numerical-setting/index.tsx`.

```tsx
import { GameNumericalSetting } from "@/components/assistant-ui/game-numerical-setting";
```

### 2. Registry Registration

Add to the `AssistantRuntimeProvider` or tool registry:

```tsx
// Example registry entry
{
  displayGameNumericalSetting: GameNumericalSetting,
}
```

### 3. Invocation

The assistant can invoke the tool with:

```json
{
  "name": "displayGameNumericalSetting",
  "arguments": {
    "initialData": {
      "player": { "hp": 100, "atk": 10 },
      "enemies": [...]
    }
  }
}
```
