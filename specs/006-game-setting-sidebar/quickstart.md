# Quickstart: Game Setting Sidebar

## Usage

### 1. Registering the Tool
The `GameNumericalSetting` component (exported from `index.tsx`) continues to serve as the Tool UI registration. It should be placed in the `Thread` context (e.g., in `app/assistant.tsx` or `registry.tsx` depending on setup).

```tsx
// app/assistant.tsx
import { GameNumericalSetting } from "@/components/assistant-ui/game-numerical-setting";

// ... inside provider
<GameNumericalSetting />
```

### 2. Displaying the Sidebar
The `GameNumericalSettingSidebar` component renders the actual settings UI. Place it in the layout where you want the sidebar to appear.

```tsx
// app/assistant.tsx
import { GameNumericalSettingSidebar } from "@/components/assistant-ui/game-numerical-setting/sidebar"; // or index export

// ... inside layout
<div className="flex">
  <Thread />
  <GameNumericalSettingSidebar />
  <PreviewPanel />
</div>
```

### 3. State Management
Use `useGameSettingsStore` to control visibility programmatically.

```tsx
import { useGameSettingsStore } from "@/lib/store";

const { toggleSettings } = useGameSettingsStore();
<button onClick={toggleSettings}>Settings</button>
```
