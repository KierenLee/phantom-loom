# Add API Switcher and Proxy

I will implement a feature to switch the API endpoint in the debug page and add a proxy route to handle cross-origin requests.

## Implementation Steps

### 1. Create Proxy API Route
Create a new file `app/api/proxy/route.ts` to forward requests to external URLs.
- **Function**: `POST`
- **Logic**:
    - Extract `url` from query parameters.
    - Forward the request body and headers to the target URL.
    - Return the response from the target URL (streaming supported).

### 2. Update Debug Page (`app/debug/page.tsx`)
Modify the page to include an API switcher in the header.
- **State Management**:
    - Add `apiBaseUrl` state (defaulting to `/api/evaluation`).
    - Manage `threadId` separately to persist it across API switches.
- **UI Components**:
    - Import `Dialog`, `Input`, `Button` from `@/components/ui`.
    - Add a "Settings" button (using `Settings` icon) in the header.
    - The dialog will allow users to input the API URL.
- **Logic**:
    - Construct the final API URL passed to `useChatRuntime`:
        - If the input URL is absolute (starts with `http`), use the proxy: `/api/proxy?url=${encodeURIComponent(url)}`.
        - Otherwise, use the URL directly.
    - Append `threadId` parameter to the URL.

## User Rules Compliance
- **Language**: Chinese (comments and UI text).
- **Comments**: Add function-level comments for exported functions.
- **System**: MacOS (file paths handled accordingly).
