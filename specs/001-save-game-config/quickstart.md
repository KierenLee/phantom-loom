# Quickstart: Save Game Config

## Usage

The saving functionality is integrated into the `GameNumericalSetting` component.

### Prerequisites
1. Ensure `thread_id` is set in `sessionStorage`.
   ```javascript
   sessionStorage.setItem("thread_id", "your-thread-id");
   ```
2. Ensure the corresponding workspace directory exists on the server (usually created by the agent initialization).
   - Server path: `./workspace/your-thread-id/`

### Triggering Save
1. Render the `GameNumericalSetting` component.
2. Modify values in the form.
3. Click the "Save" button in the UI.

### Verification
Check the server file system:
```bash
cat workspace/your-thread-id/config.json
```
The content should match the JSON data from the UI.

## Troubleshooting
- **"无法获取 thread_id" Error**: Check `sessionStorage` in DevTools Application tab.
- **"Save failed" (500/403)**: Check server logs. Ensure no path traversal characters (`..`) are in the `thread_id` or path.
