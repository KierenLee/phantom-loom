# Data Model: Game Setting Sidebar

## Client-Side Store (`GameSettingsState`)

We will add a new store slice or a separate store for Game Settings using `zustand`.

```typescript
interface GameNumericalSettingArgs {
  title: string;
  initialData: string; // JSON string
  dataSchema: string;  // JSON string
}

interface GameSettingsState {
  // Data received from the LLM Tool
  settingArgs: GameNumericalSettingArgs | null;
  
  // Visibility state
  isOpen: boolean;
  
  // Actions
  setSettings: (args: GameNumericalSettingArgs) => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
}
```

## Key Entities

### GameConfiguration (Existing)
*Refers to the JSON structure passed in `initialData`.*
- **Structure**: Dynamic, defined by `dataSchema`.
- **Persistence**: Saved via `/api/sandbox/${threadId}/config.json`.
