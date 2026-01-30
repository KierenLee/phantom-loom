# Research: Game Config Save

## Context
Goal: Implement saving game numerical configuration to a specific file on the server.
Constraint: Path is `./workspace/${threadId}/config.json`, where `threadId` comes from `sessionStorage`.

## Decision: Extend Sandbox API
We will extend the existing `app/api/sandbox/[...path]/route.ts` to support `POST` method for file writing.

### Rationale
- **Reuse**: The existing route already handles path resolution and security checks (preventing directory traversal out of `workspace`).
- **Simplicity**: No need to create a new dedicated endpoint just for this file if we have a generic sandbox file access API.
- **Consistency**: Reading files is already done via this route (GET). Writing (POST/PUT) is a natural extension.

### Alternatives Considered
- **New Route `api/game/config`**: Could be more specific, but would duplicate the file writing logic and path validation. Since `config.json` is just a file in the workspace, treating it as a generic file resource is cleaner.
- **Server Action**: Next.js Server Actions could be used, but since the existing architecture seems to rely on API routes (indicated by `useRequest` and `useUIStream`), sticking to API routes keeps the pattern consistent.

## Frontend Implementation
- **Location**: `components/assistant-ui/game-numerical-setting/index.tsx` inside `ActionWrapper`.
- **Logic**:
  1. Retrieve `thread_id` from `sessionStorage`.
  2. If missing, `Toast.error` and return.
  3. `fetch('/api/sandbox/' + threadId + '/config.json', { method: 'POST', body: JSON.stringify(data) })`.
  4. Handle 200 OK -> `Toast.success`.
  5. Handle Errors -> `Toast.error`.

## Security
- The existing route checks `if (!fullPath.startsWith(workspaceRoot))`. This must be preserved in the POST handler to prevent writing arbitrary files on the server.
