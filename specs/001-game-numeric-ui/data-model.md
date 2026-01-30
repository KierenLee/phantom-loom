# Data Model

## Tool Input: `GameNumericalSettingArgs`

The tool receives a single argument object containing the game configuration.

```typescript
interface GameNumericalSettingArgs {
  /**
   * The initial game configuration object.
   * Can be any valid JSON object representing game stats.
   */
  initialData: Record<string, unknown>;
}
```

## Internal State: `JSONRenderContext`

Managed by `@json-render/react`'s `DataProvider`.

```typescript
interface DataContext {
  data: Record<string, unknown>; // Current state of the form
  setData: (data: Record<string, unknown>) => void;
  update: (path: string, value: unknown) => void;
}
```

## UI Generation State

Managed by `useUIStream`.

```typescript
interface UIStreamState {
  tree: JSONRenderTree | null; // The generated UI schema
  isStreaming: boolean;
  error: Error | null;
}
```
