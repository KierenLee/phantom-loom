# Quickstart: 游戏数值修改 (Game Value Tuning)

## Testing the Feature

1.  **Start the Server**:
    ```bash
    pnpm run dev
    ```

2.  **Navigate to Debug Page**:
    Open [http://localhost:3000/debug/json_render](http://localhost:3000/debug/json_render)

3.  **Input Test Data**:
    In the "JSON Context" editor, paste some game data:
    ```json
    {
      "base_attack": 100,
      "defense": 50,
      "crit_rate": 0.05
    }
    ```

4.  **Generate UI**:
    In the prompt box, type: `生成一个数值调整面板` (Generate a value tuning panel).

5.  **Verify**:
    -   **Sliders**: Check that `base_attack`, `defense`, etc., are rendered as Sliders.
    -   **Language**: Check that labels and descriptions are in Chinese.
    -   **Actions**: Check for "保存" button.

6.  **Test Actions**:
    -   Modify values using sliders.
    -   Click "保存".
    -   Check the browser console or the debug page log area (if implemented) for the save event.
